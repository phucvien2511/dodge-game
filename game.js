const charSize = 40;
const offsetX = 50;
const offsetY = 100;
const width = document.querySelector('.game-pattern').offsetWidth / charSize;
const height = document.querySelector('.game-pattern').offsetHeight / charSize;
const board = document.querySelector('.game-pattern');
const borderImg = 'url("image/wall2.jpg")';
const mapImg = 'url("image/wall.jpg")';

let charX = 0;
let charY = 0;
let score = 0;
let life = 3;
let gameOver = false;
let obstacleInterval = null;
let coinInterval = null;
let heartInterval = null;
let numObstacle = 0;
let movementListener = null;
let spikeAppeared = false;
let lifeDropped = false;
function initGame() {
    //Empty the instructions inside game pattern
    document.querySelector('.game-pattern').innerHTML = '';
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
            element.style.backgroundImage = mapImg;
            element.style.backgroundRepeat = 'no-repeat';
            element.style.backgroundPosition = 'center';
            element.style.backgroundSize = 'cover';
            element.style.textAlign = 'center';
            element.style.border = '1px solid #b9b7bd';
            document.querySelector('.game-pattern').appendChild(element);
        }
    }
    //Top border
    for (let i = 0; i < width - 1; i++) {
        let element = document.createElement('div');
        element.classList.add('cell');
        element.style.position = 'absolute';
        element.style.left = offsetX + (i*charSize) + 'px';
        element.style.top = offsetY - charSize + 'px';
        element.style.width = charSize + 'px';
        element.style.height = charSize + 'px';
        element.style.backgroundImage = borderImg;
        element.style.backgroundRepeat = 'no-repeat';
        element.style.backgroundPosition = 'bottom';
        element.style.backgroundSize = '40px 20px';
        element.style.textAlign = 'center';
        // element.style.border = '1px solid #b9b7bd';
        document.querySelector('.game-pattern').appendChild(element);
    }
    //Bottom border
    for (let i = 0; i < width - 1; i++) {
        let element = document.createElement('div');
        element.classList.add('cell');
        element.style.position = 'absolute';
        element.style.left = offsetX + (i*charSize) + 'px';
        element.style.top = offsetY + (height - 1)*charSize + 'px';
        element.style.width = charSize + 'px';
        element.style.height = charSize + 'px';
        element.style.backgroundImage = borderImg;
        element.style.backgroundRepeat = 'no-repeat';
        element.style.backgroundPosition = 'top';
        element.style.backgroundSize = '40px 20px';
        element.style.textAlign = 'center';
        // element.style.border = '1px solid #b9b7bd';
        document.querySelector('.game-pattern').appendChild(element);
    }
    //Left border
    for (let i = 0; i < height - 1; i++) {
        let element = document.createElement('div');
        element.classList.add('cell');
        element.style.position = 'absolute';
        element.style.left = offsetX - charSize + 'px';
        element.style.top = offsetY + (i*charSize) + 'px';
        element.style.width = charSize + 'px';
        element.style.height = charSize + 'px';
        element.style.backgroundImage = borderImg;
        element.style.backgroundRepeat = 'no-repeat';
        element.style.backgroundPosition = 'right';
        element.style.backgroundSize = '20px 40px';
        element.style.textAlign = 'center';
        // element.style.border = '1px solid #b9b7bd';
        document.querySelector('.game-pattern').appendChild(element);
    }
    //Right border
    for (let i = 0; i < height - 1; i++) {
        let element = document.createElement('div');
        element.classList.add('cell');
        element.style.position = 'absolute';
        element.style.left = offsetX + (width - 1)*charSize + 'px';
        element.style.top = offsetY + (i*charSize) + 'px';
        element.style.width = charSize + 'px';
        element.style.height = charSize + 'px';
        element.style.backgroundImage = borderImg;
        element.style.backgroundRepeat = 'no-repeat';
        element.style.backgroundPosition = 'left';
        element.style.backgroundSize = '20px 40px';
        element.style.textAlign = 'center';
        // element.style.border = '1px solid #b9b7bd';
        document.querySelector('.game-pattern').appendChild(element);
    }
    //Fill the gap at the corners
    function fillCorner(posX, posY, bgPos) {
        let element = document.createElement('div');
        element.classList.add('cell');
        element.style.position = 'absolute';
        element.style.left = offsetX + (posX*charSize) + 'px';
        element.style.top = offsetY + (posY*charSize) + 'px';
        element.style.width = charSize + 'px';
        element.style.height = charSize + 'px';
        element.style.backgroundImage = borderImg;
        element.style.backgroundRepeat = 'no-repeat';
        element.style.backgroundPosition = bgPos;
        element.style.backgroundSize = '20px 20px';
        element.style.textAlign = 'center';
        // element.style.border = '1px solid #b9b7bd';
        document.querySelector('.game-pattern').appendChild(element);
    }
    //Top left corner
    fillCorner(-1, -1, 'bottom right');
    //Top right corner
    fillCorner(width-1, -1, 'bottom left');
    //Bottom left corner
    fillCorner(-1, height-1, 'top right');
    //Bottom right corner
    fillCorner(width-1, height-1, 'top left');

    //Create lifeboard
    for (let i = 0; i < 3; i++) {
        let element = document.createElement('div');
        element.classList.add('life');
        element.style.width = '30px';
        element.style.height = '30px';
        element.style.backgroundImage = "url('image/heart.png')";
        element.style.backgroundSize = '30px 30px';
        element.style.backgroundRepeat = 'no-repeat';
        document.querySelector('.lifeboard').appendChild(element);
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
    life = 3;
    controlCharacter();
    //Spawn new obstacles, coins and hearts every 3 seconds
    obstacleInterval = setInterval(spawnObstacle, 3000);
    coinInterval = setInterval(spawnCoin, 3000);
    heartInterval = setInterval(spawnHeart, 3000);
    //Stop the spawn when game over
    if (gameOver) {
        clearInterval(obstacleInterval);
        clearInterval(coinInterval);
        clearInterval(heartInterval);
        return;
    }
}

function controlCharacter() {
    //Use WASD to control the character
    let char = document.getElementById('character');
    if (movementListener) {
        document.removeEventListener('keydown', movementListener);
    }
    movementListener = function(e) {
        if (e.keyCode === 87) {
            //W
            charY--;
            if (charY < 0) {
                charY = 0;
            }
        }
        else if (e.keyCode === 65) {
            //A
            charX--;
            if (charX < 0) {
                charX = 0;
            }
        }
        else if (e.keyCode === 83) {
            //S
            charY++;
            if (charY > height - 2) {
                charY = height - 2;
            }
        }
        else if (e.keyCode === 68) {
            //D
            charX++;
            if (charX > width - 2) {
                charX = width - 2;
            }
        }
        char.style.left = offsetX + (charX * charSize) + 'px';
        char.style.top = offsetY + (charY * charSize) + 'px';
    };
    document.addEventListener('keydown', movementListener);
}

function spawnCoin() {
    //Spawn a coin at random position 
    let coinX = Math.floor(Math.random() * (width - 1));
    let coinY = Math.floor(Math.random() * (height - 1));
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
    //Make coin disappear after 8 seconds
    setTimeout(function () {
        document.querySelector('.game-pattern').removeChild(coin);
    }, 8000);
}

function spawnHeart() {
    //Spawn a heart at random position 
    let heartX = Math.floor(Math.random() * (width - 1));
    let heartY = Math.floor(Math.random() * (height - 1));
    let heart = document.createElement('div');
    heart.classList.add('heart');
    heart.style.position = 'absolute';
    heart.style.left = offsetX + (heartX * charSize) + 'px';
    heart.style.top = offsetY + (heartY * charSize) + 'px';
    heart.style.width = charSize + 'px';
    heart.style.height = charSize + 'px';
    heart.style.backgroundImage = "url('image/heart.png')";
    heart.style.backgroundRepeat = 'no-repeat';
    heart.style.backgroundPosition = 'center';
    heart.style.backgroundSize = 'cover';
    heart.style.textAlign = 'center';
    heart.style.lineHeight = charSize + 'px';
    document.querySelector('.game-pattern').appendChild(heart);
    //Make heart disappear after 8 seconds
    setTimeout(function () {
        document.querySelector('.game-pattern').removeChild(heart);
    }, 8000);
}

function spawnObstacle() {
    //Create obstacles based on score
    if (score <= 20) {
        numObstacle = Math.floor(Math.random() * 40) + 20;
    }
    else if (score > 20 && score <= 40) {
        numObstacle = Math.floor(Math.random() * 70) + 41;
    }
    else if (score > 40 && score <= 60) {
        numObstacle = Math.floor(Math.random() * 100) + 71;
    }
    else if (score > 60 && score <= 80) {
        numObstacle = Math.floor(Math.random() * 130) + 101;
    }
    else if (score > 80 && score <= 100){
        numObstacle = Math.floor(Math.random() * 170) + 131;
    }
    else {
        numObstacle = 200;
    }
    //Spawn obstacles
    for (let i = 0; i < numObstacle; i++) {
        let obstacleX = Math.floor(Math.random() * (width - 1));
        let obstacleY = Math.floor(Math.random() * (height - 1));
        let obstacle = document.createElement('div');
        obstacle.classList.add('obstacle');
        obstacle.style.position = 'absolute';
        obstacle.style.left = offsetX + (obstacleX * charSize) + 'px';
        obstacle.style.top = offsetY + (obstacleY * charSize) + 'px';
        obstacle.style.width = charSize + 'px';
        obstacle.style.height = charSize + 'px';
        obstacle.style.backgroundImage = "url('image/caution.png')";    //First, make obstacle appear as caution sign to warn player
        obstacle.style.backgroundRepeat = 'no-repeat';
        obstacle.style.backgroundPosition = 'center';
        obstacle.style.backgroundSize = 'cover';
        obstacle.style.textAlign = 'center';
        obstacle.style.lineHeight = charSize + 'px';
        obstacle.style.zIndex = '4';
        document.querySelector('.game-pattern').appendChild(obstacle);

    }
    //Play caution sound
    let audio = new Audio('audio/caution.mp3');
    audio.volume = 0.2;
    audio.play();
    //Make obstacles appear after 1 second
    setTimeout(function () {
        document.querySelectorAll('.obstacle').forEach(obstacle => {
            obstacle.style.backgroundImage = "url('image/spike.png')";
            obstacle.style.backgroundRepeat = 'no-repeat';
            obstacle.style.backgroundPosition = 'center';
            obstacle.style.backgroundSize = 'cover';
            obstacle.textContent = '';
            obstacle.style.zIndex = '2';    //Bring character to front
        });
        spikeAppeared = true;
        updateScore();
    }, 1000);
    
    //Make spike disappear 
    setTimeout(function () {
        document.querySelectorAll('.obstacle').forEach(obstacle => {
            document.querySelector('.game-pattern').removeChild(obstacle);
        });
        spikeAppeared = false;
        lifeDropped = false;
    }, 1500);
}


function updateScore() {
    // Check if character is on obstacle
    let char = document.getElementById('character');
    let obstacles = document.querySelectorAll('.obstacle');
    obstacles.forEach((obstacle) => {
        if (!gameOver && spikeAppeared) {
            if (obstacle.style.left === char.style.left && obstacle.style.top === char.style.top) {
                if (!lifeDropped) {
                    life--;
                    lifeDropped = true;
                    // Remove 1 heart
                    let life_board = document.querySelector('.lifeboard').lastElementChild;
                    document.querySelector('.lifeboard').removeChild(life_board);
                    let audio = new Audio('audio/hit.mp3');
                    audio.volume = 0.2;
                    audio.play();
                }
                if (life < 1) {
                    gameOver = true;
                    clearInterval(obstacleInterval);
                    clearInterval(coinInterval);
                    clearInterval(heartInterval);
                    alert('Game Over! Your score is ' + score);
                    char.style.backgroundImage = "url('image/skull.webp')";
                    document.querySelectorAll('.coin').forEach((coin) => {
                        coin.remove();
                    });
                    document.querySelectorAll('.heart').forEach((heart) => {
                        heart.remove();
                    });
                }
            }
        }
    });
}
setInterval(updateScore, 1);

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

setInterval(function updateHeart() {
    let hearts = document.querySelectorAll('.heart');
    let char = document.getElementById('character');
    hearts.forEach(heart => {
        if (!gameOver) {
            if (heart.style.left === char.style.left && heart.style.top === char.style.top) {
                if (life < 3) {
                    life++;
                    //Append heart to life bar
                    let element = document.createElement('div');
                    element.classList.add('life');
                    element.style.width = '30px';
                    element.style.height = '30px';
                    element.style.backgroundImage = "url('image/heart.png')";
                    element.style.backgroundSize = '30px 30px';
                    element.style.backgroundRepeat = 'no-repeat';
                    document.querySelector('.lifeboard').appendChild(element);
                }
                heart.remove();
            }
        }
    });
}, 1);

function resetGame() {
    score = 0;
    charX = 0;
    charY = 0;
    numObstacle = 0;
    gameOver = false;
    spikeAppeared = false;
    lifeDropped = false;
    life = 3;
    clearInterval(obstacleInterval);
    clearInterval(coinInterval);
    clearInterval(heartInterval);
    document.getElementById('score').innerHTML = score;
    document.querySelector('.start-btn').disabled = false;
    document.querySelector('.game-pattern').innerHTML = `
        <div class="desc">
            <div>Once upon a time, there was a HCMUT student who found himself stuck inside a dream with Deadline devil. In this dream, he becomes a knight who is never gonna give you up...</div>
            <div class="play-rules">
                <div>How to play?</div>
                <div>W: Move up</div>
                <div>S: Move down</div>
                <div>A: Move left</div>
                <div>D: Move right</div>
            </div>
            <div>Try to dodge the obstacles and collect as many coins as you can!</div>
            <div>As you get more coins, the nightmare will become more and more intense! Watch out your step!</div>
            <div style="color: red;">Before playing, please turn off Telex and use headphones for better experience.</div>
        </div>
    `;
    return;
}
