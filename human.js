const cells = document.querySelectorAll(".cell");
const statusText = document.querySelector(".statusText");
const restartBtn = document.querySelector("#restartBt");
const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
let options = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = 'X';
let running = false;

initializeGame();

function initializeGame(){
    cells.forEach(cell => cell.addEventListener("click", cellClicked));
    statusText.innerHTML = `${currentPlayer}'s turn`;
    running = true;
}
function cellClicked(){
    const cellIndex = this.getAttribute("cellIndex");

    if(options[cellIndex] != "" || !running){
        return;
    }

    updateCell(this, cellIndex);
    checkWinner();
}
function updateCell(cell, index){
    options[index] = currentPlayer;
    cell.innerHTML = currentPlayer;
}
function changePlayer(){
    currentPlayer = (currentPlayer == 'X' ) ? '0' : 'X';
    statusText.innerHTML = `${currentPlayer}'s turn`;
}
let count = 0;
let lose = 0;
let tie = 0;
function checkWinner() {
    let roundWon = false;
    for(let i = 0; i < winConditions.length; i++){
        const condition = winConditions[i];
        const cellA = options[condition[0]];
        const cellB = options[condition[1]];
        const cellC = options[condition[2]];

        if(cellA == "" || cellB == "" || cellC == ""){
            continue;
        }
        if(cellA == cellB && cellB == cellC){
            roundWon = true;
            break;
        }
    };
    if(roundWon){
        statusText.textContent = `${currentPlayer} wins!`;
        let text1 = document.querySelector('.text1');
        text1.innerText = `${currentPlayer} wins!`
        running = false;
        document.querySelector(".endgame").style.display = "block";


        if (text1.innerText === `X wins!`) {
	        count += 1
            document.getElementById("yWin").innerHTML = count;            
        } else if (text1.innerText !== `X wins!`) {
            
            lose += 1;
            document.getElementById("lose").innerHTML = lose;

        } 
    } else if (!options.includes("")) {

        let text1 = document.querySelector('.text1');
        text1.innerText = `THE ROUND TIE`
        document.querySelector(".endgame").style.display = "block";
        running = false;
        if (text1.innerText === `THE ROUND TIE`) {
            tie += 1;
            document.getElementById("tie").innerHTML = tie;

        }
    }
    else{
        changePlayer();
    }
}
function restartBtGame() {
    document.getElementById("restartBt").addEventListener('click', () => {
        let fuck = document.querySelector(".restartGame");
        fuck.style.display = "block"
        document.querySelector(".restartYes").addEventListener("click", () => {
            fuck.style.display = "none";
            currentPlayer = "X";
            options = ["", "", "", "", "", "", "", "", ""];
            statusText.textContent = `${currentPlayer}'s turn`;
            cells.forEach(cell => cell.textContent = "");
            running = true;
        }) 
        document.querySelector(".endgame").style.display = "none";
        document.querySelector(".cancelRestart").addEventListener('click', () => {
            fuck.style.display = "none";
        })
    })
}
restartBtGame()

function nextRund() {
    document.querySelector(".nextRound").addEventListener("click", () => {
        document.querySelector(".endgame").style.display = "none";
        cells.forEach(cell => cell.textContent = "");
        currentPlayer = "X";
        options = ["", "", "", "", "", "", "", "", ""];
        statusText.textContent = `${currentPlayer}'s turn`;
        cells.forEach(cell => cell.textContent = "");
        running = true;
    })
}
nextRund();