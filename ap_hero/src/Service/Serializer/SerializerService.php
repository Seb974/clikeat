<?php

namespace App\Service\Serializer;

use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;
use Doctrine\Common\Annotations\AnnotationReader;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Mapping\Factory\ClassMetadataFactory;
use Symfony\Component\Serializer\Mapping\Loader\AnnotationLoader;


class SerializerService
{
    private $classMetadataFactory;
    private $normalizer;
    private $encoder;
    private $serializer;

    public function __construct()
    {
        $this->classMetadataFactory = new ClassMetadataFactory(new AnnotationLoader(new AnnotationReader()));
        $this->normalizer = new ObjectNormalizer($this->classMetadataFactory);
        $this->encoder = new JsonEncoder();
        $this->serializer = new Serializer([$this->normalizer], [$this->encoder]);
    }

    public function serializeEntity($object, string $group)
    {
        $data = $this->serializer->normalize($object, null, ['groups' => $group]);
        $jsonData = $this->serializer->encode($data, 'json');
        return $jsonData;
    }
}