<?php

namespace App\Controller;

use App\Repository\VariantRepository;
use App\Service\JSONRequest\JsonRequestService;
use App\Service\Serializer\SerializerService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Mercure\Update;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

/**
 * @Route("/app")
 */
class ApiAppController extends AbstractController
{
    /**
     * @Route("/ping", name="test_ping", methods={"POST"})
     */
    public function ping(Request $request, MessageBusInterface $bus, VariantRepository $variantRepository, SerializerService $serializer)      // 
    {

        if (0 === strpos($request->headers->get('Content-Type'), 'application/json')) {
            $data = json_decode($request->getContent(), true);
            $request->request->replace(is_array($data) ? $data : array());
        }
        $article = $variantRepository->find($request->request->get("id"));
        $quantity = $request->request->get("quantity");
        if ($request->request->get("action") === 'DECREASE_PRODUCT_STOCK') {
            $newQty = $article->getStock()->getQuantity() - $quantity;
            $newQty > 0 ? $article->getStock()->setQuantity($newQty): $article->getStock()->setQuantity(0);
        } else {
            $article->getStock()->setQuantity($article->getStock()->getQuantity() + $quantity);
        }
        $this->getDoctrine()->getManager()->flush();
        $response = $serializer->serializeEntity($article, 'variant');
        $update = new Update("pong/ping", $response);
        $bus->dispatch($update);
        return  JsonResponse::fromJsonString($response);
    }


}