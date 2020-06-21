var grid = document.querySelector('.grid');
var cells;
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
var choices = [36, 49, 64]
//remove once select options are added
var userChoice = choices[0];

drawBoard(userChoice);

function drawBoard (choice){
    for(var i = 0; i < choice; i++){
        if (choice === choices[0]){
            grid.classList.add('easy');
        } 
        else if (choice === choices[1]){
            grid.classList.add('normal');
        }
        else if (choice === choices[2]){
            grid.classList.add('expert');
        }
        var newCell = document.createElement('div');
        //console.log('added cell');
        newCell.classList.add('cell');
        //console.log('added class of cell')
        grid.appendChild(newCell);
        //console.log('appended cell');
        cells = document.querySelectorAll('.cell');
        //console.log(cells.length);
    }
}

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
    angryMole();
}

function countDown (){
    var interval = setInterval (function () {
         if (timeLeft <= 0 || lives < 1){
             clearInterval(interval);
             timesUp = true;
             alert('Game over for countdown!');  
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
    if (position.classList.contains('mole') || position.classList.contains('angry')) {
        return;
    } 
    else {
        position.classList.add('mole');
        position.addEventListener('mousedown', hitEm);
    }
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
                console.log('cleared interval');
                alert('Game over for angrymole!');  
            }
            else if (timeLeft >= 10 && lives > 0){
                console.log('more than 10s left');
                moleAttack(30, 0.8);
            } 
            else if (timeLeft >= 5 && lives > 0){
                console.log('more than 5s left');
                moleAttack(90, 0.8);
            }
            else if (timeLeft > 0 && lives > 0){
                console.log('more than 0s left')
                moleAttack(120, 0.8);
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
            console.log('attack missed!');
        }
    } 
    else {
        if(Math.random() < 0.5){
            lives -= 1;
            numLives.innerHTML = lives;
            console.log('more than minScore; hit!');
        }
        else{
            console.log('attack missed!');
        }
    }
}

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
            alert('Game over for hitem!');
        }
        numLives.innerHTML = lives;
        this.classList.remove('noHit');
    }
    this.removeEventListener('mousedown', hitEm);
}
