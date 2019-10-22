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

use App\Entity\Tva;
use App\Form\TvaType;
use App\Repository\TvaRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;

/**
 * Will throw a normal AccessDeniedException:
 *
 * @IsGranted("ROLE_ADMIN", message="No access! Get out!")
 *
 * @Route("/tva")
 */
class TvaController extends AbstractController
{
    /**
     * index
     * @Route("/", name="tva_index", methods={"GET"})
     * @param  App\Repository\TvaRepository $tvaRepository
     *
     * @return Symfony\Component\HttpFoundation\Response
     */
    public function index(TvaRepository $tvaRepository): Response
    {
        return $this->render('tva/index.html.twig', [
            'tvas' => $tvaRepository->findAll(),
        ]);
    }

    /**
     * new
     * @Route("/new", name="tva_new", methods={"GET","POST"})
     * @param  Symfony\Component\HttpFoundation\Request $request
     *
     * @return Symfony\Component\HttpFoundation\Response
     */
    public function new(Request $request): Response
    {
        $tva = new Tva();
        $form = $this->createForm(TvaType::class, $tva);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($tva);
            $entityManager->flush();

            return $this->redirectToRoute('tva_index');
        }

        return $this->render('tva/new.html.twig', [
            'tva' => $tva,
            'form' => $form->createView(),
        ]);
    }

    /**
     * show
     * @Route("/{id}", name="tva_show", methods={"GET"})
     * @param  App\Entity\Tva $tva
     *
     * @return Symfony\Component\HttpFoundation\Response
     */
    public function show(Tva $tva): Response
    {
        return $this->render('tva/show.html.twig', [
            'tva' => $tva,
        ]);
    }

    /**
     * edit
     * @Route("/{id}/edit", name="tva_edit", methods={"GET","POST"})
     * @param  Symfony\Component\HttpFoundation\Request $request
     * @param  App\Entity\Tva $tva
     *
     * @return Symfony\Component\HttpFoundation\Response
     */
    public function edit(Request $request, Tva $tva): Response
    {
        $form = $this->createForm(TvaType::class, $tva);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            return $this->redirectToRoute('tva_index');
        }

        return $this->render('tva/edit.html.twig', [
            'tva' => $tva,
            'form' => $form->createView(),
        ]);
    }

    /**
     * delete
     * @Route("/{id}", name="tva_delete", methods={"DELETE"})
     * @param  Symfony\Component\HttpFoundation\Request $request
     * @param  App\Entity\Tva $tva
     *
     * @return Symfony\Component\HttpFoundation\Response
     */
    public function delete(Request $request, Tva $tva): Response
    {
        if ($this->isCsrfTokenValid('delete'.$tva->getId(), $request->request->get('_token'))) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($tva);
            $entityManager->flush();
        }

        return $this->redirectToRoute('tva_index');
    }
}
