<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Validator\Constraints\NotBlank;

class MainController extends AbstractController
{
    private $client;

    public function __construct(HttpClientInterface $client)
    {
        $this->client = $client;
    }



    #[Route('/', name: 'app_home')]
    public function index(Request $request): Response
    {

        $form = $this->createFormBuilder([], ['attr' => ['novalidate' => 'novalidate']])
            ->add('city', TextType::class,['attr'=>["class"=>"typeahead",'autocomplete'=>'off'],'constraints'=>[new NotBlank(['message'=>'Veuillez rentrez un nom de ville !'])]])
            ->getForm();
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $city = $form['city']->getData();
            return  $this->redirectToRoute('app_results', ['city' => $city]);
        }


        return $this->render('main/index.html.twig', [
            'form' => $form->createView()
        ]);
    }





    #[Route('/{city}', name: 'app_results')]
    public function results(Request $request, $city)
    {
        // $city = $request->attributes->get('city');

        // dd($city);
        $url = 'https://api.weatherapi.com/v1/current.json?key=109eb4c71a9e4298a01160154220602&q=' . $city . '&lang=fr';

        $response = $this->client->request(
            'GET',
            $url
        );

        if($response->getStatusCode() === 400){
            return $this->redirectToRoute('app_home',['error'=>'Ville non trouvée !']);
        }

        $data = $response->toArray();
        // dd($data);

        return $this->render('main/results.html.twig',compact('data'));
    }



    #[Route('/api/autocomplete', name: 'app_auto')]
    public function autocomplete(Request $request)
    {

        $city = $request->request->get('city');

        dd($city);
        $url = 'https://api.weatherapi.com/v1/search.json?key=109eb4c71a9e4298a01160154220602&q=' . $city;

        $response = $this->client->request(
            'GET',
            $url
        );

        // if($response->getStatusCode() === 400){
        //     return $this->redirectToRoute('app_home',['error'=>'Ville non trouvée !']);
        // }

        $data = $response->toArray();
        dd($data);

        return $this->render('main/results.html.twig',compact('data'));
    }
}
