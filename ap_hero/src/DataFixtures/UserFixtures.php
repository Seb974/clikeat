<?php

namespace App\DataFixtures;

use App\Entity\Supplier;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class UserFixtures extends Fixture implements DependentFixtureInterface
{
	private $encoder;

	public function __construct( UserPasswordEncoderInterface $encoder, EntityManagerInterface $em ) {
		$this->encoder = $encoder;
		$this->em = $em;
	}

	public function getDependencies()
    {
        return array(
			SupplierFixtures::class,
		);
    }

    public function load( ObjectManager $manager )
    {
		$users = array(
			array(
				'email'     => 'm_seb@icloud.com',
				'roles'     => 'ROLE_ADMIN',
				'password'  => 'Soleil01',
				'username'  => 'sebastien',
				'is_banned' => false,
				'supplier'  => null
			),

			array(
				'email'     => 'anne-marion.vitry@coding-academy.fr',
				'roles'     => 'ROLE_ADMIN',
				'password'  => 'azerty',
				'username'  => 'Anna',
				'is_banned' => false,
				'supplier'  => null
			),

			array(
				'email'     => 'yen.linkwang@nigao.re',
				'roles'     => 'ROLE_ADMIN',
				'password'  => 'azerty',
				'username'  => 'Yen',
				'is_banned' => false,
				'supplier'  => null
			),

			array(
				'email'     => 'contact@osaka.re',
				'roles'     => 'ROLE_SUPPLIER',
				'password'  => 'azerty',
				'username'  => 'OSAKA',
				'is_banned' => false,
				'supplier'  => $this->em->getRepository( Supplier::class )->findOneBy( ['name' => 'Osaka'] )
			),

			array(
				'email'     => 'brenda@osaka.re',
				'roles'     => 'ROLE_SUPPLIER',
				'password'  => 'azerty',
				'username'  => 'Brenda',
				'is_banned' => false,
				'supplier'  => $this->em->getRepository( Supplier::class )->findOneBy( ['name' => 'Osaka'] )
			),

			array(
				'email'     => 'contact@burger.re',
				'roles'     => 'ROLE_SUPPLIER',
				'password'  => 'azerty',
				'username'  => 'BurgerMary',
				'is_banned' => false,
				'supplier'  => $this->em->getRepository( Supplier::class )->findOneBy( ['name' => 'BurgerMary'] )
			),

			array(
				'email'     => 'cyclist@uber.com',
				'roles'     => 'ROLE_DELIVERER',
				'password'  => 'azerty',
				'username'  => 'UberEats',
				'is_banned' => false,
				'supplier'  => null
			),

			array(
				'email'     => 'kevin@epitech.eu',
				'roles'     => 'ROLE_USER',
				'password'  => 'azerty',
				'username'  => 'Kevin',
				'is_banned' => false,
				'supplier'  => null
			),

			array(
				'email'     => 'marvin@epitech.eu',
				'roles'     => 'ROLE_USER',
				'password'  => 'azerty',
				'username'  => 'Marvin',
				'is_banned' => true,
				'supplier'  => null
			),

		  );

		foreach ( $users as $key => $value ) {
			$user = new User();

			$user->setEmail( $value['email'] );
			$user->setUsername( $value['username'] );
			$user->setIsBanned( $value['is_banned'] );

			$user->setRoles( array( $value['roles'] ) );
			$user->setPassword( $this->encoder->encodePassword( $user, $value['password'] ) );
			$user->setSupplier( $value['supplier'] );

			if ( $value['email'] === 'contact@jumbo.re' ) {
				$supplier = new Supplier();
				$supplier->setName("Jumbo Score");
				$manager->persist( $supplier );
				$user->setSupplier( $supplier );
			}

			$manager->persist( $user );
		}

        $manager->flush();
    }
}
