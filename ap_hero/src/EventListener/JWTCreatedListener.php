<?php

namespace App\EventListener;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;
use Symfony\Component\HttpFoundation\RequestStack;

class JWTCreatedListener
{
    /**
     * @var RequestStack
     */
    private $requestStack;
    
    /**
     * @param RequestStack $requestStack
     */
    public function __construct(RequestStack $requestStack)
    {
        $this->requestStack = $requestStack;
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
        $data['data'] = [
            'id' => $user->getId(),
            'email' =>$user->getEmail(),
            'username' => $user->getUsername(),
            'roles' => $user->getRoles(),
            'isBanned' => $user->getIsBanned(),
            'avatar' => $user->getAvatar(),
            'cart' => $user->getCart(),
            'supplier' => $user->getSupplier(),
            'metadata' => $user->getMetadata(),
        ];
    
        $payload = $data;
        $event->setData($payload);
    }
}
