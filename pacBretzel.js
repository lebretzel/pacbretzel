let maze = [
  'WWWWWWWWWWWWWWWWWWWWWWWWWWWW',
  'W......WW..........WW......W',
  'W*WWWW.WW.WWWWWWWW.WW.WWWW*W',
  'W.WWWW.WW.WWWWWWWW.WW.WWWW.W',
  'W..........................W',
  'WWW.WW.WWWWW.WW.WWWWW.WW.WWW',
  'WWW.WW.WWWWW.WW.WWWWW.WW.WWW',
  'WWW.WW.WWWWW.WW.WWWWW.WW.WWW',
  'WWW.WW.......WW.......WW.WWW',
  'WWW.WWWWW.WWWWWWWW.WWWWW.WWW',
  'WWW.WWWWW.WWWWWWWW.WWWWW.WWW',
  'WWW......................WWW',
  'WWW.WWWWW.WWWWWWWW.WWWWW.WWW',
  'WWW.WW....WWWWWWWW....WW.WWW',
  'WWW.WW.WW.WWWWWWWW.WW.WW.WWW',
  'WWW.WW.WW.WWWWWWWW.WW.WW.WWW',
  'WWW....WW..........WW....WWW',
  'WWW.WWWWWWWW.WW.WWWWWWWW.WWW',
  'WWW.WWWWWWWW.WW.WWWWWWWW.WWW',
  'WWW..........WW..........WWW',
  'WWW.WWWWW.WWWWWWWW.WWWWW.WWW',
  'WWW.WWWWW.WWWWWWWW.WWWWW.WWW',
  'W..........................W',
  'W.WWWW.WWWWW.WW.WWWWW.WWWW.W',
  'W.WWWW.WWWWW.WW.WWWWW.WWWW.W',
  'W.WWWW.WW....WW....WW.WWWW.W',
  'W*WWWW.WW.WWWWWWWW.WW.WWWW*W',
  'W.WWWW.WW.WWWWWWWW.WW.WWWW.W',
  'W..........................W',
  'WWWWWWWWWWWWWWWWWWWWWWWWWWWW'
];
const initialMaze = JSON.parse(JSON.stringify(maze));
const initialPacBretzel = { row: 16, col: 13 };
const initialGhost1 = { row: 1, col: 16 };
const initialGhost2 = { row: 20, col: 18 };
const initialGhost3 = { row: 5, col: 7 };
const initialGhost4 = { row: 11, col: 12 };
const bonusDuration = 10000; 
let pacBretzelMoveInterval = setInterval(movePacBretzel, 200);

let foodEaten = 0;
let totalFood = 0;
let bonusEaten = 0;
let totalBonus = 0;
for (let row = 0; row < maze.length; row++) {
  for (let col = 0; col < maze[row].length; col++) {
    if (maze[row][col] === '.') {
      totalFood++;
    } else if (maze[row][col] === '*') {
      totalBonus++;
    }
  }
}
let bonusActive = false;
let bonusTimeout;
let intervalId;
document.getElementById('restart-button').addEventListener('click', resetGame);
// Fonction pour générer le labyrinthe dans le HTML à partir de la matrice
function createMaze() {
  const mazeContainer = document.getElementById('maze-container');
  for (let row = 0; row < maze.length; row++) {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'row';

    for (let col = 0; col < maze[row].length; col++) {
      const cellDiv = document.createElement('div');
      cellDiv.className = 'cell';
      if (maze[row][col] === 'W') {
        cellDiv.classList.add('wall');
      } else {
        cellDiv.classList.add('path');
      }
      rowDiv.appendChild(cellDiv);
    }
    mazeContainer.appendChild(rowDiv);
  }
}
// Appeler la fonction createMaze() pour générer le labyrinthe
createMaze();
class Character {
  constructor(imageSrc, row, col) {
    this.image = new Image();
    this.image.src = imageSrc;
    this.row = row;
    this.col = col;
	this.isKO = false;
	this.isVulnerable = false;
	this.direction = null;
  }

  render() {
    const cell = getCellElement(this.row, this.col);
    cell.appendChild(this.image);
  }
}

function getCellElement(row, col) {
  const mazeContainer = document.getElementById('maze-container');
  const rowElement = mazeContainer.getElementsByClassName('row')[row];
  return rowElement.getElementsByClassName('cell')[col];
}
// Créer le personnage principal (Pac Bretzel)
const pacBretzel = new Character('bret.png', initialPacBretzel.row, initialPacBretzel.col);
pacBretzel.totalFood = 0;
pacBretzel.totalBonus = 0;
// Créer les fantômes
const ghost1 = new Character('bretfantome1.png', 1, 16);
ghost1.initialImageSrc = 'bretfantome1.png';
const ghost2 = new Character('bretfantome2.png', 20, 18);
ghost2.initialImageSrc = 'bretfantome2.png';
const ghost3 = new Character('bretfantome3.png', 5, 7);
ghost3.initialImageSrc = 'bretfantome3.png';
const ghost4 = new Character('bretfantome4.png', 10, 12);
ghost4.initialImageSrc = 'bretfantome4.png';
// Créer la nourriture et les bonus
function placeFoodAndBonuses() {
  pacBretzel.totalFood = 0;
  pacBretzel.totalBonus = 0;
  for (let row = 0; row < maze.length; row++) {
    for (let col = 0; col < maze[row].length; col++) {
      const cell = getCellElement(row, col);

      if (maze[row][col] === '.') {
        pacBretzel.totalFood++;
        const foodImage = new Image();
        foodImage.src = 'bretzel.png';
        cell.appendChild(foodImage);
      } else if (maze[row][col] === '*') {
        pacBretzel.totalBonus++;
        const bonusImage = new Image();
        bonusImage.src = 'bretzelbonus.png';
        cell.appendChild(bonusImage);
      }
    }
  }
}
// Appeler les fonctions pour initialiser les personnages et la nourriture
pacBretzel.render();
placeFoodAndBonuses();
ghost1.render();
ghost2.render();
ghost3.render();
ghost4.render();
initializeLivesDisplay();

// Fonction pour vérifier si le déplacement est valide
function canMoveTo(row, col) {
  if (row < 0 || row >= maze.length || col < 0 || col >= maze[row].length) {
    return false;
  }
  return maze[row][col] !== 'W';
}
function moveCharacter(character, newRow, newCol) {
  const oldCell = getCellElement(character.row, character.col);
  const oldImage = oldCell.querySelector(`img[src="${character.image.src}"]`);
  if (oldImage) {
    oldCell.removeChild(oldImage);
  }
  character.row = newRow;
  character.col = newCol;
  const newCell = getCellElement(newRow, newCol);
  
  if (character === pacBretzel) {
    newCell.appendChild(character.image);
  } else {
    newCell.insertBefore(character.image, newCell.firstChild);
  }
}
const DIRECTIONS = [
  { row: -1, col: 0 }, // Up
  { row: 1, col: 0 },  // Down
  { row: 0, col: -1 }, // Left
  { row: 0, col: 1 },  // Right
];
// Fonction pour déterminer la prochaine direction de déplacement des fantômes
function getNextGhostDirection(ghost) {
  const validDirections = [];
  for (const direction of DIRECTIONS) {
    const newRow = ghost.row + direction.row;
    const newCol = ghost.col + direction.col;
    if (canMoveTo(newRow, newCol)) {
      validDirections.push(direction);
    }
  }
  // Vérifiez si validDirections est vide et retournez un objet par défaut dans ce cas
  if (validDirections.length === 0) {
    return { row: 0, col: 0 };
  }
  return validDirections[Math.floor(Math.random() * validDirections.length)];
}
// Fonction pour déplacer un fantôme
function moveGhost(ghost) {
  const nextDirection = getNextGhostDirection(ghost);
  const newRow = ghost.row + nextDirection.row;
  const newCol = ghost.col + nextDirection.col;
  moveCharacter(ghost, newRow, newCol);
}
function moveGhosts() {
  if (!ghost1.isKO) {
    moveGhost(ghost1);
  }
  if (!ghost2.isKO) {
    moveGhost(ghost2);
  }
  if (!ghost3.isKO) {
    moveGhost(ghost3);
  }
  if (!ghost4.isKO) {
    moveGhost(ghost4);
  }
}
// Déplacer les fantômes à intervalles réguliers
let ghostMoveInterval = setInterval(moveGhosts, 300);
// Fonction pour vérifier si Pac Bretzel est sur une cellule contenant de la nourriture
function isOnFood(row, col) {
  return maze[row][col] === '.';
}
// Fonction pour vérifier si Pac Bretzel est sur une cellule contenant un bonus
function isOnBonus(row, col) {
  return maze[row][col] === '*';
}
function eatFoodOrBonus(row, col) {
  const cell = getCellElement(row, col);

  if (maze[row][col] === '.') {
    maze[row][col] = ' ';
    const foodImage = cell.querySelector('img[src="bretzel.png"]');
    if (foodImage) {
      cell.removeChild(foodImage);
      foodEaten++;
      updateScore(10);
    }
  } else if (maze[row][col] === '*') {
    maze[row][col] = ' ';
    const bonusImage = cell.querySelector('img[src="bretzelbonus.png"]');
    if (bonusImage) {
      cell.removeChild(bonusImage);
      bonusEaten++;
      updateScore(50);

      if (bonusActive) {
        clearTimeout(bonusTimeout);
      } else {
        activateBonus();
      }
      bonusTimeout = setTimeout(() => {
        deactivateBonus();
      }, 10000);
    }
  }
}

function deactivateBonus() {
  changeGhostAppearance('bretfantomeKO.png');
  bonusActive = false;

  for (const ghost of [ghost1, ghost2, ghost3, ghost4]) {
    ghost.isVulnerable = false;
    ghost.image.src = ghost.initialImageSrc;
  }
}
function updateScore(points) {
  pacBretzel.score += points;
  document.getElementById('score').textContent = pacBretzel.score;
}
function activateBonus() {
  changeGhostAppearance('bretfantomeKO.png');
  bonusActive = true;

  for (const ghost of [ghost1, ghost2, ghost3, ghost4]) {
    ghost.isVulnerable = true;
    setTimeout(() => {
      if (ghost.isVulnerable) {
        ghost.image.src = ghost.initialImageSrc;
        ghost.isVulnerable = false;
      }
    }, bonusDuration);
  }
}

// Modifier la fonction handleKeyboardControls pour gérer les interactions entre Pac Bretzel et la nourriture/bonus
function handleKeyboardControls(event) {
  let newDirection;
  switch (event.key) {
    case 'ArrowUp':
      newDirection = { row: -1, col: 0 };
      break;
    case 'ArrowDown':
      newDirection = { row: 1, col: 0 };
      break;
    case 'ArrowLeft':
      newDirection = { row: 0, col: -1 };
      break;
    case 'ArrowRight':
      newDirection = { row: 0, col: 1 };
      break;
    default:
      return;
  }

  const newRow = pacBretzel.row + newDirection.row;
  const newCol = pacBretzel.col + newDirection.col;

  if (canMoveTo(newRow, newCol)) {
    pacBretzel.direction = newDirection;
  }
}


function movePacBretzel() {
  if (!pacBretzel.direction) {
    return;
  }
  let newRow = pacBretzel.row + pacBretzel.direction.row;
  let newCol = pacBretzel.col + pacBretzel.direction.col;
  if (canMoveTo(newRow, newCol)) {
    moveCharacter(pacBretzel, newRow, newCol);

    if (isOnFood(newRow, newCol) || isOnBonus(newRow, newCol)) {
      eatFoodOrBonus(newRow, newCol);
      checkVictory();
    }

    for (const ghost of [ghost1, ghost2, ghost3, ghost4]) {
      if (isOnSameCell(pacBretzel, ghost)) {
        if (ghost.isVulnerable) {
          ghost.isKO = true;
          ghost.image.src = 'bretfantomeKO.png';
          updateScore(200);
          setTimeout(() => {
            ghost.isKO = false;
            ghost.image.src = ghost.initialImageSrc;
          }, 10000);
        } else if (!ghost.isKO) {
          loseLife();
        }
        break;
      }
    }
    checkVictory();
  }
}


function checkVictory() {
  if (foodEaten === totalFood && bonusEaten === totalBonus) {
    clearInterval(ghostMoveInterval);
    alert('Félicitations, tu as réussi à finir le jeu Pac Bretzel ! Voici le mot Metamask gagné : 10.jazz');
    resetGame();
  }
}

// Ajouter un écouteur d'événements pour les contrôles du clavier
document.addEventListener('keydown', handleKeyboardControls);
// Fonction pour vérifier si Pac Bretzel et un fantôme sont sur la même cellule
function isOnSameCell(pac, ghost) {
  return pac.row === ghost.row && pac.col === ghost.col;
}
function loseLife() {
  const lives = document.querySelectorAll('.life');
  if (lives.length > 0) {
    lives[0].remove();
	resetCharacters();
  } else {
    gameOver();
    // Ajoutez ici le code pour gérer la fin de la partie, par exemple en affichant un message "Game Over" et en arrêtant le jeu.
  }
}
function resetCharacters() {
  clearInterval(ghostMoveInterval); // Effacer l'intervalle de déplacement des fantômes
  pacBretzel.row = initialPacBretzel.row;
  pacBretzel.col = initialPacBretzel.col;
  ghost1.row = initialGhost1.row;
  ghost1.col = initialGhost1.col;
  ghost2.row = initialGhost2.row;
  ghost2.col = initialGhost2.col;
  ghost3.row = initialGhost3.row;
  ghost3.col = initialGhost3.col;
  ghost4.row = initialGhost4.row;
  ghost4.col = initialGhost4.col;
  ghostMoveInterval = setInterval(moveGhosts, 300); // Réinitialiser l'intervalle de déplacement des fantômes
}
function gameOver() {
  clearInterval(ghostMoveInterval);
  alert("Dommage, tu as perdu ! Essaye encore une fois.");
  resetGame();
}
function resetGame() {
  foodEaten = 0;
  bonusEaten = 0;
  pacBretzel.score = 0;
  updateScore(0);
  maze = JSON.parse(JSON.stringify(initialMaze));
  document.getElementById('maze-container').innerHTML = '';
  createMaze();
  placeFoodAndBonuses();
  resetCharacters();
  initializeLivesDisplay();
  clearInterval(ghostMoveInterval);
  ghostMoveInterval = setInterval(moveGhosts, 300);
}

function initializeLivesDisplay() {
  const livesContainer = document.getElementById('lives-display');
  livesContainer.innerHTML = '';

  for (let i = 0; i < pacBretzel.lives; i++) {
    const lifeImg = new Image();
    lifeImg.src = 'life.png';
    lifeImg.classList.add('life');
    livesContainer.appendChild(lifeImg);
  }
}
function updateBoard() {
  const mazeContainer = document.getElementById('maze-container');
  mazeContainer.innerHTML = '';
  createMaze();
  placeFoodAndBonuses();
  pacBretzel.render();
  ghost1.render();
  ghost2.render();
  ghost3.render();
  ghost4.render();
}
function changeGhostAppearance(imageSrc) {
  for (const ghost of [ghost1, ghost2, ghost3, ghost4]) {
    ghost.image.src = imageSrc;
  }
}
function resetGhostAppearance(ghost) {
  let newImage;
  if (ghost === ghost1) {
    newImage = 'bretfantome1.png';
  } else if (ghost === ghost2) {
    newImage = 'bretfantome2.png';
  } else if (ghost === ghost3) {
    newImage = 'bretfantome3.png';
  } else if (ghost === ghost4) {
    newImage = 'bretfantome4.png';
  }
  changeGhostAppearance(ghost, newImage);
}
document.addEventListener('DOMContentLoaded', function() {
  const soundToggle = document.getElementById('sound-toggle');
  const backgroundMusic = document.getElementById('background-music');

  soundToggle.addEventListener('click', function() {
    if (backgroundMusic.paused) {
      backgroundMusic.play();
      soundToggle.textContent = 'Mute';
    } else {
      backgroundMusic.pause();
      soundToggle.textContent = 'Musique';
    }
  });
});

