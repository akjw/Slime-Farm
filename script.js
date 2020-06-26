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
var endMessage = document.querySelector('.outcome-message');
var restartButton = document.querySelector('#restart');
restartButton.addEventListener('click', restartGame);

/*----------Game Display----------*/
var gameDisplay = document.querySelector('.game-display');
var grid = document.querySelector('#grid');
var cells;
var moles = document.querySelectorAll('.mole')
var gemDisplay = document.querySelector('#gemNum');
var scoreDisplay = document.querySelector('#scoreNum');
var secondsLeft = document.querySelector('#secondsLeft');
var numLives = document.querySelector('#numLives');



/*----------Game Variables----------*/
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


function drawBoard (){
    //Verify that radio button is checked
    if(document.querySelector('input[name="difficultyLevel"]:checked') == null) {
        alert("Please select difficulty level!");
    }
    else {
        //Remove start display; show game display
        startDisplay.classList.remove('show');
        gameDisplay.classList.add('show');
        //Draw grid according to difficulty level chosen
        if (selection[0].checked){
                grid.classList.add('easy');
                setCells = numberOfCells[0];
                lives = 10;
            }
        else if (selection[1].checked){
            grid.classList.add('normal');
            setCells = numberOfCells[1];
            lives = 8;
        }
        else if (selection[2].checked){
            grid.classList.add('expert');
            setCells = numberOfCells[2];
            lives = 6;
        }
        for (var i = 0; i < setCells; i++){
            var newCell = document.createElement('div');
            newCell.classList.add('cell');
            grid.appendChild(newCell);
            cells = document.querySelectorAll('.cell');
        }
        numLives.innerHTML = lives;
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
    if (grid.classList.contains('easy')){
        popSlimes('slime', 800, 1200);
        popSlimes('sad', 800, 1200);
        angrySlimes(10000);
        getGems(3000);
    } else if (grid.classList.contains('normal')){
        popSlimes('slime', 700, 1000);
        popSlimes('sad', 700, 1000);
        angrySlimes(10000);
        getGems(4000);
    } else if (grid.classList.contains('expert')){
        popSlimes('slime', 600, 900);
        popSlimes('sad', 600, 900);
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
         secondsLeft.innerHTML = timeLeft;
         timeLeft--;
     }, 1000)
 }
 

function randomCell (cells) {
    //Choose randomCell for animal to pop up in
    var index = Math.floor(Math.random() * cells.length)
    var cell = cells[index];
    //If new cell is the same as previous cell, pick another cell
    if (cell === lastSelectedCell){
        randomCell(cells);
    }
    lastSelectedCell = cell;
    return cell;
}

function randomInterval (min, max) {
    //set random duration for how long animal stays popped up
    return Math.round(Math.random() * (max-min) + min);
}

//Make slimes appear
function popSlimes (type, minInt, maxInt){
    var time = randomInterval(minInt, maxInt);
    var position = randomCell(cells);
    position.classList.add(type);
    position.addEventListener('mousedown', hitEm);
    //remove slime & eventlistener after interval; continue making moles if time remains
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
        if (altPosition.classList.contains('slime') || altPosition.classList.contains('sad') || altPosition.classList.contains('angry')){
            return;
        }
        else {
            altPosition.classList.add('gem');
            checkGems(altPosition);
            altPosition.addEventListener('mousedown', addGems);
            if (timeLeft <= 0 || lives <= 0){
                clearInterval(gemInterval);
                endGame(); 
            }
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
        gems += 1;
        totalGems += 1;
        gemDisplay.innerHTML = gems;
        this.classList.remove('gem');
        this.removeEventListener('mousedown', addGems);
    }
}

//Check if player has enough gems to hit angry slimes
function checkGems (cell){
    if (gems >= 3){
        cell.addEventListener('click', hitAngry)
        console.log('Angry slimes can now be hit!')
    } else {
        return;
    }
}

//Deduct 3 gems for every hit; add 20 to score
function hitAngry (){
    if (this.classList.contains('angry') & gems >= 3){
        gems -= 3;
        gemDisplay.innerHTML = gems;
        console.log('gems traded for chance to hit angry slime!')
        score += 20;
        scoreDisplay.innerHTML = score;
        angryHit += 1
        console.log('you hit an angry slime!')
        this.classList.remove('angry');
        this.removeEventListener('click', hitAngry)
    } 
}

//Make angry slime appear
function angrySlimes(spawnRate){
   var angry = setInterval (function(){
        var altPosition = randomCell(cells);
        if (altPosition.classList.contains('slime') || altPosition.classList.contains('sad') || altPosition.classList.contains('gem')){
            return;
        }
        else {
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
            lives -= 1;
            numLives.innerHTML = lives;
            console.log('less than minScore; hit!');
        }
        else {
            console.log('less than minScore; attack missed!');
        }
    } 
    else {
        if(Math.random() < chance){
            lives -= 1;
            numLives.innerHTML = lives;
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
        score += 10;
        scoreDisplay.innerHTML = score;
        this.classList.remove('slime');
    } else {
        console.log('penalty!');
        lives -= 1;
        if (lives < 1){
            timesUp = true;
            numLives.innerHTML = 0;
            endGame();
        }
        numLives.innerHTML = lives;
        this.classList.remove('sad');
    }
    this.removeEventListener('mousedown', hitEm);
}

//Clear game display; show ending display
function endGame (){
    gameDisplay.classList.remove('show');
    endDisplay.classList.add('show');
    endMessage.innerText = `Thank you for playing! \n\n Score: ${score} \n\n Lives: ${lives <= 0 ? 0 : lives} \n\n Gems collected: ${totalGems} \n\n Wild slimes boinked: ${angryHit}`;
}

//Reset game state and go back to menu
function restartGame (){
    endDisplay.classList.remove('show');
    startDisplay.classList.add('show');
    while (grid.firstChild) {
        grid.removeChild(grid.firstChild)
      }
    grid.removeAttribute('class');
    score = 0;
    totalGems = 0;
    gems = 0;
    gemDisplay.innerHTML = gems;
    angryHit = 0;
    timeLeft = 60;
}

function autoResizeDiv(){
    document.getElementsByClassName('game-display').style.height = window.innerHeight +'px';
}

window.onresize = autoResizeDiv;
autoResizeDiv();