<?php

namespace App\Form;

use App\Entity\User;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\File;
use Symfony\Component\Validator\Constraints\IsTrue;
use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\Validator\Constraints\NotBlank;

class RegistrationFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('username', TextType::class, [
				'label' => 'Identifiant',
				'attr' => ['class' => 'form-control form-control-secondary'],
				'constraints' => [
                    new NotBlank( ['message' => 'Merci de saisir un nom utilisateur'] ),
                    new Length( [
                        'min'        => 3,
                        'max'        => 16,
                        'minMessage' => "Votre nom d'utilisateur doit être composé d'au moins {{ limit }} caractères",
                        'maxMessage' => "Votre nom d'utilisateur doit être au maximum de {{ limit }} caractères",
                    ] )
                ]
            ])
            ->add('email', EmailType::class, [
				'attr' => ['class' => 'form-control form-control-secondary'],
                'constraints' => [
                    new NotBlank( ['message' => 'Veuillez entrer une adresse email'] )
                ]
            ])
            ->add('password', RepeatedType::class, [
				'type' => PasswordType::class,
				'attr' => ['class' => 'form-control form-control-secondary'],
                'invalid_message' => 'Les mots de passe saisis sont différents.',
                'options'         => [ 'attr' => [ 'class' => 'password-field']],
                'mapped'          => false,
                'required'        => false,
                'first_options'   => [ 'label' => 'mot de passe' ],
                'second_options'  => [ 'label' => 'confirmation'],
                'constraints'     => [
                    new Length([
                        'min'        => 6,
                        'max'        => 20,
                        'minMessage' => "Votre mot de passe doit être composé d'au moins {{ limit }} caractères",
                        'maxMessage' => "Votre mot de passe doit être au maximum de {{ limit }} caractères",
                    ])
                ]
            ])
            ->add('picture', FileType::class, [
                'label' => 'Illustration',
                'required' => false,
				'mapped' => false,
				'attr' => ['class' => 'd-none'],
                'constraints' => [
                    new File([
                        'maxSize' => '5242880',
                        'mimeTypes' => [
                            "image/png",
                            "image/jpeg",
                            "image/jpg",
                            "image/gif",
                        ],
                        'mimeTypesMessage' => 'Please upload a valid picture',
                    ])
                ],
            ])
            ->add('agreeTerms', CheckboxType::class, [
				'mapped' => false,
				'attr'   => array('checked'   => 'checked', 'class' => 'd-none'),
                'constraints' => [
                    new IsTrue([
                        'message' => 'You should agree to our terms.',
                    ]),
                ],
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => User::class,
        ]);
    }
}


// use Symfony\Component\Form\AbstractType;
// use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
// use Symfony\Component\Form\FormBuilderInterface;
// use Symfony\Component\Validator\Constraints\IsTrue;
// use App\Form\EditSelfType;

// class RegistrationFormType extends AbstractType
// {
//     public function getParent()
//     {
//         return EditSelfType::class;
//     }

//     public function buildForm(FormBuilderInterface $builder, array $options)
//     {
//         $builder->add('agreeTerms', CheckboxType::class, [
//                       'mapped' => false,
//                       'constraints' => [
//                         new IsTrue([
//                             'message' => 'You should agree to our terms.',
//                         ]),
//                     ],
//                 ])
//             ;
//     }
// }



// namespace App\Form;




