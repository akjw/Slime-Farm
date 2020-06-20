var cells = document.querySelectorAll('.cell');
var moles = document.querySelectorAll('.mole')
var scoreboard = document.querySelector('.scoreboard');
var lastSelectedCell;
var timesUp = true;
var score = 0;


newGame();

function newGame () {
    //reset state
    cells.forEach(cell => {
        //remove mole class
        cell.classList.remove('mole');
        //remove eventListeners
        cell.removeEventListener('mouseup', hitEm);
    });
    scoreboard.textContent = 'Score: ';
    //run 
    timesUp = false;
    molePop();
    setTimeout (function(){
        timesUp = true;
    }, 30000)

}

function randomCell (cells) {
    //Choose randomCell for mole to pop up in
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
    //set random duration for how long a mole stays popped up
    return Math.round(Math.random() * (max-min) + min);
}

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

function hitEm (event){
    score += 10;
    scoreboard.textContent = 'Score: ' + score;
    this.classList.remove('mole');
    this.removeEventListener('mousedown', hitEm);
}
