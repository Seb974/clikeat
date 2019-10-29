<?php
	/**
     * HomePage Controller
     *
     * This controller manage all about Home page
     *
     * @package      Some Package
     * @subpackage   Some Subpackage
     * @category     Home Page
     * @author       War Machines
     */
namespace App\Controller;

use App\Security\FacebookAuthenticator;
use Doctrine\ORM\EntityManagerInterface;
use KnpU\OAuth2ClientBundle\Client\ClientRegistry;
use League\OAuth2\Client\Provider\FacebookUser;
use League\OAuth2\Client\Token\AccessToken;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ApiController extends AbstractController
{
    /*
     * index
     * @Route("/api", name="api")
     *
     * @return void
     */
    // public function index()
    // {
    //     return $this->render('api/index.html.twig', [
    //         'controller_name' => 'ApiController',
    //     ]);
	// }

	/**
     * callback
     * @Route("/api/callback", name="api_callback")
     *
     * @param Symfony\Component\HttpFoundation\Request $request
     * @param KnpU\OAuth2ClientBundle\Client\ClientRegistry $clientRegistry
     *
     * @return Symfony\Component\HttpFoundation\Response
     */
    public function callback( Request $request, ClientRegistry $clientRegistry ): Response
    {
		$parameters['code']  = $request->query->get("code");
		$parameters['state'] = $request->query->get("state");
		$accessToken         = new AccessToken( array( 'access_token' => $parameters['code'] ) );
		$facebookClient      = $clientRegistry->getClient('facebook');
		// $facebookUser        = $facebookClient->fetchUserFromToken( $accessToken );

		// $parameters = array();
		// = = $facebookclient->fetchUserFromToken($accessToken);

        return $this->render('api/index.html.twig', [
			'controller_name' => 'ApiController',
			'request' => $parameters
        ]);
	}

	/**
	 * Print_point
	 *
	 * @param  string $imprimante
	 * @param  string $message
	 *
	 * @return json
	 */
	public function Print_point( $imprimante, $message ) {
		// id customer Printer Point
		$sid   = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
		$token = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';

		$data = array(
			'sid'    => $sid  ,
			'token'  => $token,
			'params' => array (
				'printer_uid' => $imprimante,
				'printer_msg' => $message
			)
		);

		$ch = curl_init();
		curl_setopt( $ch, CURLOPT_URL, 'https://www.expedy.fr/api/print' );
		curl_setopt( $ch, CURLOPT_POST, 1 );
		curl_setopt( $ch, CURLOPT_POSTFIELDS, http_build_query( $data ) );
		$result = curl_exec( $ch );
		curl_close( $ch );

		return $result;
	}
}
