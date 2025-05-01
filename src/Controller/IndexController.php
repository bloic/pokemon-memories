<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Uid\Uuid;
use Symfony\Contracts\HttpClient\HttpClientInterface;

final class IndexController extends AbstractController
{
    private $client;

    public function __construct(HttpClientInterface $client)
    {
        $this->client = $client;
    }

    #[Route('/', name: 'app_index')]
    public function index(Request $request): Response
    {
        // Récupérer le niveau depuis la session, par défaut 1
        $session = $request->getSession();
        
        // Réinitialiser le niveau si demandé
        if ($request->query->has('reset')) {
            $session->set('game_level', 1);
            return $this->redirectToRoute('app_index');
        }
        
        $level = $session->get('game_level', 1);
        
        // Augmenter le niveau si nécessaire
        if ($request->query->has('level_up')) {
            $level++;
            $session->set('game_level', $level);
        }
        
        // Calculer la limite en fonction du niveau
        $limit = max(2, $level * 2);
        
        $listePokemon = $this->client
            ->request(
                'GET', 
                'https://pokeapi.co/api/v2/pokemon?limit=' . $limit . '&offset=' . rand(0, 1000)
            )
            ->toArray();

        $pokemons = $listePokemon['results'];
        $cards = array_merge($pokemons, $pokemons);

        $cards = array_map(function ($card) {
            $segments = explode('/', trim($card['url'], '/'));
            $id = $segments[count($segments) - 1];
            return [
                'uuid' => Uuid::v4(),
                'id' => $id,
                'name' => $card['name'],
            ];
        }, $cards);

        shuffle($cards);

        return $this->render('index/index.html.twig', [
            'cards' => $cards,
            'level' => $level,
            'totalPairs' => count($cards) / 2
        ]);
    }
}