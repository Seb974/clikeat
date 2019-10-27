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

use App\Form\EditSelfType;
use App\Controller\UserController;
use App\Form\RegistrationFormType;
use App\Security\AppAuthenticator;
use App\Service\Cart\CartService;
use App\Service\Metadata\MetadataService;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Guard\GuardAuthenticatorHandler;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Doctrine\Common\Collections\ArrayCollection;

class SecurityController extends AbstractController
{

    /**
     * registerApi
     * @param  Symfony\Component\HttpFoundation\Request $request
     * @param  Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface $encoder
     *
     * @return void
     */
    public function registerApi(Request $request, UserPasswordEncoderInterface $encoder)
    {
        $em = $this->getDoctrine()->getManager();

        $email = $request->request->get('username');
        $password = $request->request->get('password');
        $roles = $request->request->get('roles');

        if (!$roles) {
            $roles = json_encode(["ROLE_USER"]);
        }

        $user = new User();
        $user->setEmail($email);
        $user->setPassword($encoder->encodePassword($user, $password));
        $user->setRoles(($roles));
        $em->persist($user);
        $em->flush();

        return new Response(sprintf('User %s successfully created', $user->getUsername()));
    }

    /*
     * login
     * @Route("/login", name="login")
     * @param Symfony\Component\Security\Http\Authentication\AuthenticationUtils $authenticationUtils
     * @param Symfony\Component\HttpFoundation\Request $request
     *
     * @return Symfony\Component\HttpFoundation\Response
     */
    // public function login(AuthenticationUtils $authenticationUtils, Request $request): Response
    // {
    //     // if ($this->getUser()) {
    //     //    $this->redirectToRoute('target_path');
    //     // }

    //     $error = $authenticationUtils->getLastAuthenticationError();
    //     $lastUsername = $authenticationUtils->getLastUsername();
    //     return $this->render('security/login.html.twig', ['last_username' => $lastUsername, 'error' => $error]);
    // }

    /**
     * register
     * @Route("/register", name="register")
     * @param  Symfony\Component\HttpFoundation\Request $request
     * @param  Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface $passwordEncoder
     * @param  Symfony\Component\Security\Guard\GuardAuthenticatorHandler $guardHandler
     * @param  App\Security\AppAuthenticator $authenticator
     * @param  App\Service\Metadata\MetadataService $metadataService
     *
     * @return Symfony\Component\HttpFoundation\Response
     */
    public function register(Request $request, UserPasswordEncoderInterface $passwordEncoder, GuardAuthenticatorHandler $guardHandler, AppAuthenticator $authenticator, MetadataService $metadataService): Response
    {
        $user = new User();
        $form = $this->createForm(RegistrationFormType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            // encode the plain password
            $user->setPassword(
                $passwordEncoder->encodePassword(
                    $user,
                    $form->get('password')->getData()
                )
            );

            $picFile = $form->get('picture')->getData();
            if ($picFile) {
                $picture = new Pics();
                $newFilename = $this->savePicture($picFile);
                $picture->setB64($newFilename);
                $user->setAvatar($picture);
            }

            $user->setRoles(['ROLE_USER']);
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($user);
            $entityManager->flush();
            // do anything else you need here, like send an email

            return $guardHandler->authenticateUserAndHandleSuccess(
                $user,
                $request,
                $authenticator,
                'main' // firewall name in security.yaml
            );
        }

        return $this->render('registration/register.html.twig', [
            'registrationForm' => $form->createView(),
        ]);
    }

    /**
     * logout
     * @Route("/logout", name="logout")
     *
     * @return void
     */
    public function logout()
    {
        throw new \Exception('This method can be blank - it will be intercepted by the logout key on your firewall');
    }

    /**
     * edit
     * @Route("/account/edit", name="self_edit", methods={"GET","POST"})
     * @param  Symfony\Component\HttpFoundation\Request $request
     * @param  Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface $passwordEncoder
     * @param  App\Service\Metadata\MetadataService $metadataService
     *
     * @return Symfony\Component\HttpFoundation\Response
     */
    public function edit(Request $request, UserPasswordEncoderInterface $passwordEncoder, MetadataService $metadataService): Response
    {
        $user = $this->getUser();
        $metadata = $user->getMetadata();
        $form = $this->createForm(EditSelfType::class, $user);
        $metadataTab = [];

        foreach ($metadata as $data) {
            $field = $data->getField();
            $type = $data->getType();
            $metadataTab += [$type => $field];
        }

        if ($metadataTab != []) {
            $form->get('phone_number')->setData($metadataTab['phone_number']);
            $form->get('delivery_line_1')->setData($metadataTab['delivery_line_1']);
            $form->get('delivery_line_2')->setData($metadataTab['delivery_line_2']);
            $form->get('delivery_city')->setData($metadataTab['delivery_city']);

            $form->get('billing_line_1')->setData($metadataTab['billing_line_1']);
            $form->get('billing_line_2')->setData($metadataTab['billing_line_2']);
            $form->get('billing_city')->setData($metadataTab['billing_city']);
        }
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {

            $picFile = $form->get('picture')->getData();
            if ($picFile) {
                $picture = new Pics();
                $newFilename = $this->savePicture($picFile);
                $picture->setB64($newFilename);
                $user->setAvatar($picture);
            }

            $metadataTab != [] ? $metadataService->updateMetadata($form, $user) : $metadataService->createMetadata($form, $user);
            //$metadataService->updateMetadata($form, $user);

            if (strlen($form->get('password')->getData()) > 0) {
                $user->setPassword($passwordEncoder->encodePassword($user, $form->get('password')->getData()));
            }
            $this->getDoctrine()->getManager()->flush();

            return $this->redirectToRoute('user_self_show');
        }

        return $this->render('user/edit_self.html.twig', [
            'user' => $user,
            'form' => $form->createView(),
        ]);
    }

    /**
     * show
     * @Route("/self", name="user_self_show", methods={"GET"})
     *
     * @return Symfony\Component\HttpFoundation\Response
     */
    public function show(): Response
    {
        return $this->render('user/show_self.html.twig', [
            'user' => $this->getUser(),
        ]);
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
