<?php

namespace App\DataFixtures;

use App\Entity\Supplier;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use Faker\Factory;
use Faker\Generator;

class SupplierFixtures extends Fixture
{

	protected $faker;

    public function load(ObjectManager $manager)
    {
		$faker = Factory::create();
		$suppliers = array(
			array('name' => 'Osaka'               ),
			array('name' => 'La Maison du Whisky' ),
			array('name' => 'BurgerMary'          ),
		  );

		foreach ( $suppliers as $key => $value ) {
			$rnd = random_int( 1, 5 );
			$supplier = new Supplier();
			$supplier->setName( $value['name'] );
			$supplier->setAddress( $faker->address() );
			$supplier->setPreparationPeriod( new \DateTime("2011-01-01T00:0{$rnd}:00.012345Z") );
			$manager->persist( $supplier );
		}

        $manager->flush();
    }
}
