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

use App\Entity\User;
use App\Service\Cart\CartService;
use App\Service\Metadata\MetadataService;
use App\Form\UnknownUserType;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

/**
 * @Route("/cart")
 */
class CartController extends AbstractController
{
    /**
     * add
     * @Route("/add", name="cart_item_add", methods={"GET","POST"})
     *
     * @param  Symfony\Component\HttpFoundation\Request $request
     * @param  App\Service\Cart\CartService $cartService
     *
     * @return Symfony\Component\HttpFoundation\Response
     */
    public function add(Request $request, CartService $cartService): Response
    {
        //$variant = $variantRepository->find($request->query->get('id'));
		// $quantity = $request->request->get($request->query->get('id'));

		$id  = $request->query->get('id'      );
		$qty = $request->query->get('quantity');
        $cartService->add($id, $qty);
        $this->updateCartEntityIfExists( $cartService );

        return $this->redirectToRoute('index');
    }

    /**
     * getCurrentCart
     * @Route("/current", name="get_cart", methods={"GET"})
     *
     * @param  App\Service\Cart\CartService $cartService
     *
     * @return Symfony\Component\HttpFoundation\Response
     */
    public function getCurrentCart(CartService $cartService)
    {
        $totalToPay = 0;
        $totalTax   = 0;
		$cart       = $cartService->getCart();

        foreach ( $cart as $item ) {
            $totalToPay += $item['product']->getPrice() * $item['quantity'];
            $totalTax   += $totalToPay - ( $totalToPay / ( 1 + $item['product']->getProduct()->getTva()->getTaux()) );
		}

        return $this->render('cart_item/showCurrent.html.twig', [
            'currentCart' => $cart      ,
            'totalToPay'  => $totalToPay,
            'totalTax'    => $totalTax  ,
        ]);
    }


    /**
     * getBadgeCurrentCart
     * @Route("/badge", name="get_badge_cart", methods={"GET"})
     *
     * @param  App\Service\Cart\CartService $cartService
     * @param  Symfony\Component\HttpFoundation\Request $request
     *
     * @return Symfony\Component\HttpFoundation\Response
     */
    public function getBadgeCurrentCart( CartService $cartService, Request $request )
    {
		$cart_count = 0;
		$totalToPay = 0;
        $totalTax   = 0;
		$cart_items = $request->getSession()->get('cart', []);
		$cart       = $cartService->getCart();

        foreach ( $cart as $item ) {
            $totalToPay += $item['product']->getPrice() * $item['quantity'];
		}

		foreach ( $cart_items as $id => $qty) {
			$cart_count += $qty;
		}
        return $this->render('cart/badge.html.twig', [
			'count'      => $cart_count,
			'items'      => $cart_items,
			'cart'       => $cart      ,
			'totalToPay' => $totalToPay
        ]);
    }

    /**
     * validate
     * @Route("/validation", name="cart_validate", methods={"GET","POST"})
     *
     * @param  Symfony\Component\HttpFoundation\Request $request
     * @param  App\Service\Cart\CartService $cartService
     * @param  App\Service\Metadata\MetadataService $metadataService
     * @param  Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface $passwordEncoder
     *
     * @return Symfony\Component\HttpFoundation\Response
     */
    public function validate(Request $request, CartService $cartService, MetadataService $metadataService, UserPasswordEncoderInterface $passwordEncoder): Response
    {
        $user = $this->getUser();
        if (!$user) {
            $user = new User();
            $form = $this->createForm(UnknownUserType::class, $user);
            $form->handleRequest($request);
            if ($form->isSubmitted() && $form->isValid()) {
                $identifier = $form->get('email')->getData();
                $user->setUsername($identifier);
                $user->setPassword($passwordEncoder->encodePassword($user, $identifier));
                $user->setRoles(['ROLE_GUEST']);
                $user->setIsBanned(false);
                $metadataService->createMetadata($form, $user);
                $cartService->generateCartEntity($user);
                $entityManager = $this->getDoctrine()->getManager();
                $entityManager->persist($user);
                $entityManager->flush();
                return $this->redirectToRoute('checkout', ['id' => $user->getId()]);
            }
            return $this->render('user/unknownUser.html.twig', [
                'user' => $user,
                'form' => $form->createView(),
            ]);
            return $this->redirectToRoute('login');
        }
        if (!$user->getCart()) {
            $cartService->generateCartEntity($user);
        }
        return $this->redirectToRoute('checkout', ['id' => $user->getId()]);
    }

    /**
     * edit
     * @Route("/{id}/edit", name="cart_item_edit", methods={"GET","POST"})
     *
     * @param  int $id
     * @param  Symfony\Component\HttpFoundation\Request $request
     * @param  App\Service\Cart\CartService $cartService
     *
     * @return Symfony\Component\HttpFoundation\Response
     */
    public function edit($id, Request $request, CartService $cartService) : Response
    {
        $newQty = $request->request->get($id);
        $cartService->update($id, $newQty);
        $this->updateCartEntityIfExists($cartService);

        return $this->redirectToRoute('get_cart');
    }

    /**
     * delete
     * @Route("/{id}", name="cart_item_delete", methods={"DELETE"})
     *
     * @param  int $id
     * @param  App\Service\Cart\CartService $cartService
     *
     * @return Symfony\Component\HttpFoundation\Response
     */
    public function delete($id, CartService $cartService): Response
    {
        $cartService->remove($id);
        $this->updateCartEntityIfExists($cartService);

        return $this->redirectToRoute('get_cart');
    }

    private function updateCartEntityIfExists(CartService $cartService)
    {
        $user = $this->getUser();
        if ($user) {
            if ($user->getCart()) {
                $cartService->updateCartEntity($user->getCart());
            }
        }
    }

    /**
     * disconnect
     * @Route("/disconnect", name="disconnect")
     *
     * @param  App\Service\Cart\CartService $cartService
     *
     * @return redirection
     */
    public function disconnect(CartService $cartService)
    {
        $cart = $cartService->getCart();
        $user = $this->getUser();
        if (!empty($cart)) {
            if (!$user->getCart()) {
                $cartService->generateCartEntity($user);
            }
        }
        return $this->redirectToRoute('logout');
    }
}
