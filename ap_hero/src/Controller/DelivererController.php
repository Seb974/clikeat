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

use App\Entity\Orders;

use App\Repository\OrderRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Component\HttpFoundation\Response;

class DelivererController extends AbstractController
{
    /**
     * index
     * @Route("/deliverer", name="deliverer")
     *
     * @param  App\Repository\OrderRepository $orderRepository
     * @param  App\Repository\UserRepository $userRepository
     *
     * @return Symfony\Component\HttpFoundation\Response
     */
    public function index(OrderRepository $orderRepository, UserRepository $userRepository): Response
    {
		$del_order = $orderRepository->findAll();
		dump($del_order);

        return $this->render('deliverer/index.html.twig', [
			'del_order' => $del_order,
		]);
	}

    /**
     * cronUpdate
     * @Route("/deliverer/cron", name="deliverer_cron")
     *
     * @param  Doctrine\ORM\EntityManagerInterface $em
     *
     * @return redirection
     */
    public function cronUpdate( EntityManagerInterface $em )
    {
        $now    = new \DateTime();
        $orders = $em->getRepository( Orders::class )->findAll();
		$answer = "no orders";

        foreach ($orders as $key => $order) {
			if ( $order->getOrderStatus() === 'ON_PREPARE') {
				$orderPayedTime   = $order->getPayDateTime()                                     ;
				$orderStatus      = $order->getOrderStatus()                                     ;
				$supplierTimer_hr = $order->getSupplier   ()->getPreparationPeriod()->format('H');
				$supplierTimer_mn = $order->getSupplier   ()->getPreparationPeriod()->format('i');

				$timer = new \DateInterval( "PT{$supplierTimer_hr}H{$supplierTimer_mn}M" );
				$checkDelay = $orderPayedTime->add( $timer );
				dump( $checkDelay, $now );

				if ( $checkDelay < $now ) {
					$order->setOrderStatus('FOR_DELIVERY');
					$em->flush();
				} else {
					$answer = "reste la case";
				}
			}
        }

		return $this->redirectToRoute('index');
    }
}
