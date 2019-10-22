<?php

namespace App\Form;

use App\Entity\User;
use App\Entity\City;
use Doctrine\ORM\EntityRepository;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Validator\Constraints\File;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;


class EditSelfType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('username', TextType::class, [
                'constraints' => [
                    new NotBlank( ['message' => 'Please enter a pseudo'] ),
                    new Length( [
                        'min'        => 3,
                        'max'        => 16,
                        'minMessage' => 'Your username should be at least {{ limit }} characters',
                        'maxMessage' => 'Your username should be at most {{ limit }} characters',
                    ] )
                ]
            ])
            ->add('email', EmailType::class, [
                'constraints' => [ 
                    new NotBlank( ['message' => 'Please enter an email address'] )
                ]
            ])
            ->add('password', RepeatedType::class, [
                'type' => PasswordType::class,
                'invalid_message' => 'The entered password are different.',
                'options'         => [ 'attr' => [ 'class' => 'password-field']],
                'mapped'          => false,
                'required'        => false,
                'first_options'   => [ 'label' => 'password' ],
                'second_options'  => [ 'label' => 'confirm pasword'],
                'constraints'     => [ 
                    new Length([
                        'min'        => 6,
                        'max'        => 20,
                        'minMessage' => 'Your password should be at least {{ limit }} characters',
                        'maxMessage' => 'Your password should be at most {{ limit }} characters',
                    ])
                ]
            ])
            ->add('phone_number', NumberType::class, [
                'mapped' => false,
                'required' => false,
            ])
            ->add('delivery_line_1', TextareaType::class, [
                'mapped' => false,
                'required' => false,
            ])
            ->add('delivery_line_2', TextareaType::class, [
                'mapped' => false,
                'required' => false,
            ])
            ->add('delivery_city', EntityType::class, [
                'class' => City::class,
                'mapped' => false,
                'query_builder' => function(EntityRepository $er) {
                    return $er->createQueryBuilder('m')
                              ->where('m.isDeliverable = true')
                              ->orderBy('m.zipCode', 'ASC');
                },
                'choice_label' => 'zipCode',
                'multiple' => false,
                'required' => false,
            ])
            ->add('billing_line_1', TextareaType::class, [
                'mapped' => false,
                'required' => false,
            ])
            ->add('billing_line_2', TextareaType::class, [
                'mapped' => false,
                'required' => false,
            ])
            ->add('billing_city', EntityType::class, [
                'class' => City::class,
                'mapped' => false,
                'choice_label' => function ($city) {
                    return $city->getZipCode();
                }
            ])
            ->add('picture', FileType::class, [
                'label' => 'Illustration',
                'required' => false,
                'mapped' => false,
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
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => User::class,
            'role' => 'USER',
        ]);
    }
}
