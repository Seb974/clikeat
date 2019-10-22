<?php

namespace App\DataFixtures;

use App\Entity\Tva;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;

class TvaFixtures extends Fixture
{
    public function load(ObjectManager $manager)
    {
		$tvas = array(
			array('name' => '2.1%' , 'taux' => 0.021 ),
			array('name' => '8.5%' , 'taux' => 0.085 ),
		  );

		foreach ( $tvas as $key => $value ) {
			$tva = new Tva();
			$tva->setName( $value['name'] );
			$tva->setTaux( $value['taux'] );
			$manager->persist($tva);
		}
        $manager->flush();
    }
}
