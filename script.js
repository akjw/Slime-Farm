/*----------Starting Display----------*/
var startDisplay = document.querySelector('.start-state');
var selection = document.querySelector('#difficultyLevel');
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
var scoreDisplay = document.querySelector('#scoreNum');
var secondsLeft = document.querySelector('#secondsLeft');
var numLives = document.querySelector('#numLives');



/*----------Game Variables----------*/
var lastSelectedCell;
var timesUp = true;
var score = 0;
var lives = 5;
var timeLeft = 15;
var numberOfCells = [16, 25, 36]
var setCells;


function drawBoard (){
    //Get difficulty level
    choice = selection.options[selection.selectedIndex].text
    //Remove start display; show game display
    startDisplay.classList.remove('show');
    gameDisplay.classList.add('show');
    if (choice === 'Easy'){
        grid.classList.add('easy');
        setCells = numberOfCells[0];
    } 
    else if (choice === 'Normal'){
        grid.classList.add('normal');
        setCells = numberOfCells[1];
    }
    else if (choice === 'Expert'){
        grid.classList.add('expert');
        setCells = numberOfCells[2];
    }
    for (var i = 0; i < setCells; i++){
        var newCell = document.createElement('div');
        //console.log('added cell');
        newCell.classList.add('cell');
        //console.log('added class of cell')
        grid.appendChild(newCell);
        //console.log('appended cell');
        cells = document.querySelectorAll('.cell');
        //console.log(cells.length);
    }
    newGame();
}

function newGame () {
    //start countdown
    countDown();
    //reset state
    scoreDisplay.textContent = score;
    //run 
    timesUp = false;
    molePop();
    distractPop();
    angryMole();
}



/*----------Helper Functions----------*/

function countDown (){
    var interval = setInterval (function () {
         if (timeLeft <= 0 || lives < 1){
            clearInterval(interval);
            timesUp = true;
            endGame();
            //  alert('Game over for countdown!');  
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

//Make moles appear
function molePop (){
    var time = randomInterval(500, 1100);
    var position = randomCell(cells);
    position.classList.add('mole');
    position.addEventListener('mousedown', hitEm);
    //remove mole & eventlistener after interval; continue making moles if time remains
    setTimeout (function(){
        position.classList.remove('mole');
        position.removeEventListener('mousedown', hitEm)
        if (!timesUp){
            molePop();
        }
    }, time) 
}

//Make distractor animal appear
function distractPop (){
    var altTime = randomInterval(500, 1100);
    var altPosition = randomCell(cells);
    altPosition.classList.add('noHit');
    altPosition.addEventListener('mousedown', hitEm);
    setTimeout (function(){
        altPosition.classList.remove('noHit');
        altPosition.removeEventListener('mousedown', hitEm)
        if (!timesUp){
            distractPop();
        }
    }, altTime) 
}

//Make angry mole appear
function angryMole(){
   var angry = setInterval (function(){
        var altPosition = randomCell(cells);
        if (altPosition.classList.contains('mole') || altPosition.classList.contains('noHit')){
            return;
        }
        else {
            altPosition.classList.add('angry');
            console.log('added angry mole!');
            if (timeLeft <= 0 || lives <= 0){
                clearInterval(angry);
                endGame();
                // alert('Game over for angrymole!');  
            }
            else if (timeLeft >= 10 && lives > 0){
                console.log('more than 10s left');
                moleAttack(30, 0.8);
            } 
            else if (timeLeft >= 5 && lives > 0){
                console.log('more than 5s left');
                moleAttack(40, 0.8);
            }
            else if (timeLeft > 0 && lives > 0){
                console.log('more than 0s left')
                moleAttack(50, 0.8);
            }
        }
        setTimeout(function(){
            altPosition.classList.remove('angry');
        }, 800)
    }, 5000) 
}

//Calculate chances of mole successfully attacking 
function moleAttack (minScore, chance){
    if (score < minScore){
        if(Math.random() < chance){
            lives -= 2;
            numLives.innerHTML = lives;
            console.log('less than minScore; hit!');
        }
        else {
            console.log('less than minScore; attack missed!');
        }
    } 
    else {
        if(Math.random() < 0.5){
            lives -= 1;
            numLives.innerHTML = lives;
            console.log('more than minScore; hit!');
        }
        else{
            console.log('more than minScore; attack missed!');
        }
    }
}

//Clicking moles adds to score or deducts a life
function hitEm (event){
    if (this.classList.contains('mole')){
        score += 10;
        scoreDisplay.innerHTML = score;
        this.classList.remove('mole');
    } else {
        console.log('penalty!');
        lives -= 1;
        if (lives < 1){
            timesUp = true;
            numLives.innerHTML = 0;
            endGame();
            //alert('Game over for hitem!');
        }
        numLives.innerHTML = lives;
        this.classList.remove('noHit');
    }
    this.removeEventListener('mousedown', hitEm);
}

function endGame (){
    gameDisplay.classList.remove('show');
    endDisplay.classList.add('show');
    endMessage.innerText = `Thank you for playing! \n\n Score: ${score} \n\n Lives: ${lives <= 0 ? 0 : lives}`;
}

function restartGame (){
    endDisplay.classList.remove('show');
    startDisplay.classList.add('show');
    while (grid.firstChild) {
        grid.removeChild(grid.firstChild)
      }
    grid.removeAttribute('class');
    score = 0;
    lives = 5;
    numLives.innerHTML = lives;
    timeLeft = 15;
}

function autoResizeDiv(){
    document.getElementsByClassName('game-display').style.height = window.innerHeight +'px';
}

window.onresize = autoResizeDiv;
autoResizeDiv();