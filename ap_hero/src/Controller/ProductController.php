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

use App\Entity\CartItem;
use App\Entity\Nutritionals;
use App\Entity\Product;
use App\Entity\Variant;
use App\Entity\Pics;
use App\Entity\Stock;
use App\Form\ProductType;
use App\Form\CartItemType;
use App\Repository\ProductRepository;
use App\Service\Serializer\SerializerService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/product")
 */
class ProductController extends AbstractController
{
    /**
     * index
     * @Route("/", name="product_index", methods={"GET"})
     * @param  App\Repository\ProductRepository $productRepository
     *
     * @return Response
     */
    public function index(ProductRepository $productRepository): Response
    {
        return $this->render('product/index.html.twig', [
            'products' => $productRepository->findAll(),
        ]);
    }

    /**
     * new
     * @Route("/new", name="product_new", methods={"GET","POST"})
     * @param  Symfony\Component\HttpFoundation\Request $request
     *
     * @return Symfony\Component\HttpFoundation\Response
     */
    public function new(Request $request): Response
    {
        $product = new Product();
        $user = $this->getUser();
        $greaterRole = (in_array('ROLE_ADMIN', $user->getRoles())) ? 'ROLE_ADMIN' : 'ROLE_SUPPLIER';
        $form = $this->createForm(ProductType::class, $product, ['role' => $greaterRole]);
        if ($greaterRole === 'ROLE_SUPPLIER') {
            $supplier = $user->getSupplier();
            $form->get('supplier')->setData($supplier);
        }
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $picFile = $form->get('picture')->getData();
            if ($picFile) {
                $picture = new Pics();
                $newFilename = $this->savePicture($picFile);
                $picture->setB64($newFilename);
                $product->setPicture($picture);
            }
            $nutritionals = $this->hydrateNutritionals($form);
            $product->setNutritionals($nutritionals);
            $product->setSupplier($form->get('supplier')->getData());
            $entityManager = $this->getDoctrine()->getManager();
            $this->addVariants($product, $entityManager);
            $entityManager->persist($product);
            $entityManager->flush();
            return $this->redirectToRoute('product_index');
        }
        return $this->render('product/new.html.twig', [
            'product' => $product,
            'form' => $form->createView(),
        ]);
    }

    /**
     * show
     * @Route("/{id}", name="product_show", methods={"GET"})
     * @param  App\Entity\Product $product
     *
     * @return Symfony\Component\HttpFoundation\Response
     */
    public function show(Product $product): Response
    {
        return $this->render('product/show.html.twig', [
            'product' => $product,
        ]);
    }

    /**
     * getProduct
     * @Route("/api/{id}", name="product_show", methods={"GET"})
     * @param  App\Entity\Product $product
     *
     * @return Symfony\Component\HttpFoundation\Response
     */
    public function getProduct(Product $product, SerializerService $serializer): Response
    {
        // return $this->render('product/show.html.twig', [
        //     'product' => $product,
        // ]);
        // $products = $productRepository->findAll();
        return JsonResponse::fromJsonString($serializer->serializeEntity($product, 'product'));
    }

    /**
     * edit
     * @Route("/{id}/edit", name="product_edit", methods={"GET","POST"})
     * @param  Symfony\Component\HttpFoundation\Request $request
     * @param  App\Entity\Product $product
     *
     * @return Symfony\Component\HttpFoundation\Response
     */
    public function edit(Request $request, Product $product): Response
    {
        $greaterRole = (in_array('ROLE_ADMIN', $this->getUser()->getRoles())) ? 'ROLE_ADMIN' : 'ROLE_SUPPLIER';
        $form = $this->createForm(ProductType::class, $product, ['role' => $greaterRole]);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $picFile = $form->get('picture')->getData();
            if ($picFile) {
                $picture = new Pics();
                $newFilename = $this->savePicture($picFile);
                $picture->setB64($newFilename);
                $product->setPicture($picture);
            }
            $nutritionals = $this->hydrateNutritionals($form);
            if ($nutritionals) {
                $product->setNutritionals($nutritionals);
            }
            $entityManager = $this->getDoctrine()->getManager();
            $this->addVariants($product, $entityManager);
            $entityManager->flush();
            return $this->redirectToRoute('product_index');
        }

        return $this->render('product/edit.html.twig', [
            'product' => $product,
            'form' => $form->createView(),
        ]);
    }

    /**
     * delete
     * @Route("/{id}", name="product_delete", methods={"DELETE"})
     * @param  Symfony\Component\HttpFoundation\Request $request
     * @param  App\Entity\Product $product
     *
     * @return Symfony\Component\HttpFoundation\Response
     */
    public function delete(Request $request, Product $product): Response
    {
        if ($this->isCsrfTokenValid('delete'.$product->getId(), $request->request->get('_token'))) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($product);
            $entityManager->flush();
        }

        return $this->redirectToRoute('product_index');
    }

    /**
     * savePicture
     * @param string $pictureFile
     *
     * @return void
     */
    private function savePicture($pictureFile)
    {
        $originalFilename = pathinfo($pictureFile->getClientOriginalName(), PATHINFO_FILENAME);
        $safeFilename = transliterator_transliterate('Any-Latin; Latin-ASCII; [^A-Za-z0-9_] remove; Lower()', $originalFilename);
        $newFilename = $safeFilename.'-'.uniqid().'.'.$pictureFile->guessExtension();

        try {
            $pictureFile->move(
                $this->getParameter('pics_directory'),
                $newFilename
            );
        } catch (FileException $e) {
            // ... handle exception if something happens during file upload
        }

        return $newFilename;
    }

    /**
     * hydrateNutritionals
     * @param  App\Form\ProductType $form
     *
     * @return void
     */
    private function hydrateNutritionals($form)
    {
        $nutritionals = new Nutritionals();
        $prots = $form->get('proteins')->getData();
        $carbs = $form->get('carbohydrates')->getData();
        $sugar = $form->get('sugar')->getData();
        $fat = $form->get('fat')->getData();
        $saturated = $form->get('saturated')->getData();
        $sodium = $form->get('sodium')->getData();
        if ($prots && $carbs && $fat && $sugar && $saturated && $sodium) {
            $nutritionals->setProtein($prots);
            $nutritionals->setCarbohydrates($carbs);
            $nutritionals->setFat($fat);
            $nutritionals->setSugar($sugar);
            $nutritionals->setTransAG($saturated);
            $nutritionals->setSalt($sodium);
            $nutritionals->setKCal(($prots + $carbs) * 4 + $fat * 9);
            $nutritionals->setKJ($nutritionals->getKCal() * 4,184);
            return $nutritionals;
        }
        return null;
    }

    /**
     * addVariants
     *
     * @param  App\Entity\Product $product
     * @param  Doctrine\ORM\EntityManagerInterface  $entityManager
     *
     * @return void
     */
    private function addVariants($product, $entityManager)
    {
        foreach($product->getVariants() as $variant) {
            if ($variant->getStock() === null) {
                $stock = new Stock();
                $stock->setQuantity(0);
                $variant->setStock($stock);
                $entityManager->persist($variant);
            }
        }
    }
}
