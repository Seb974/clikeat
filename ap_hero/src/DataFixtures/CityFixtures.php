<?php

namespace App\DataFixtures;

use App\Entity\City;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;

class CityFixtures extends Fixture
{
    public function load(ObjectManager $manager)
    {
		$zipcodes = array(
			array('IsDeliverable' => false, 'zip_code' => '97440','name' => 'ST ANDRE'                ),
			array('IsDeliverable' => false, 'zip_code' => '97429','name' => 'PETITE ILE'              ),
			array('IsDeliverable' => false, 'zip_code' => '97460','name' => 'ST PAUL'                 ),
			array('IsDeliverable' => true , 'zip_code' => '97430','name' => 'LE TAMPON'               ),
			array('IsDeliverable' => false, 'zip_code' => '97412','name' => 'BRAS PANON'              ),
			array('IsDeliverable' => false, 'zip_code' => '97438','name' => 'STE MARIE'               ),
			array('IsDeliverable' => false, 'zip_code' => '97417','name' => 'ST DENIS'                ),
			array('IsDeliverable' => false, 'zip_code' => '97480','name' => 'ST JOSEPH'               ),
			array('IsDeliverable' => false, 'zip_code' => '97435','name' => 'ST PAUL'                 ),
			array('IsDeliverable' => false, 'zip_code' => '97433','name' => 'SALAZIE'                 ),
			array('IsDeliverable' => true , 'zip_code' => '97425','name' => 'LES AVIRONS'             ),
			array('IsDeliverable' => false, 'zip_code' => '97470','name' => 'ST BENOIT'               ),
			array('IsDeliverable' => false, 'zip_code' => '97400','name' => 'ST DENIS'                ),
			array('IsDeliverable' => true , 'zip_code' => '97432','name' => 'ST PIERRE'               ),
			array('IsDeliverable' => true , 'zip_code' => '97410','name' => 'ST PIERRE'               ),
			array('IsDeliverable' => false, 'zip_code' => '97437','name' => 'ST BENOIT'               ),
			array('IsDeliverable' => false, 'zip_code' => '97490','name' => 'ST DENIS'                ),
			array('IsDeliverable' => false, 'zip_code' => '97419','name' => 'LA POSSESSION'           ),
			array('IsDeliverable' => false, 'zip_code' => '97434','name' => 'ST PAUL'                 ),
			array('IsDeliverable' => false, 'zip_code' => '97442','name' => 'ST PHILIPPE'             ),
			array('IsDeliverable' => false, 'zip_code' => '97420','name' => 'LE PORT'                 ),
			array('IsDeliverable' => false, 'zip_code' => '97411','name' => 'ST PAUL'                 ),
			array('IsDeliverable' => false, 'zip_code' => '97413','name' => 'CILAOS'                  ),
			array('IsDeliverable' => true , 'zip_code' => '97421','name' => 'ST LOUIS'                ),
			array('IsDeliverable' => false, 'zip_code' => '97431','name' => 'LA PLAINE DES PALMISTES' ),
			array('IsDeliverable' => false, 'zip_code' => '97439','name' => 'STE ROSE'                ),
			array('IsDeliverable' => true , 'zip_code' => '97418','name' => 'LE TAMPON'               ),
			array('IsDeliverable' => false, 'zip_code' => '97436','name' => 'ST LEU'                  ),
			array('IsDeliverable' => false, 'zip_code' => '97423','name' => 'ST PAUL'                 ),
			array('IsDeliverable' => false, 'zip_code' => '97424','name' => 'ST LEU'                  ),
			array('IsDeliverable' => false, 'zip_code' => '97416','name' => 'ST LEU'                  ),
			array('IsDeliverable' => false, 'zip_code' => '97450','name' => 'ST LOUIS'                ),
			array('IsDeliverable' => true , 'zip_code' => '97414','name' => 'ENTRE DEUX'              ),
			array('IsDeliverable' => false, 'zip_code' => '97426','name' => 'LES TROIS BASSINS'       ),
			array('IsDeliverable' => false, 'zip_code' => '97422','name' => 'ST PAUL'                 ),
			array('IsDeliverable' => false, 'zip_code' => '97427','name' => 'L ETANG SALE'            ),
			array('IsDeliverable' => false, 'zip_code' => '97441','name' => 'STE SUZANNE'             )
		  );

		foreach ( $zipcodes as $key => $value ) {
			$city = new City();

			$city->setZipCode( intval( $value['zip_code'] ) );
			$city->setName( $value['name'] );
			$city->setIsDeliverable( $value['IsDeliverable'] );

			$manager->persist($city);
		}
        $manager->flush();
    }
}
