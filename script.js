var cells = document.querySelectorAll('.cell');
var moles = document.querySelectorAll('.mole')
var scoreDisplay = document.querySelector('#scoreNum');
var secondsLeft = document.querySelector('#secondsLeft');
var numLives = document.querySelector('#numLives');
var start = document.querySelector('.start');
start.addEventListener('click', newGame);
var lastSelectedCell;
var timesUp = true;
var score = 0;
var lives = 5;
var timeLeft = 15;

function newGame () {
    //start countdown
    countDown();
    //reset state
    cells.forEach(cell => {
        //remove mole class
        cell.classList.remove('mole');
        //remove eventListeners
        cell.removeEventListener('mouseup', hitEm);
    });
    scoreDisplay.textContent = '';
    //run 
    timesUp = false;
    molePop();
    distractPop();
}

function countDown (){
    var interval = setInterval (function () {
         if (timeLeft <= 0 || lives < 1){
             clearInterval(interval);
             timesUp = true;
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
    var time = randomInterval(200, 1000);
    var position = randomCell(cells);
    //apply mole class & eventlistener to cell from randomCell
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
    var altTime = randomInterval(900, 1000);
    var altPosition = randomCell(cells);
    //Terminate function if cell already has mole class
    if (altPosition.classList.contains('mole')) {
        return;
    } else  {
        altPosition.classList.add('noHit');
        altPosition.addEventListener('mousedown', hitEm);
    }
    setTimeout (function(){
        altPosition.classList.remove('noHit');
        altPosition.removeEventListener('mousedown', hitEm)
        if (!timesUp){
            distractPop();
        }
    }, altTime) 
}

function hitEm (event){
    if (this.classList.contains('mole')){
        score += 10;
        scoreDisplay.innerHTML = score;
        this.classList.remove('mole');
    } else {
        console.log('penalty!')
        lives -= 1;
        if (lives < 1){
            timesUp = true;
            numLives.innerHTML = 0;
            alert('Game over!');
        }
        numLives.innerHTML = lives;
        this.classList.remove('noHit');
    }
    this.removeEventListener('mousedown', hitEm);
}
