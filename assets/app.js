import './bootstrap.js';
import './styles/app.css';

console.log('This log comes from assets/app.js - welcome to AssetMapper! 🎉');

document.addEventListener('DOMContentLoaded', function() {
    // Initialisation du jeu Memory
    initMemoryGame();
    
    // Initialisation du bouton reset
    initResetButton();
});

function initResetButton() {
    const resetButton = document.getElementById('reset-button');
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            if (confirm('Êtes-vous sûr de vouloir recommencer au niveau 1 ?')) {
                window.location.href = '/?reset=true';
            }
        });
    }
}

function initMemoryGame() {
    // Vérifier si nous sommes sur la page du jeu memory
    if (!document.querySelector('.game-container')) {
        return; // Sortir si nous ne sommes pas sur la page du jeu
    }
    
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let matchedPairs = 0;
    
    // Obtenir le nombre total de paires depuis l'attribut data
    const gameContainer = document.querySelector('.game-container');
    const totalPairs = parseInt(gameContainer.dataset.totalPairs);
    
    const cards = document.querySelectorAll('.card');
    
    // Ajouter l'écouteur d'événement à chaque carte
    cards.forEach(card => {
        card.addEventListener('click', flipCard);
    });
    
    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;
        
        this.classList.add('flipped');
        
        if (!hasFlippedCard) {
            // Premier clic
            hasFlippedCard = true;
            firstCard = this;
            return;
        }
        
        // Deuxième clic
        secondCard = this;
        checkForMatch();
    }
    
    function checkForMatch() {
        let isMatch = firstCard.getAttribute('data-id') === secondCard.getAttribute('data-id');
        
        if (isMatch) {
            disableCards();
        } else {
            unflipCards();
        }
    }
    
    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        
        matchedPairs++;
        document.getElementById('matched-count').textContent = matchedPairs;
        
        resetBoard();
        
        // Vérifier si toutes les paires sont trouvées
        if (matchedPairs === totalPairs) {
            setTimeout(() => {
                alert('Félicitations ! Passage au niveau suivant...');
                window.location.href = '/?level_up=true';
            }, 1000);
        }
    }
    
    function unflipCards() {
        lockBoard = true;
        
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetBoard();
        }, 1500);
    }
    
    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }
}