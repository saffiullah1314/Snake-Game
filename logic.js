// ________________________Const let variable__________________________
const container = document.querySelector(".container");
const button = document.querySelector(".resetbutton");
const scor = document.querySelector(".score-board .score");
const highScor = document.querySelector(".score-board .high-score");
const gameOverMsg = document.querySelector(".msg");
const gameOverMp3 = new Audio ("music_gameover.mp3");
const foodEatMp3 = new Audio ("music_food.mp3");
const moveMp3 = new Audio ("music_move.mp3");

let foodX, foodY;
let snakeX = 15, snakeY = 15;
let directionX = 0, directionY = 0;
let snakeTail = [];
let score = 0;
let highScore = localStorage.getItem("highScore") || 0; // Load high score from localStorage or initialize to 0
let setIntervalId;

// Display initial high score
highScor.innerText = `High-score : ${highScore}`;



// ________________________Main Funtions__________________________

// Main function to run the game loop
const main = () => {
    gameOverMsg.classList.add("hide"); // Hide game over message initially

    container.innerHTML = ""; // Clear the container

    foodEat();      // Check if the snake ate the food
    createFood();   // Create food at current food position
    createSnake();  // Create snake head at updated snake position

    // Check if snake hits boundary
    if (snakeX <= 0 || snakeX > 35 || snakeY <= 0 || snakeY > 35) {
        gameOver();
    }
}

// For creating food div
const createFood = () => {
    container.innerHTML += `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;
}

// Create snake with tail div
const createSnake = () => {
    // Update snake's body parts
    for (let i = snakeTail.length - 1; i > 0; i--) {
        snakeTail[i] = snakeTail[i - 1];
    }
    snakeTail[0] = [snakeX, snakeY];

    // Update snake's position
    snakeX += directionX;
    snakeY += directionY;

    for (let i = 0; i < snakeTail.length; i++) {
        if (i === 0) {
            // This is the head, give it a different color or image
            container.innerHTML += `
                <div class="snake-head" style="grid-area: ${snakeTail[i][1]} / ${snakeTail[i][0]}"></div>`;
        }
         else {
            // This is the body, keep the standard snake style
            container.innerHTML += `
                <div class="snake-body" style="grid-area: ${snakeTail[i][1]} / ${snakeTail[i][0]}"></div>`;
        }

        // Check for self-collision
        // snakeTail[0][1] ya snakehead ka Y ha or snakeTail[0][0] snake head ka x ha [x,y] hota ha snakeTail[i][0] ya snake body ka x ha
        if (i !== 0 && snakeTail[0][1] === snakeTail[i][1] && snakeTail[0][0] === snakeTail[i][0]) {
            gameOver();
        }
    }
};


// Randomly changing food position
const changeFoodPos = () => {
    foodX = Math.floor(Math.random() * 35) + 1;
    foodY = Math.floor(Math.random() * 35) + 1;
}

// Handle snake direction change based on keypress
const changeDirection = (e) => {
    if (e.key === "ArrowUp" && directionY != 1) {
        directionX = 0;
        directionY = -1;
        moveMp3.play();
    } else if (e.key === "ArrowDown" && directionY != -1) {
        directionX = 0;
        directionY = 1;
        moveMp3.play();
    } else if (e.key === "ArrowLeft" && directionX != 1) {
        directionX = -1;
        directionY = 0;
        moveMp3.play();
    } else if (e.key === "ArrowRight" && directionX != -1) {
        directionX = 1;
        directionY = 0;
        moveMp3.play();
    }
}



// Check if snake eats the food
const foodEat = () => {
    if (snakeX === foodX && snakeY === foodY) {
        changeFoodPos(); // Reposition food if eaten
        snakeTail.push([foodX, foodY]); // Increase tail length
        score++;
        scor.innerText = `Score : ${score}`; // Update score display

        // Check if we have a new high score
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore); // Update high score in localStorage
            highScor.innerText = `High-score : ${highScore}`; // Update high score display
        }
        foodEatMp3.play();
    }
}



// Game over function to stop the game and display message
const gameOver = () => {
    clearInterval(setIntervalId); // Stop game loop
    gameOverMsg.classList.remove("hide"); // Show Game Over message
    gameOverMp3.play();
}

// reset button click event
const resetBtn = () =>{
    gameOverMsg.classList.add("hide");
    setIntervalId = setInterval(main, 100);
    snakeX = 15, snakeY = 15;
    directionX = 0, directionY = 0;
    snakeTail = [];
    score = 0;
    scor.innerText = `Score : ${score}`; // Reset score display
    changeFoodPos();
}






// ________________________Calling Funtion__________________________

// Initial setup and game loop
changeFoodPos(); // Initial food position
document.addEventListener("keydown", changeDirection);
setIntervalId = setInterval(main, 100); // Game loop interval

// Reset button click event
button.addEventListener("click", resetBtn);
