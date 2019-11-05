<?php

namespace App\EventListener;

use App\Repository\MetadataRepository;
use App\Service\Serializer\SerializerService;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;
use Symfony\Component\HttpFoundation\RequestStack;

class JWTCreatedListener
{
    /**
     * @var RequestStack
     */
    private $requestStack;
    private $metadataRepository;
    private $serializer;
    
    /**
     * @param RequestStack $requestStack
     */
    public function __construct(RequestStack $requestStack, MetadataRepository $metadataRepository, SerializerService $serializer)
    {
        $this->requestStack = $requestStack;
        $this->metadataRepository = $metadataRepository;
        $this->serializer = $serializer;
    }
    
    /**
     * @param JWTCreatedEvent $event
     *
     * @return void
     */
    public function onJWTCreated(JWTCreatedEvent $event)
    {
        $data = $event->getData();
        $user = $event->getUser();
        $metadata = $this->metadataRepository->findBy(['user' => $user]);
        $data['data'] = [
            'id' => $user->getId(),
            'email' =>$user->getEmail(),
            'username' => $user->getUsername(),
            'roles' => $user->getRoles(),
            'isBanned' => $user->getIsBanned(),
            'avatar' => $user->getAvatar(),
            'cart' => $user->getCart(),
            'supplier' => $user->getSupplier(),
            'metadata' => $this->serializer->serializeEntity($metadata, 'metadata')
        ];
        $payload = $data;
        $event->setData($payload);
    }
}
