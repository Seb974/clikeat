<?php

namespace App\Form;

use App\Entity\Supplier;
use App\Entity\User;
use Doctrine\ORM\EntityRepository;
use App\Entity\Product;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class SupplierType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('name')
            ->add('users', EntityType::class, [
                'class' => User::class,
                'query_builder' => function(EntityRepository $er) {
                    return $er->createQueryBuilder('u')
                              ->orderBy('u.email', 'ASC');
                },
                'choice_label' => 'email',
                'multiple' => true,
                'required' => true,
            ])
            ->add('products', EntityType::class, [
                'class' => Product::class,
                'choice_label' => function ($product) {
                    return $product->getName();
                },
                'multiple' => true,
                'required' => false,
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => Supplier::class,
        ]);
    }
}
