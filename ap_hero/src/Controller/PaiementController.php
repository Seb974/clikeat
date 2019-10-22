<?php
	/**
     * HomePage Controller
     *
     * This controller manage all about Home page
     *
     * @package      Some Package
     * @subpackage   Some Subpackage
     * @category     Home Page
     * @author       War Machines
     */
namespace App\Controller;

use App\Entity\CartItem as CartItem;
use App\Entity\Metadata;
use App\Entity\User;
use App\Entity\City;
use App\Entity\Orders;
use App\Service\Anonymize\AnonymizeService;
use App\Service\Cart\CartService;
use Doctrine\Common\Persistence\ObjectManager;
use Doctrine\ORM\EntityManagerInterface;
use Payplug;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class PaiementController extends AbstractController
{
    /**
	 * checkout
     * @Route("/checkout/{id}", name="checkout")
	 * @param  integer $id corresponding to the id of the current user
     * @param  App\Service\Cart\CartService $cartService
     * @param  Doctrine\ORM\EntityManagerInterface $em
	 *
	 * @return void
     */
    public function checkout($id, CartService $cartService, EntityManagerInterface $em )
    {
		Payplug\Payplug::setSecretKey( $_ENV['PAYPLUG_KEY'] );
		$user    = $em->getRepository( User::class )->find( $id );
		$cart    = $user->getCart();
		$uniq_id = uniqid( $user->getEmail() );

		$payment = \Payplug\Payment::create(array(
			'amount'   => $cart->getTotalToPay() * 100,
			'currency' => 'EUR',
			'billing'        => array(
				'title'      => 'mr'               ,
				'first_name' => 'John'             ,
				'last_name'  => 'Watson'           ,
				'email'      => $user->getEmail()  ,
				'address1'   => '221B Baker Street',
				'postcode'   => 'NW16XE'           ,
				'city'       => 'London'           ,
				'country'    => 'FR'               ,
				'language'   => 'fr'
			),

			'shipping'          => array(
				'title'         => 'mr'               ,
				'first_name'    => 'John'             ,
				'last_name'     => 'Watson'           ,
				'email'         => $user->getEmail()  ,
				'address1'      => '221B Baker Street',
				'postcode'      => 'NW16XE'           ,
				'city'          => 'London'           ,
				'country'       => 'FR'               ,
				'language'      => 'fr'               ,
				'delivery_type' => 'BILLING'
			),

			'hosted_payment' => array(
				'return_url' => "{$_ENV['SERVER_URL']}/payment/success/{$id}?id={$uniq_id}",
				'cancel_url' => "{$_ENV['SERVER_URL']}/payment/fail?id={$uniq_id}"
		),

			'notification_url' => "{$_ENV['SERVER_URL']}/payment/notif?id={$uniq_id}"
		));

		$cartItems = $user->getCart()->getCartItems();
		foreach ( $cartItems as $key => $value ) {
			if ( $value->getIsPaid() === false ) {
				$OneCartItem = $value;
			}
		}

		$payment_url     = $payment->hosted_payment->payment_url;
		$payment_id      = $payment->id;
		$itemOrder_exist = $em->getRepository( Orders::class )->findOneBy( [ 'cartItem' => $OneCartItem ] );
		$count           = 0;

		if ( ! $itemOrder_exist ) {
			$cartService->convertCartToOrders( $user->getCart(), $uniq_id, $payment_id, 'payplug' );
		} else {
			//! Must resolve this to not have 2 existing payment at same time during 15mn
			// Abort old payment
			$old_payplug_id = $itemOrder_exist->getPaymentId();
			if ( 1 === 3 ) {
				$payment = \Payplug\Payment::abort( $old_payplug_id );
			}

			// Update Internal & External ID of new Payment
			foreach ( $user->getCart()->getCartItems() as $key => $value ) {
				if ( ! $value->getIsPaid() ) {
					$item = $em->getRepository( Orders::class )->findOneBy( [ 'cartItem' => $value ] );
					$item->setPaymentId( $payment_id );
					$item->setInternalId( $uniq_id );
					$em->flush();
					$count++;
				}
			}
		};

		$metas['billing1'    ]["field"  ] = "";
		$metas['billing2'    ]["field"  ] = "";
		$metas['billing_city']["zipCode"] = "";
		$metas['billing_city']["name"   ] = "";

		$billing_city = $em->getRepository( Metadata::class )->findOneBy( [ 'user' => $user, 'type' => 'billing_city'  ] );
		if ( $billing_city ) {
			$metas['billing1'      ] = $em->getRepository( Metadata::class )->findOneBy( [ 'user' => $user, 'type' => 'billing_line_1' ] );
			$metas['billing2'      ] = $em->getRepository( Metadata::class )->findOneBy( [ 'user' => $user, 'type' => 'billing_line_2' ] );
			$metas['billing_city'  ] = $em->getRepository( City    ::class )->find( $billing_city );
		}

		$metas['phone'] = $em->getRepository( Metadata::class )->findOneBy( [ 'user' => $user, 'type' => 'phone_number' ] );
		if ( ! $metas['phone'] ) {
			$metas['phone']["field"] = "";
		}

		$api['ALGOLIA_APPID']  = $_ENV['ALGOLIA_APPID' ];
		$api['ALGOLIA_APIKEY'] = $_ENV['ALGOLIA_APIKEY'];

        return $this->render('paiement/checkout.html.twig', [
			'payment_url' => $payment_url,
			'payment'     => $payment,
			'cart'		  => $user->getCart(),
			'user' 		  => $user,
			'count'		  => $count,
			'metas'       => $metas,
			'api'         => $api
		]);
	}

	/**
	 * payement_success
     * @Route("/payment/success/{id}", name="payment_success")
	 * @param  integer $id corresponding to the id of the current user
	 * @param  Symfony\Component\HttpFoundation\Request $request
	 * @param  App\Service\Cart\CartService $cartService
	 * @param  App\Service\Anonymize\AnonymizeService $anonymizeService
	 * @param  Doctrine\ORM\EntityManagerInterface $em
	 *
	 * @return Symfony\Component\HttpFoundation\Response
     */

	public function payement_success($id, Request $request, CartService $cartService, AnonymizeService $anonymizeService, EntityManagerInterface $em ): Response {

		$uniq_id = $request->query->get('id');
		$orders  = $em->getRepository( Orders::class )->findBy( [ 'internalId' => $uniq_id ] );
		$user    = $em->getRepository( User::class   )->find( $id );
		$cart    = $user->getCart();

		foreach ( $orders as $key => $order ) {
			$order->setOrderStatus('ON_PREPARE');
			$order->setPayDateTime( new \DateTime() );
			$em->flush();
		}
		$cartService->decreaseStock( $cart );
		$cartService->initCart( $cart );
		if (in_array('ROLE_GUEST', $user->getRoles())) {
			$anonymizeService->anonymize($user);
		}
		return $this->redirectToRoute('index');
	}

	/**
	 * payement_fail
     * @Route("/payment/fail", name="payment_fail")
	 * @param  Symfony\Component\HttpFoundation\Request $request
	 * @param  Doctrine\ORM\EntityManagerInterface $em
	 *
	 * @return Symfony\Component\HttpFoundation\Response
     */
	public function payement_fail( Request $request, EntityManagerInterface $em ): Response {
		$uniq_id = $request->query->get('id');
		$orders  = $em->getRepository( Orders::class )->findBy( [ 'internalId' => $uniq_id ] );

		foreach ( $orders as $key => $order ) {
			$order->setOrderStatus('FAILED');
			$em->flush();
		}

		return $this->redirectToRoute('index');
	}

	/**
	 * payement_notif
     * @Route("/payment/notif", name="payment_notif")
	 * @param  Symfony\Component\HttpFoundation\Request $request
	 *
	 * @return Symfony\Component\HttpFoundation\Response
     */
	public function payement_notif( Request $request ): Response {
		return $this->render('paiement/notif.html.twig', [
			'request' => $request
        ]);
	}
}
