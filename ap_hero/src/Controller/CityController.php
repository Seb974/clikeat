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

use App\Entity\City;
use App\Form\CityType;
use App\Form\CityTypeAdmin;
use App\Repository\CityRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;

/**
 * @Route("/city")
 */
class CityController extends AbstractController
{
    /**
     * index
     * @IsGranted("ROLE_ADMIN")
     *
     * @Route("/", name="city_index", methods={"GET"})
     *
     * @param  App\Repository\CityRepository $cityRepository
     *
     * @return Symfony\Component\HttpFoundation\Response
     */
    public function index(CityRepository $cityRepository): Response
    {
        return $this->render('city/index.html.twig', [
            'cities' => $cityRepository->findAll(),
        ]);
    }

    /**
     * new
     * @IsGranted("ROLE_ADMIN")
     *
     * @Route("/new", name="city_new", methods={"GET","POST"})
     *
     * @param  Symfony\Component\HttpFoundation\Request $request
     *
     * @return Symfony\Component\HttpFoundation\Response
     */
    public function new(Request $request): Response
    {
        $city = new City();

        $form = $this->createForm(CityTypeAdmin::class, $city);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($city);
            $entityManager->flush();

            return $this->redirectToRoute('city_index');
        }

        return $this->render('city/new.html.twig', [
            'city' => $city,
            'form' => $form->createView(),
        ]);
    }

    /**
     * show
     * @Route("/{id}", name="city_show", methods={"GET"})
     *
     * @param  App\Entity\City $city
     *
     * @return Symfony\Component\HttpFoundation\Response
     */
    public function show(City $city): Response
    {
        return $this->render('city/show.html.twig', [
            'city' => $city,
        ]);
    }

    /**
     * edit
     * @Route("/{id}/edit", name="city_edit", methods={"GET","POST"})
     *
     * @param  Symfony\Component\HttpFoundation\Request $request
     * @param  App\Entity\City $city
     *
     * @return Symfony\Component\HttpFoundation\Response
     */
    public function edit(Request $request, City $city): Response
    {
        $form = $this->createForm(CityType::class, $city);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            return $this->redirectToRoute('city_index');
        }

        return $this->render('city/edit.html.twig', [
            'city' => $city,
            'form' => $form->createView(),
        ]);
    }

    /**
     * delete
     * @Route("/{id}", name="city_delete", methods={"DELETE"})
     *
     * @param  Symfony\Component\HttpFoundation\Request $request
     * @param  App\Entity\City $city
     *
     * @return Symfony\Component\HttpFoundation\Response
     */
    public function delete(Request $request, City $city): Response
    {
        if ($this->isCsrfTokenValid('delete'.$city->getId(), $request->request->get('_token'))) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($city);
            $entityManager->flush();
        }

        return $this->redirectToRoute('city_index');
    }
}
