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
        // Récupérer le niveau et les points depuis la session
        $session = $request->getSession();
        
        // Réinitialiser le jeu si demandé
        if ($request->query->has('reset')) {
            $session->set('game_level', 1);
            $session->set('game_points', 0);
            return $this->redirectToRoute('app_index');
        }
        
        $level = $session->get('game_level', 1);
        $points = $session->get('game_points', 0);
        
        // Augmenter le niveau si nécessaire
        if ($request->query->has('level_up')) {
            $level++;
            $session->set('game_level', $level);
            
            // Ajouter des points bonus pour avoir terminé le niveau
            $levelBonus = 50 * $level;
            if ($request->query->has('time_bonus')) {
                $timeBonus = (int)$request->query->get('time_bonus');
                $points += $levelBonus + $timeBonus;
            } else {
                $points += $levelBonus;
            }
            $session->set('game_points', $points);
        }
        
        // Calculer la limite en fonction du niveau
        $limit = max(1, $level * 1);
        
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
            'points' => $points,
            'totalPairs' => count($cards) / 2
        ]);
    }
}