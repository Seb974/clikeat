<?php

namespace App\Form;

use App\Entity\Tva;
use App\Entity\Allergen;
use App\Entity\Product;
use App\Entity\Category;
use App\Entity\Supplier;
use App\Form\VariantType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Validator\Constraints\File;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;

class ProductType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        if ($options['role'] !== 'ROLE_ADMIN') {
            $builder->add('supplier', EntityType::class, [
                'class' => Supplier::class,
                'choice_label' => function ($supplier) {
                    return $supplier->getName();
                },
                'disabled' => true,
            ]);
        } else {
            $builder->add('supplier', EntityType::class, [
                'class' => Supplier::class,
                'choice_label' => function ($supplier) {
                    return $supplier->getName();
                },
                'disabled' => false,
                'mapped' => true,
            ]);
        }
        $builder
            ->add('category', EntityType::class, [
                'class' => Category::class,
                'choice_label' => function ($category) {
                    return $category->getName();
                }
            ])
            ->add('name')
            ->add('description')
            ->add('allergens', EntityType::class, [
                'class' => Allergen::class,
                'choice_label' => function ($allergen) {
                    return $allergen->getName();
                },
                'multiple' => true,
                'required' => false,
            ])
            ->add('proteins', NumberType::class, [
                'mapped' => false,
                'required' => false,
            ])
            ->add('carbohydrates', NumberType::class, [
                'mapped' => false,
                'required' => false,
            ])
            ->add('sugar', NumberType::class, [
                'mapped' => false,
                'required' => false,
            ])
            ->add('fat', NumberType::class, [
                'mapped' => false,
                'required' => false,
            ])
            ->add('saturated', NumberType::class, [
                'mapped' => false,
                'required' => false,
            ])
            ->add('sodium', NumberType::class, [
                'mapped' => false,
                'required' => false,
            ])
            //->add('price', NumberType::class)
            ->add('tva', EntityType::class, [
                'class' => Tva::class,
                'choice_label' => function ($tva) {
                    return $tva->getTaux() * 100;
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
            ->add('variants', CollectionType::class, array(
                'entry_type'   => VariantType::class,
                'allow_add'    => true,
                'allow_delete' => true,
                'by_reference' => false,
                'mapped' => true,
              ))
        
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => Product::class,
            'role' => 'ROLE_SUPPLIER'
        ]);
    }
}