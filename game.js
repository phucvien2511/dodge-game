const charSize = 40;
const offsetX = 50;
const offsetY = 100;
const width = document.querySelector('.game-pattern').offsetWidth / charSize;
const height = document.querySelector('.game-pattern').offsetHeight / charSize;
const board = document.querySelector('.game-pattern');

let charX = 0;
let charY = 0;
let score = 0;
let gameOver = false;
let obstacleInterval = null;
let coinInterval = null;
let numObstacle = 0;
let movementListener = null;
let spikeAppeared = false;
// let audio = new Audio('audio/medieval.mp3');
// audio.loop = true;
// audio.volume = 0.25;
// audio.play();
function initGame() {
    //Create board
    for (let i = 0; i < width - 1; i++) {
        for (let j = 0; j < height - 1; j++) {
            let element = document.createElement('div');
            element.classList.add('cell');
            element.style.position = 'absolute';
            element.style.left = offsetX + (i*charSize) + 'px';
            element.style.top = offsetY + (j*charSize) + 'px';
            element.style.width = charSize + 'px';
            element.style.height = charSize + 'px';
            element.style.backgroundColor = '#eeede7';
            element.style.border = '1px solid #b9b7bd';
            document.querySelector('.game-pattern').appendChild(element);
        }
    }
    //Create character
    let charElement = document.createElement('div');
    charElement.setAttribute('id', 'character');
    charElement.style.position = 'absolute';
    charElement.style.left =  offsetX + 'px';
    charElement.style.top = offsetY + 'px';
    charElement.style.width = charSize + 'px';
    charElement.style.height = charSize + 'px';
    document.querySelector('.game-pattern').appendChild(charElement);
    //Start game
    startGame();
    //Disabled the button after clicked
    document.querySelector('.start-btn').disabled = true;

}

function startGame() {
    controlCharacter();
    obstacleInterval = setInterval(spawnObstacle, 3000);
    coinInterval = setInterval(spawnCoin, 3000);
    if (gameOver) {
        clearInterval(obstacleInterval);
        clearInterval(coinInterval);
        return;
    }
}

function controlCharacter() {
    if (!gameOver) {
        let char = document.getElementById('character');
        if (movementListener) {
            document.removeEventListener('keydown', movementListener);
        }
        movementListener = function(event) {
            if (event.keyCode === 87) { // W key
                charY--;
                if (charY < 0) {
                    charY = 0;
                }
            } else if (event.keyCode === 83) { // S key
                charY++;
                if (charY > height - 2) {
                    charY = height - 2;
                }
            } else if (event.keyCode === 65) { // A key
                charX--;
                if (charX < 0) {
                    charX = 0;
                }
            } else if (event.keyCode === 68) { // D key
                charX++;
                if (charX > width - 2) {
                    charX = width - 2;
                }
            }
            const posX = offsetX + (charX * charSize);
            const posY = offsetY + (charY * charSize);
            char.style.left = posX + 'px';
            char.style.top = posY + 'px';
        };
        document.addEventListener('keydown', movementListener);
    }
}
function spawnCoin() {
    //Spawn a coin at random position 
    let coinX = Math.floor(Math.random() * (width - 2)) + 1;
    let coinY = Math.floor(Math.random() * (height - 2)) + 1;
    let coin = document.createElement('div');
    coin.classList.add('coin');
    coin.style.position = 'absolute';
    coin.style.left = offsetX + (coinX * charSize) + 'px';
    coin.style.top = offsetY + (coinY * charSize) + 'px';
    coin.style.width = charSize + 'px';
    coin.style.height = charSize + 'px';
    coin.style.backgroundImage = "url('image/coin.png')";
    coin.style.backgroundRepeat = 'no-repeat';
    coin.style.backgroundPosition = 'center';
    coin.style.backgroundSize = 'cover';
    coin.style.textAlign = 'center';
    coin.style.lineHeight = charSize + 'px';
    document.querySelector('.game-pattern').appendChild(coin);
    //Make coin disappear after 5 seconds
    setTimeout(function () {
        document.querySelector('.game-pattern').removeChild(coin);
    }, 5000);
}
function spawnObstacle() {
    //Create 50-250 obstacles
    numObstacle = Math.floor(Math.random() * 200) + 100;
    //Spawn obstacles
    for (let i = 0; i < numObstacle; i++) {
        //Spawn an obstacle at random position in the board
        let obstacleX = Math.floor(Math.random() * (width - 1));
        let obstacleY = Math.floor(Math.random() * (height - 1));
        let obstacle = document.createElement('div');
        obstacle.classList.add('obstacle');
        obstacle.style.position = 'absolute';
        obstacle.style.left = offsetX + (obstacleX * charSize) + 'px';
        obstacle.style.top = offsetY + (obstacleY * charSize) + 'px';
        obstacle.style.width = charSize + 'px';
        obstacle.style.height = charSize + 'px';
        obstacle.style.backgroundImage = "url('image/caution.png')";
        obstacle.style.backgroundRepeat = 'no-repeat';
        obstacle.style.backgroundPosition = 'center';
        obstacle.style.backgroundSize = 'cover';
        obstacle.style.textAlign = 'center';
        obstacle.style.lineHeight = charSize + 'px';
        document.querySelector('.game-pattern').appendChild(obstacle);

    }
    let audio2 = new Audio('audio/caution.mp3');
    audio2.volume = 0.2;
    audio2.playbackRate = 2;
    audio2.play();
    //Make spike appear
    setTimeout(function () {
        document.querySelectorAll('.obstacle').forEach(obstacle => {
            obstacle.style.backgroundImage = "url('image/spike.png')";
            obstacle.style.backgroundRepeat = 'no-repeat';
            obstacle.style.backgroundPosition = 'center';
            obstacle.style.backgroundSize = 'cover';
            obstacle.textContent = '';
            spikeAppeared = true;
        });
    }, 500);
    
    //Make spike disappear
    setTimeout(function () {
        document.querySelectorAll('.obstacle').forEach(obstacle => {
            obstacle.remove(); 
            spikeAppeared = false;
        });
    }, 1000);
}

setInterval(function updateScore() {
    //Check if character is on obstacle
    let char = document.getElementById('character');
    let obstacles = document.querySelectorAll('.obstacle');
    
    obstacles.forEach(obstacle => {
        if (!gameOver && spikeAppeared) {
            if (obstacle.style.left === char.style.left && obstacle.style.top === char.style.top) {
                gameOver = true;
                clearInterval(obstacleInterval);
                clearInterval(coinInterval);
                alert('Game Over! Your score is ' + score);
                char.style.backgroundImage = "url('image/skull.webp')";
                document.querySelectorAll('.coin').forEach(coin => {
                    coin.remove();
                });
            }
        }
    });
}, 1);


setInterval(function updateCoin() {
    let coins = document.querySelectorAll('.coin');
    let char = document.getElementById('character');
    coins.forEach(coin => {
        if (!gameOver) {
            if (coin.style.left === char.style.left && coin.style.top === char.style.top) {
                score++;
                document.getElementById('score').innerHTML = score;
                coin.remove();
                let audio = new Audio('audio/correct.mp3');
                audio.volume = 0.3;
                audio.play();
            }
        }
    });
}, 1);
function resetGame() {
    document.querySelector('.game-pattern').innerHTML = '';
    score = 0;
    document.getElementById('score').innerHTML = score;
    charX = 0;
    charY = 0;
    gameOver = false;
    clearInterval(obstacleInterval);
    document.querySelector('.start-btn').disabled = false;
    return;
}
