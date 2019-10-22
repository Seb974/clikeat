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
use App\Entity\Metadata;
use App\Entity\Pics;

use App\Form\CreateUserType;
use App\Form\UpdateUserType;
use App\Repository\UserRepository;
use App\Repository\MetadataRepository;
use App\Service\Metadata\MetadataService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

/**
 * 
 *
 * @Route("/user")
 */

// @IsGranted("ROLE_ADMIN")
class UserController extends AbstractController
{
    /**
     * index
     * @IsGranted("ROLE_ADMIN")
     * @Route("/", name="user_index", methods={"GET"})
     * @param  App\Repository\UserRepository $userRepository
     * @param  App\Repository\MetadataRepository $metadataRepository
     *
     * @return Symfony\Component\HttpFoundation\Response
     */
    public function index(UserRepository $userRepository, MetadataRepository $metadataRepository): Response
    {
        return $this->render('user/index.html.twig', [
            'users' => $userRepository->findAll(),
            'metadata' => $metadataRepository->findAll(),
        ]);
    }

    /**
     * new
     * @IsGranted("ROLE_ADMIN")
     * @Route("/new", name="user_new", methods={"GET","POST"})
     * @param  Symfony\Component\HttpFoundation\Request $request
     * @param  Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface $passwordEncoder
     * @param  App\Service\Metadata\MetadataService $metadataService
     *
     * @return Symfony\Component\HttpFoundation\Response
     */
    public function new(Request $request, UserPasswordEncoderInterface $passwordEncoder, MetadataService $metadataService): Response
    {
        $user = new User();
        $form = $this->createForm(CreateUserType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {

            $picFile = $form->get('picture')->getData();
            if ($picFile) {
                $picture = new Pics();
                $newFilename = $this->savePicture($picFile);
                $picture->setB64($newFilename);
                $user->setAvatar($picture);
            }

            $user->setPassword($passwordEncoder->encodePassword($user, $form->get('password')->getData()));

            $metadataService->createMetadata($form, $user);
            $user->setRoles([$form->get('roles')->getData()]);
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($user);
            $entityManager->flush();
            return $this->redirectToRoute('user_index');
        }

        return $this->render('user/new.html.twig', [
            'user' => $user,
            'form' => $form->createView(),
        ]);
    }

    /**
     * getCurrentUser
     * @Route("/current", name="current_user", methods={"POST"})
     * @param  Symfony\Component\HttpFoundation\Request $request
     * @param  App\Repository\UserRepository $userRepository
     *
     * @return Symfony\Component\HttpFoundation\Response
     */
    public function getCurrentUser(Request $request, UserRepository $userRepository): Response
    {
        return new JsonResponse(["user" => $userRepository->findOneBy(['email' => $request->request->get('email')])]);
    }

    /**
     * show
     * @IsGranted("ROLE_ADMIN")
     * @Route("/{id}", name="user_show", methods={"GET"})
     * @param  App\Entity\User $user
     *
     * @return Symfony\Component\HttpFoundation\Response
     */
    public function show(User $user): Response
    {
        return $this->render('user/show.html.twig', [
            'user' => $user,
        ]);
        // return new JsonResponse($user);
    }

    /**
     * edit
     * @IsGranted("ROLE_ADMIN")
     * @Route("/{id}/edit", name="user_edit", methods={"GET","POST"})
     * @param  Symfony\Component\HttpFoundation\Request $request
     * @param  App\Entity\User $user
     * @param  App\Service\Metadata\MetadataService $metadataService
     *
     * @return Symfony\Component\HttpFoundation\Response
     */
    public function edit(Request $request, User $user, MetaDataService $metadataService): Response
    {
        $metadata = $user->getMetadata();
        $form = $this->createForm(UpdateUserType::class, $user);
        $metadataTab = [];

        foreach ($metadata as $data) {
            $field = $data->getField();
            $type = $data->getType();
            $metadataTab += [$type => $field];
        }
        if ($metadataTab != []) {
            $form->get('phone_number')->setData(intval($metadataTab['phone_number']));
            $form->get('delivery_line_1')->setData($metadataTab['delivery_line_1']);
            $form->get('delivery_line_2')->setData($metadataTab['delivery_line_2']);
            $form->get('delivery_city')->setData($metadataTab['delivery_city']);
            $form->get('billing_line_1')->setData($metadataTab['billing_line_1']);
            $form->get('billing_line_2')->setData($metadataTab['billing_line_2']);
            $form->get('billing_city')->setData($metadataTab['billing_city']);
        }
        $form->get('roles')->setData($this->convertRoleToField($user));
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {

            $picFile = $form->get('picture')->getData();
            if ($picFile) {
                $picture = new Pics();
                $newFilename = $this->savePicture($picFile);
                $picture->setB64($newFilename);
                $user->setAvatar($picture);
            }

            $metadataTab == [] ? $metadataService->createMetadata($form, $user) : $metadataService->updateMetadata($form, $user);
            $user->setRoles([$form->get('roles')->getData()]);
            $this->getDoctrine()->getManager()->flush();

            return $this->redirectToRoute('user_index');
        }
        return $this->render('user/edit.html.twig', [
            'user' => $user,
            'form' => $form->createView(),
        ]);
    }

    /**
     * delete
     * @IsGranted("ROLE_ADMIN")
     * @Route("/{id}", name="user_delete", methods={"DELETE"})
     * @param  Symfony\Component\HttpFoundation\Request $request
     * @param  App\Entity\User $user
     *
     * @return Symfony\Component\HttpFoundation\Response
     */
    public function delete(Request $request, User $user): Response
    {
        if ($this->isCsrfTokenValid('delete'.$user->getId(), $request->request->get('_token'))) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($user);
            $entityManager->flush();
        }
        return $this->redirectToRoute('user_index');
    }

    /**
     * convertRoleToField
     * @param  App\Entity\User $user
     *
     * @return void
     */
    private function convertRoleToField($user)
    {
        $roles = $user->getRoles();
        if (in_array('ROLE_ADMIN', $roles)) {
            return 'ROLE_ADMIN';
        } elseif (in_array('ROLE_SUPPLIER', $roles)) {
            return 'ROLE_SUPPLIER';
        } elseif (in_array('ROLE_DELIVERER', $roles)) {
            return 'ROLE_DELIVERER';
        } else {
            return 'ROLE_USER';
        }
    }

    /**
     * savePicture
     * @param  string $pictureFile
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
}
