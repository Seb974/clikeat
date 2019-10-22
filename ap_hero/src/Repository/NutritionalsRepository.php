<?php

namespace App\Repository;

use App\Entity\Nutritionals;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;

/**
 * @method Nutritionals|null find($id, $lockMode = null, $lockVersion = null)
 * @method Nutritionals|null findOneBy(array $criteria, array $orderBy = null)
 * @method Nutritionals[]    findAll()
 * @method Nutritionals[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class NutritionalsRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Nutritionals::class);
    }

    // /**
    //  * @return Nutritionals[] Returns an array of Nutritionals objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('n')
            ->andWhere('n.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('n.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Nutritionals
    {
        return $this->createQueryBuilder('n')
            ->andWhere('n.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
