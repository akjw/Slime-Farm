/*----------Starting Display----------*/

var startDisplay = document.querySelector('.start-state');
var instructuons = document.querySelector('#instructions');
instructions.addEventListener('click', showInstructions);
var instructionDisplay = document.querySelector('.instruction-display');
var backButton = document.querySelector('#back');
backButton.addEventListener('click', backToMenu);
var selection = document.getElementsByName('difficultyLevel')
var startButton = document.querySelector('#start');
startButton.addEventListener('click', drawBoard);

/*----------Ending Display----------*/

var endDisplay = document.querySelector('.end-state');
var newHighScore = document.querySelector('.new-record-notif')
var endMessage = document.querySelector('.outcome-message');
var restartButton = document.querySelector('#restart');
restartButton.addEventListener('click', restartGame);

/*----------Game Display----------*/

var gameDisplay = document.querySelector('.game-display');
var grid = document.querySelector('#grid');
var cellClass;
var cells;
var moles = document.querySelectorAll('.mole')
var gemDisplay = document.querySelector('#gemNum');
var scoreDisplay = document.querySelector('#scoreNum');
var secondsLeft = document.querySelector('#secondsLeft');
var numLives = document.querySelector('#numLives');

/*----------Music & Sound Effects----------*/

var theme = new Audio("music/Slime Farm Theme.mp3")
var boinked = new Audio("music/Boinked.mp3");
var bullied = new Audio("music/Bullied.mp3");
var gem = new Audio("music/Gem.mp3");
var mauled = new Audio("music/Mauled.mp3");
var angryBoinked = new Audio("music/AngryBoinked.mp3")

/*----------Game Variables----------*/

var difficulty;
var lastSelectedCell;
var timesUp = true;
var score = 0;
var lives = 10;
var gems = 0;
var totalGems = 0;
var angryHit = 0;
var timeLeft = 60;
var numberOfCells = [16, 25, 36]
var setCells;
//High scores for different levels
var easyName = "ehighScore";
localStorage.getItem("ehighScore") || 0;
var normName = "nhighScore";
localStorage.getItem("nhighScore") || 0;
var exName = "exhighScore";
localStorage.getItem("exhighScore") || 0;
//Score benchmarks for different ending messages; varies with difficulty level 
var easyRange = [225, 325, 5]
var normalRange = [150, 250, 5]
var expertRange = [115, 215, 10]


function drawBoard (){
    //Verify that radio button is checked
    if(document.querySelector('input[name="difficultyLevel"]:checked') == null) {
        alert("Please select difficulty level!");
    }
    else {
        //Remove start display; show game display
        startDisplay.classList.remove('show');
        gameDisplay.classList.add('show');
        theme.currentTime = 0;
        theme.loop = true; 
        theme.volume = 0.5;
        theme.play();
        //Draw grid according to difficulty level chosen
        if (selection[0].checked){
                grid.classList.add('easy');
                difficulty = 'easy';
                setCells = numberOfCells[0];
                cellClass = 'cell sm';
                lives = 10;
            }
        else if (selection[1].checked){
            grid.classList.add('normal');
            difficulty = 'normal'
            setCells = numberOfCells[1];
            cellClass = 'cell md';
            lives = 8;
        }
        else if (selection[2].checked){
            grid.classList.add('expert');
            difficulty = 'expert'
            setCells = numberOfCells[2];
            cellClass = 'cell';
            lives = 6;
        }
        for (var i = 0; i < setCells; i++){
            var newCell = document.createElement('div');
            newCell.setAttribute('class', cellClass);
            grid.appendChild(newCell);
            cells = document.querySelectorAll('.cell');
        }
        numLives.textContent = lives;
        newGame();
    }
}

function newGame () {
    //start countdown
    countDown();
    //reset display
    scoreDisplay.textContent = score;
    gemDisplay.textContent = gems;
    //run game
    timesUp = false;
    //run slime spawn functions with different intervals depending on difficulty
    if (difficulty == 'easy'){
        popSlimes('slime', 1000, 1200);
        popSlimes('sad', 1000, 1200);
        angrySlimes(10000);
        getGems(3000);
    } else if (difficulty == 'normal'){
        popSlimes('slime', 800, 1000);
        popSlimes('sad', 800, 1000);
        angrySlimes(10000);
        getGems(4000);
    } else if (difficulty =='expert'){
        popSlimes('slime', 700, 900);
        popSlimes('sad', 700, 900);
        angrySlimes(5000);
        getGems(5000);
    }
}



/*----------Helper Functions----------*/

function showInstructions (){
    startDisplay.classList.remove('show');
    instructionDisplay.classList.add('show');
}

function backToMenu (){
    instructionDisplay.classList.remove('show');
    startDisplay.classList.add('show');
}

function countDown (){
    var interval = setInterval (function () {
         if (timeLeft <= 0 || lives < 1){
            clearInterval(interval);
            timesUp = true;
            endGame();
         }
         secondsLeft.textContent = timeLeft;
         timeLeft--;
     }, 1000)
 }
 

function randomCell (cells) {
    //Choose randomCell for animal to pop up in
    var index = Math.floor(Math.random() * cells.length)
    var cell = cells[index];
    //Check that cell doesn't already contain a sprite
    if (cell.classList.contains('slime' || 'sad' || 'angry' || 'gem')){
        randomCell(cells);
    }
    return cell;
}

function randomInterval (min, max) {
    //set random duration for how long sprite stays popped up
    return Math.floor(Math.random() * (max-min+1) + min);
}

//Make slimes appear
function popSlimes (type, minInt, maxInt){
    var time = randomInterval(minInt, maxInt);
    var position = randomCell(cells);
    position.classList.add(type);
    position.addEventListener('mousedown', hitEm);
    //remove slime & eventlistener after interval; continue making slimes if time remains
    setTimeout (function(){
        position.classList.remove(type);
        position.removeEventListener('mousedown', hitEm)
        if (!timesUp){
            popSlimes(type,minInt, maxInt);
        }
    }, time) 
}

//Make gems appear
function getGems(spawnRate){
    var gemInterval = setInterval (function(){
    var altPosition = randomCell(cells);    
    altPosition.classList.add('gem');
    altPosition.addEventListener('mousedown', addGems);
    if (timeLeft <= 0 || lives <= 0){
        clearInterval(gemInterval);
        endGame(); 
    }
    setTimeout(function(){
    altPosition.classList.remove('gem');
    altPosition.removeEventListener('mousedown', addGems)
    }, 1000)
    }, spawnRate) 
 }

//Add gems to total when clicked
function addGems (){
    if (this.classList.contains('gem')){
        gem.play();
        gem.currentTime = 0;
        gems += 1;
        totalGems += 1;
        gemDisplay.textContent = gems;
        this.classList.remove('gem');
        this.removeEventListener('mousedown', addGems);
    }
}

//Check if player has enough gems to hit angry slimes
function checkGems (cell){
    if (gems >= 3){
        cell.addEventListener('mousedown', hitAngry)
        console.log('Angry slimes can now be hit!')
    } 
}

//Deduct 3 gems for every hit; add 25 to score
function hitAngry (){
    if (this.classList.contains('angry') & gems >= 3){
        gems -= 3;
        gemDisplay.textContent = gems;
        console.log('gems traded for chance to hit angry slime!')
        angryBoinked.play();
        angryBoinked.currentTime = 0;
        score += 25;
        scoreDisplay.textContent = score;
        angryHit += 1
        console.log('you hit an angry slime!')
        this.classList.remove('angry');
        this.removeEventListener('mousedown', hitAngry)
    } 
}

//Make angry slime appear
function angrySlimes(spawnRate){
    var angry = setInterval (function(){
    var altPosition = randomCell(cells);
    altPosition.classList.add('angry');
    checkGems(altPosition);
    console.log('added angry slime!');
    if (timeLeft <= 0 || lives <= 0){
        clearInterval(angry);
        endGame(); 
    }
    else if (timeLeft >= 40 && lives > 0){
        console.log('more than 10s left');
        angryAttack(100, 0.4);
    } 
    else if (timeLeft >= 20 && lives > 0){
        console.log('more than 5s left');
        angryAttack(200, 0.5);
    }
    else if (timeLeft > 0 && lives > 0){
        console.log('more than 0s left')
        angryAttack(300, 0.6);
    }
         setTimeout(function(){
             altPosition.classList.remove('angry');
         }, 1000)
     }, spawnRate) 
 }


//Calculate chances of angry slime successfully attacking 
function angryAttack (minScore, chance){
    if (score < minScore){
        if(Math.random() < 0.8){
            mauled.play();
            mauled.currentTime = 0;
            lives -= 1;
            numLives.textContent = lives;
            console.log('less than minScore; hit!');
        }
        else {
            console.log('less than minScore; attack missed!');
        }
    } 
    else {
        if(Math.random() < chance){
            mauled.play();
            mauled.currentTime = 0;
            lives -= 1;
            numLives.textContent = lives;
            console.log('more than minScore; hit!');
        }
        else{
            console.log('more than minScore; attack missed!');
        }
    }
}

//Clicking a slime adds to score or deducts a life
function hitEm (){
    if (this.classList.contains('slime')){
        boinked.play();
        boinked.currentTime = 0;
        score += 10;
        scoreDisplay.textContent = score;
        this.classList.remove('slime');
    } else {
        console.log('penalty!');
        bullied.play();
        bullied.currentTime = 0;
        lives -= 1;
        if (lives < 1){
            timesUp = true;
            numLives.textContent = 0;
            endGame();
        }
        numLives.textContent = lives;
        this.classList.remove('sad');
    }
    this.removeEventListener('mousedown', hitEm);
}


//Generate end text
function endingText (array){
    var endText;
    if (score < array[0]){
        endText = 'Most of your slimes escaped...maybe find a new line of work?';
    } else if (score >= array[0] & score < array[1]){
        endText = "You herded most of your slimes back--all in a day's work!";
    } else if (score >= array[1]){
        endText = "No slime is escaping on your watch!";
    } else if (score >= array[1] && angryHit > array[2]){
        endText = "You're one tough cookie--those wild slimes ain't seen nothin' yet!";
    }
    return endText;
}

//Check for high score
function recordScores (name){
    if (score > localStorage.getItem(name)) {
        localStorage.setItem(name, score);
        newHighScore.textContent = `You've set a new record score of ${localStorage.getItem(name)}!`;
    }
    else if (score < localStorage.getItem(name)) {
        newHighScore.textContent = `The record score to beat is: ${localStorage.getItem(name)}`;
    }  
}


//Clear game display; show ending display
function endGame (){
    var endingMsg;
    if (difficulty == 'easy'){
        endingMsg = endingText(easyRange);
        recordScores(easyName);
    } else if (difficulty == 'normal'){
        endingMsg = endingText(normalRange);
        recordScores(normName);
    } else {
        endingMsg = endingText(expertRange);
        recordScores(exName);
    }
    gameDisplay.classList.remove('show');
    endDisplay.classList.add('show');
    endMessage.innerHTML = `${endingMsg} <br><br><br> Score: ${score} <br><br> Gems collected: ${totalGems} <br><br> Wild slimes boinked: ${angryHit}`;
}

//Reset game state and go back to menu
function restartGame (){
    theme.pause();
    while (grid.firstChild) {
        grid.removeChild(grid.firstChild)
      }
    grid.removeAttribute('class');
    score = 0;
    totalGems = 0;
    gems = 0;
    gemDisplay.textContent = gems;
    angryHit = 0;
    timeLeft = 60;
    endDisplay.classList.remove('show');
    startDisplay.classList.add('show');
}

