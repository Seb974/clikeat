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

/**
 * @Route("/app")
 */
class ApiAppController extends AbstractController
{
    /**
     * @Route("/ping", name="test_ping", methods={"POST"})
     */
    public function ping(Request $request, MessageBusInterface $bus, SerializerService $serializer, VariantRepository $variantRepository)
    {

        if (0 === strpos($request->headers->get('Content-Type'), 'application/json')) {
            $data = json_decode($request->getContent(), true);
            $request->request->replace(is_array($data) ? $data : array());
        }

        $id = $request->request->get("id");
        $article = $variantRepository->find($id);
        $quantity = $request->request->get("quantity");
        $response = $serializer->serializeEntity($article, 'product');
        $update = new Update("pong/ping", $response);
        // $publisher($update);
        $bus->dispatch($update);
        return  JsonResponse::fromJsonString($response);
    }


}

// public function ping(Publisher $publisher, Request $request)
//, MessageBusInterface $bus, SerializerService $serializer, VariantRepository $variantRepository)
// {
//     dd($request->request);
//     $id = $request->request->get("id");
//     $article = $variantRepository->find($id);
//     $quantity = $request->request->get("quantity");
//     $response = $serializer->serializeEntity($article, 'product');
//     $update = new Update("pong/ping", $response);
//     // $publisher($update);
//     $bus->dispatch($update);
//     return  JsonResponse::fromJsonString($response);
// }
