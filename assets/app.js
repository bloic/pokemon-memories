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
            if (confirm('Êtes-vous sûr de vouloir recommencer au niveau 1 ? Vous perdrez tous vos points.')) {
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
    let attempts = 0;
    let points = parseInt(document.querySelector('.game-container').dataset.points) || 0;
    let timer;
    let seconds = 0;
    let timerStarted = false;
    let animationRunning = false;
    
    // Obtenir le nombre total de paires depuis l'attribut data
    const gameContainer = document.querySelector('.game-container');
    const totalPairs = parseInt(gameContainer.dataset.totalPairs);
    
    const cards = document.querySelectorAll('.card');
    const pointsDisplay = document.getElementById('points-display');
    const pointsAnimation = document.getElementById('points-animation');
    
    // Mettre à jour l'affichage initial des points
    pointsDisplay.textContent = points;
    
    // Démarrer le timer
    startTimer();
    
    // Ajouter l'écouteur d'événement à chaque carte
    cards.forEach(card => {
        card.addEventListener('click', flipCard);
    });
    
    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;
        
        // Démarrer le timer au premier clic si ce n'est pas déjà fait
        if (!timerStarted) {
            timerStarted = true;
        }
        
        this.classList.add('flipped');
        
        if (!hasFlippedCard) {
            // Premier clic
            hasFlippedCard = true;
            firstCard = this;
            return;
        }
        
        // Deuxième clic
        secondCard = this;
        attempts++;
        checkForMatch();
    }
    
    function checkForMatch() {
        let isMatch = firstCard.getAttribute('data-id') === secondCard.getAttribute('data-id');
        
        if (isMatch) {
            // Ajouter des points pour une correspondance
            updatePoints(10 * (totalPairs + 1), true); // Plus de points pour les niveaux supérieurs
            disableCards();
        } else {
            // Soustraire des points pour une erreur
            updatePoints(-5, false);
            unflipCards();
        }
    }
    
    function updatePoints(pointsChange, isMatch) {
        points += pointsChange;
        // Mettre à jour l'affichage des points immédiatement
        pointsDisplay.textContent = points;
        
        // Créer ou réutiliser un élément d'animation
        showPointsAnimation(pointsChange, isMatch);
    }
    
    function showPointsAnimation(pointsChange, isMatch) {
        // Si une animation est en cours, créer un nouvel élément
        if (animationRunning) {
            const newAnimation = document.createElement('span');
            newAnimation.className = 'points-animation';
            newAnimation.classList.add(isMatch ? 'points-gain' : 'points-loss');
            newAnimation.textContent = (pointsChange > 0 ? '+' : '') + pointsChange;
            
            // Ajouter le nouvel élément d'animation à côté du compteur de points
            const statItem = pointsDisplay.closest('.stat-item');
            statItem.appendChild(newAnimation);
            
            // Supprimer l'élément après l'animation
            setTimeout(() => {
                if (newAnimation.parentNode) {
                    newAnimation.parentNode.removeChild(newAnimation);
                }
            }, 1000);
        } else {
            // Utiliser l'élément d'animation existant
            animationRunning = true;
            pointsAnimation.textContent = (pointsChange > 0 ? '+' : '') + pointsChange;
            pointsAnimation.className = 'points-animation';
            pointsAnimation.classList.add(isMatch ? 'points-gain' : 'points-loss');
            
            // Réinitialiser l'animation après
            setTimeout(() => {
                pointsAnimation.className = 'points-animation';
                animationRunning = false;
            }, 1000);
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
            // Arrêter le timer
            clearInterval(timer);
            
            // Calculer le bonus de temps (plus rapide = plus de points)
            const timeBonus = Math.max(0, 100 - Math.floor(seconds / 3));
            
            setTimeout(() => {
                alert(`Félicitations ! Vous avez terminé le niveau en ${formatTime(seconds)}.\nBonus de temps: ${timeBonus} points\nPassage au niveau suivant...`);
                window.location.href = `/?level_up=true&time_bonus=${timeBonus}`;
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
    
    function startTimer() {
        const timerElement = document.getElementById('timer');
        timer = setInterval(() => {
            if (timerStarted) {
                seconds++;
                timerElement.textContent = formatTime(seconds);
            }
        }, 1000);
    }
    
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
}