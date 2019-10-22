<?php

namespace App\DataFixtures;

use App\Entity\Category;
use App\Entity\Supplier;
use App\Entity\Nutritionals;
use App\Entity\Pics;
use App\Entity\Product;
use App\Entity\Stock;
use App\Entity\Tva;
use App\Entity\Variant;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Faker\Factory;
use Faker\Generator;

class ProductFixtures extends Fixture implements DependentFixtureInterface
{
    protected $faker;

    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    public function getDependencies()
    {
        return array(
			TvaFixtures::class,
			CategoryFixtures::class,
			SupplierFixtures::class,
		);
    }

    public function load(ObjectManager $manager)
    {
        $cycle = 0;
        $faker = Factory::create();
        $faker->addProvider( new \FakerRestaurant\Provider\en_US\Restaurant( $faker ) );

		// category
		$burger  = $this->em->getRepository( Category::class )->findOneBy( ['name' => 'burger'         ] );
		$boisson = $this->em->getRepository( Category::class )->findOneBy( ['name' => 'boisson'        ] );
		$laitier = $this->em->getRepository( Category::class )->findOneBy( ['name' => 'produit laitier'] );
		$legume  = $this->em->getRepository( Category::class )->findOneBy( ['name' => 'legume'         ] );
		$fruit   = $this->em->getRepository( Category::class )->findOneBy( ['name' => 'fruits'         ] );
		$plats   = $this->em->getRepository( Category::class )->findOneBy( ['name' => 'plats cuisinés' ] );

		// tva
		$tva_alcool = $this->em->getRepository( Tva::class )->findOneBy( ['taux' => 0.085 ] );
		$tva_food   = $this->em->getRepository( Tva::class )->findOneBy( ['taux' => 0.021 ] );

		// Supplier
		$osaka  = $this->em->getRepository( Supplier::class )->findOneBy( ['name' => 'Osaka'               ] );
		$mdw    = $this->em->getRepository( Supplier::class )->findOneBy( ['name' => 'La Maison du Whisky' ] );
		$bgrMry = $this->em->getRepository( Supplier::class )->findOneBy( ['name' => 'BurgerMary'          ] );

        for ( $i = 0; $i < 25; $i++ ) {
			$price = random_int( 0, 25 );

            switch ( $cycle ) {
				case 0:
					$product_name     = $faker->foodname();
					$product_supplier = $bgrMry;
					$product_category = $burger           ;
					$product_tva      = $tva_food         ;
					$product_variant  = array(
						array( 'name' => 'small', 'price' => $price                          ),
						array( 'name' => 'xl'   , 'price' => $price + 3 + random_int( 0, 3 ) ),
						array( 'name' => 'xxl'  , 'price' => $price + 6 + random_int( 0, 3 ) ),
					);
                    break;

                case 1:
					$product_name     = $faker->beverageName();
					$product_supplier = $mdw;
					$product_category = $boisson              ;
					$product_tva      = $tva_alcool           ;
					$product_variant  = array(
						array( 'name' => '25cl', 'price' => $price                           ),
						array( 'name' => '33cl', 'price' => $price + 1 + random_int( 0, 3 ) ),
						array( 'name' => '75cl', 'price' => $price + 2 + random_int( 0, 3 ) ),
					);
                    break;

                case 2:
					$product_name     = $faker->dairyName();
					$product_supplier = $osaka;
					$product_category = $laitier           ;
					$product_tva      = $tva_food          ;
					$product_variant  = array(
						array( 'name' => '100g', 'price' => $price                          ),
						array( 'name' => '200g', 'price' => $price + 2 + random_int( 0, 3 ) ),
					);
                    break;

                case 3:
					$product_name     = $faker->vegetableName();
					$product_supplier = $osaka;
					$product_category = $legume                ;
					$product_tva      = $tva_food              ;
					$product_variant  = array(
						array( 'name' => '100g', 'price' => $price                          ),
						array( 'name' => '500g', 'price' => $price + 3 + random_int( 0, 3 ) ),
						array( 'name' => '1kg' , 'price' => $price + 6 + random_int( 0, 3 ) ),
					);
                    break;

                case 4:
					$product_name     = $faker->fruitName();
					$product_supplier = $bgrMry;
					$product_category = $fruit             ;
					$product_tva      = $tva_food          ;
					$product_variant  = array(
						array( 'name' => '1 tas', 'price' => $price                          ),
						array( 'name' => '2 tas', 'price' => $price + 3 + random_int( 0, 3 ) ),
						array( 'name' => '3 tas' , 'price' => $price + 6 + random_int( 0, 3 ) ),
					);
                    break;

                case 5:
					$product_name     = $faker->meatName();
					$product_supplier = $osaka;
					$product_category = $plats            ;
					$product_tva      = $tva_food         ;
					$product_variant  = array(
						array( 'name' => 'congelé', 'price' => $price                          ),
						array( 'name' => 'surgelé', 'price' => $price + 3 + random_int( 0, 3 ) ),
						array( 'name' => 'frais'  , 'price' => $price + 6 + random_int( 0, 3 ) ),
					);
                    break;

                default:
                    # code...
                    break;
            }

			$picture = new Pics();
			$picture->setB64("https://loremflickr.com/320/240/{$product_name}");
			$manager->persist( $picture );

			$nutri = new Nutritionals();
			$nutri->setKJ           ( random_int( 0, 100 ) );
			$nutri->setKCal         ( random_int( 0, 100 ) );
			$nutri->setProtein      ( random_int( 0, 100 ) );
			$nutri->setCarbohydrates( random_int( 0, 100 ) );
			$nutri->setSugar        ( random_int( 0, 100 ) );
			$nutri->setFat          ( random_int( 0, 100 ) );
			$nutri->setTransAG      ( random_int( 0, 100 ) );
			$nutri->setSalt         ( random_int( 0, 100 ) );
			$manager->persist( $nutri );

			$product = new Product();
            $product->setName        ( $product_name                                             );
            $product->setDescription ( $faker->sentence( $nbWords = 8, $variableNbWords = true ) );
            $product->setCategory    ( $product_category                                         );
            $product->setTva         ( $product_tva                                              );
            $product->setPicture     ( $picture                                                  );
			$product->setNutritionals( $nutri                                                    );
			$product->setSupplier    ( $product_supplier                                         );
            $manager->persist( $product );

            $cycle++;
            if ( 6 == $cycle ) {
                $cycle = 0;
			}

			foreach ($product_variant as $key => $value) {
				$variant = new Variant();
				$variant->setProduct( $product        );
				$variant->setName   ( $value['name']  );
				$variant->setPrice  ( $value['price'] );
				$manager->persist( $variant );

				$stock = new Stock();
				$stock->setProduct ( $variant            );
				$stock->setQuantity( random_int( 0, 50 ) );
				$manager->persist( $stock );
			}

        }
        $manager->flush();
    }
}
