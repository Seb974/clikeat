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

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use App\Service\Cart\CartService;
use App\Repository\VariantRepository;
use App\Repository\ProductRepository;
use App\Entity\Product;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;
use Doctrine\Common\Annotations\AnnotationReader;
use Symfony\Component\Serializer\Mapping\Factory\ClassMetadataFactory;
use Symfony\Component\Serializer\Mapping\Loader\AnnotationLoader;



/**
 * This controller is about homepage
 */
class HomeController extends AbstractController
{
    /**
     * Page d'accueil du site donnant une vue globale de tous les produits et leur variantes.
     * @Route("/", name="index")
     *
     * @param  App\Repository\ProductRepository $productRepository
     * @param  Symfony\Component\HttpFoundation\Request $request
     * @param  App\Service\Cart\CartService $cartService
     *
     * @return Symfony\Component\HttpFoundation\Response
     */
    public function index( ProductRepository $productRepository, Request $request , CartService $cartService): Response
    {
        $user = $this->getUser();
        if ($user) {
            if ($user->getCart() && empty($cartService->getCart())) {
                $cartService->generateCartSession($user->getCart());
            }
        }

		$cart_items = $request->getSession()->get('cart', []);
		$cart_count = 0;
		foreach ( $cart_items as $id => $qty) {
			$cart_count += $qty;
		}

        return $this->render('home/index.html.twig', [
			'controller_name' => 'HomeController',
			'products'        => $productRepository->findAll(),
			'cart'            => $cart_count
        ]);
    }




    /**
     * @Route("/api_index", name="index_api")
     */
    public function indexApi( ProductRepository $productRepository, Request $request , CartService $cartService)
    {
        $classMetadataFactory = new ClassMetadataFactory(new AnnotationLoader(new AnnotationReader()));
        $normalizer = new ObjectNormalizer($classMetadataFactory);
        $encoder = new JsonEncoder();
        $serializer = new Serializer([$normalizer], [$encoder]);

        $user = $this->getUser();
        if ($user) {
            if ($user->getCart() && empty($cartService->getCart())) {
                $cartService->generateCartSession($user->getCart());
            }
        }

		$cart_items = $request->getSession()->get('cart', []);
		$cart_count = 0;
		foreach ( $cart_items as $id => $qty) {
			$cart_count += $qty;
		}

        $products = $productRepository->findAll();

        $data = $serializer->normalize($products, null, ['groups' => 'product']);
        
        //return new Response($jsonObject, 200, ['Content-Type' => 'application/json']);
        return $this->json($data);
        //echo $jsonObject;
    }


}
