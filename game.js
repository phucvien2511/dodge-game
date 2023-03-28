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
let enemyInterval = null;
let numObstacle = 0;
let movementListener = null;
let spikeAppeared = false;
let lifeDropped = false;

let bgAudio = new Audio('audio/bg.mp3');
bgAudio.volume = 0.5;
bgAudio.loop = true;
bgAudio.play();
bgAudio.currentTime = 25;
// let soundState = true;
// function triggerSound() {
//     if (soundState) {
//         bgAudio.volume = 0;
//         soundState = false;
//         document.getElementById('sound-btn-bg').src = 'image/volume_off.png';
//     } 
//     else {
//         bgAudio.volume = 0.8;
//         soundState = true;
//         document.getElementById('sound-btn-bg').src = 'image/volume_on.png';
//     }
// }

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
            //element.style.border = '1px solid #b9b7bd';
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
    charElement.style.backgroundImage = "url('image/knight_right.gif')";
    charElement.style.backgroundPosition = 'top 50% right 20%';
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
    heartInterval = setInterval(spawnHeart, 8000);
    enemyInterval = setInterval(spawnEnemy, 5000);
    //Stop the spawn when game over
    
    if (gameOver) {
        clearInterval(obstacleInterval);
        clearInterval(coinInterval);
        clearInterval(heartInterval);
        clearInterval(enemyInterval);
        //Delete all inside game pattern
        
        return;
    }
    
}

function spawnCutEffect(direction) {
    let cutEffect = document.createElement('div');
    cutEffect.classList.add('cut-effect');
    cutEffect.style.position = 'absolute';
    cutEffect.style.left = charX*charSize + offsetX + 'px';
    cutEffect.style.top = charY*charSize + offsetY + 'px';
    cutEffect.style.width = charSize + 'px';
    cutEffect.style.height = charSize + 'px';
    cutEffect.style.backgroundImage = "url('image/cut.png')";
    cutEffect.style.backgroundRepeat = 'no-repeat';
    cutEffect.style.backgroundSize = '100% 100%';
    cutEffect.style.backgroundPosition = direction;
    document.querySelector('.game-pattern').appendChild(cutEffect);
    let cutEffectInterval = setInterval(function() {
        if (direction === 'left') {
            cutEffect.style.left = cutEffect.offsetLeft - 10 + 'px';
            cutEffect.style.transform = 'rotateY(180deg)';
        }
        else if (direction === 'right') {
            cutEffect.style.left = cutEffect.offsetLeft + 10 + 'px';
        }
        else if (direction === 'up') {
            cutEffect.style.top = cutEffect.offsetTop - 10 + 'px';
            cutEffect.style.backgroundImage = "url('image/cutU.png')";
        }
        else if (direction === 'down') {
            cutEffect.style.top = cutEffect.offsetTop + 10 + 'px';
            cutEffect.style.backgroundImage = "url('image/cutD.png')";
        }
        if (cutEffect.offsetLeft < offsetX || cutEffect.offsetLeft > offsetX + (width - 1)*charSize || cutEffect.offsetTop < offsetY || cutEffect.offsetTop > offsetY + (height - 1)*charSize) {
            cutEffect.remove();
            clearInterval(cutEffectInterval);
        }
    } , 15);
    


}
let standListener = null;
let direction = 'right';

function controlCharacter() {
    //Use WASD to control the character
    let char = document.getElementById('character');
    if (movementListener) {
        document.removeEventListener('keydown', movementListener);
    }
    //Only move on 2nd keydown, the first keydown is only to change the direction
    movementListener = function(e) {
        if (e.keyCode === 87) {

            //W
            if (direction !== 'up') {
                direction = 'up';
            }
            else charY--;
            // direction = 'up';
            // charY--;
            if (charY < 0) {
                charY = 0;
            }
            char.style.backgroundImage = "url('image/knight_up.gif')";
            char.style.backgroundPosition = 'top 50% center';
        }
        else if (e.keyCode === 65) {
            //A
            if (direction !== 'left') {
                direction = 'left';
            }
            else charX--;
            // direction = 'left';
            // charX--;
            if (charX < 0) {
                charX = 0;
            }
            char.style.backgroundImage = "url('image/knight_left.gif')";
            char.style.backgroundPosition = 'top 50% left 20%';
        }
        else if (e.keyCode === 83) {
            //S
            if (direction !== 'down') {
                direction = 'down';
            }
            else charY++;
            // direction = 'down';
            // charY++;
            if (charY > height - 2) {
                charY = height - 2;
            }
            char.style.backgroundImage = "url('image/knight_down.gif')";
            char.style.backgroundPosition = 'top 50% center';
        }
        else if (e.keyCode === 68) {
            //D
            if (direction !== 'right') {
                direction = 'right';
            }
            else charX++;
            // direction = 'right';
            // charX++;
            if (charX > width - 2) {
                charX = width - 2;
            }
            char.style.backgroundImage = "url('image/knight_right.gif')";
            char.style.backgroundPosition = 'top 50% right 20%';
        }
        //Press space to attack
        else if (e.keyCode === 32) {
            if (direction === 'up') {
                char.style.backgroundImage = "url('image/knight_atk_top.gif')";
                spawnCutEffect('up');
            }
            else if (direction === 'left') {
                char.style.backgroundImage = "url('image/knight_atk_left.gif')";
                spawnCutEffect('left');
            }
            else if (direction === 'down') {
                char.style.backgroundImage = "url('image/knight_atk_down.gif')";
                spawnCutEffect('down');
            }
            else if (direction === 'right') {
                char.style.backgroundImage = "url('image/knight_atk_right.gif')";
                spawnCutEffect('right');
            }
            
        }
        char.style.left = offsetX + (charX * charSize) + 'px';
        char.style.top = offsetY + (charY * charSize) + 'px';
    };

    document.addEventListener('keydown', movementListener);
    //Add timeout to attack animation only stop after 0.5s when space is released
    if (standListener) {
        document.removeEventListener('keyup', standListener);
    }
    standListener = function(e) {
        if (e.keyCode === 32) {
            if (direction === 'up') {
                setTimeout(function() {
                    char.style.backgroundImage = "url('image/knight_up.gif')";
                    char.style.backgroundPosition = 'top 50% center';
                }, 600);
            }
            else if (direction === 'left') {
                setTimeout(function() {
                    char.style.backgroundImage = "url('image/knight_left.gif')";
                    char.style.backgroundPosition = 'top 50% left 20%';
                }, 600);
            }
            else if (direction === 'down') {
                setTimeout(function() {
                    char.style.backgroundImage = "url('image/knight_down.gif')";
                    char.style.backgroundPosition = 'top 50% center';
                }, 600);
            }
            else if (direction === 'right') {
                setTimeout(function() {
                    char.style.backgroundImage = "url('image/knight_right.gif')";
                    char.style.backgroundPosition = 'top 50% right 20%';
                }, 600);
                
            }
        }
    };

    document.addEventListener('keyup', standListener);
    
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
    coin.style.backgroundPosition = 'center bottom';
    coin.style.backgroundSize = '25px 25px';
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
    heart.style.backgroundPosition = 'center';
    heart.style.backgroundSize = '25px 25px';
    heart.style.backgroundRepeat = 'no-repeat';
    heart.style.lineHeight = charSize + 'px';
    document.querySelector('.game-pattern').appendChild(heart);
    //Make heart disappear after 8 seconds
    setTimeout(function () {
        document.querySelector('.game-pattern').removeChild(heart);
    }, 10000);
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

function spawnEnemy() {
    let enemyX = Math.floor(Math.random() * (width - 1));
    let enemyY = Math.floor(Math.random() * (height - 1));
    let enemy = document.createElement('div');
    enemy.classList.add('enemy');
    enemy.style.position = 'absolute';
    enemy.style.left = offsetX + (enemyX * charSize) + 'px';
    enemy.style.top = offsetY + (enemyY * charSize) + 'px';
    enemy.style.width = charSize + 'px';
    enemy.style.height = charSize + 'px';
    enemy.style.backgroundImage = "url('image/devil.gif')";
    enemy.style.backgroundRepeat = 'no-repeat';
    enemy.style.backgroundPosition = 'center';
    enemy.style.backgroundSize = 'cover';
    enemy.style.textAlign = 'center';
    enemy.style.lineHeight = charSize + 'px';
    enemy.style.zIndex = '4';
    document.querySelector('.game-pattern').appendChild(enemy);
}
function updateEnemy() {
    //Check if the cut effect is on enemy
    let cut = document.querySelectorAll('.cut-effect');
    let enemies = document.querySelectorAll('.enemy');
    enemies.forEach((enemy) => {
        cut.forEach((cut) => {
            if (cut.style.left === enemy.style.left && cut.style.top === enemy.style.top) {
                enemy.remove();
                let audio = new Audio('audio/hit.mp3');
                audio.volume = 0.2;
                audio.play();
                cut.remove();
            }
        });
    });
}
setInterval(updateEnemy, 1);
function updateScore() {
    // Check if character is on obstacle
    let char = document.getElementById('character');
    let prevBackground = char.style.backgroundImage;
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
                    char.style.backgroundImage = "url('image/knight_hurt.gif')";
                    char.style.backgroundPosition = 'center';
                    setTimeout(function () {
                        char.style.backgroundImage = prevBackground;
                    }, 500);
                }
                if (life < 1) {
                        gameOver = true;
                        clearInterval(obstacleInterval);
                        clearInterval(coinInterval);
                        clearInterval(heartInterval);
                        alert('Game Over! Your score is ' + score);
                        document.querySelector('.game-pattern').innerHTML = 'GAME OVER';
                        document.querySelectorAll('.coin').forEach((coin) => {
                            coin.remove();
                        });
                        document.querySelectorAll('.heart').forEach((heart) => {
                            heart.remove();
                        });
                        document.querySelectorAll('.obstacle').forEach((obstacle) => {
                            obstacle.remove();
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
    clearInterval(enemyInterval);
    document.getElementById('score').innerHTML = score;
    document.querySelector('.start-btn').disabled = false;
    document.querySelector('.lifeboard').innerHTML = '';
    document.querySelector('.game-pattern').innerHTML = `
        <div class="desc">
            <div>Once upon a time, there was a HCMUT student who found himself stuck inside a dream with Deadline devil. In this dream, he becomes a knight who is never gonna give you up...</div>
            <div class="play-rules">
                <div>How to play?</div>
                <div>W: Move up</div>
                <div>S: Move down</div>
                <div>A: Move left</div>
                <div>D: Move right</div>
                <div>Space: Attack (On beta)</div>
            </div>
            <div>Try to dodge the obstacles and collect as many coins as you can!</div>
            <div>As you get more coins, the nightmare will become more and more intense! Watch out your step!</div>
            <div style="color: red;">Before playing, please turn off Telex and use headphones for better experience.</div>
        </div>
    `;
    return;
}
