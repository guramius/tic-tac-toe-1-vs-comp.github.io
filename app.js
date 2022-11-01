const imageee = document.getElementById("imgX")
imageee.src = "./images/X.png";

var origBoard;
const aiPlayer = `
					<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path fill-rule="evenodd" clip-rule="evenodd" d="M64 32C64 14.3269 49.6731 0 32 0C14.3269 0 0 14.3269 0 32C0 49.6731 14.3269 64 32 64C49.6731 64 64 49.6731 64 32ZM18.963 32C18.963 24.7998 24.7998 18.963 32 18.963C39.2002 18.963 45.037 24.7998 45.037 32C45.037 39.2002 39.2002 45.037 32 45.037C24.7998 45.037 18.963 39.2002 18.963 32Z" fill="#F2B137"/>
					</svg>
				`;
const huPlayer = `
					<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path fill-rule="evenodd" clip-rule="evenodd" d="M53.2406 1.14742C52.0691 -0.0241513 50.1696 -0.0241497 48.998 1.14742L32 18.1454L15.002 1.14742C13.8304 -0.0241506 11.9309 -0.0241496 10.7594 1.14742L1.14742 10.7594C-0.0241499 11.9309 -0.0241481 13.8304 1.14742 15.002L18.1454 32L1.14742 48.998C-0.0241506 50.1696 -0.0241496 52.0691 1.14742 53.2406L10.7594 62.8526C11.9309 64.0241 13.8304 64.0241 15.002 62.8526L32 45.8546L48.998 62.8526C50.1696 64.0242 52.0691 64.0241 53.2406 62.8526L62.8526 53.2406C64.0242 52.0691 64.0241 50.1696 62.8526 48.998L45.8546 32L62.8526 15.002C64.0242 13.8304 64.0241 11.9309 62.8526 10.7594L53.2406 1.14742Z" fill="#31C3BD"/>
					</svg>
				`;
const statusText = document.querySelector(".statusText");
let newGame = document.querySelector('.newGame');

const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]

const cells = document.querySelectorAll('.cell');



function startGame() {
    document.querySelector(".endgame").style.display = "none";
	origBoard = Array.from(Array(9).keys());
	for (var i = 0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].addEventListener('click', turnClick, false);
	}
	newGame.addEventListener('click', () => {
		document.querySelector('.containerBlur').style.display = 'none';
	})
}
startGame();
function chusePlayer() {
	let xMark = document.querySelector('.xMark')
	let oMark = document.querySelector('.oMark');
	xMark.addEventListener('click', () => {
		xMark.classList.add('active');
		oMark.style.backgroundColor = 'rgba(168, 191, 201, 0)';
	})
	oMark.addEventListener('click', () => {
		oMark.style.backgroundColor = 'rgba(168, 191, 201, 1)';
		xMark.style.backgroundColor = 'rgba(168, 191, 201, 0)';		
	})
		
}
 chusePlayer()
function turnClick(square) {
	if (typeof origBoard[square.target.id] == 'number') {
		turn(square.target.id, huPlayer)
		statusText.innerHTML = huPlayer;
		if (!checkTie()) turn(bestSpot(), aiPlayer);
	}
}

function turn(squareId, player) {
	origBoard[squareId] = player;
	document.getElementById(squareId).innerHTML = player;
	let gameWon = checkWin(origBoard, player)
	if (gameWon) {
		gameOver(gameWon)
	}	
}

function checkWin(board, player) {
	let plays = board.reduce((a, e, i) => 
		(e === player) ? a.concat(i) : a, []);
	let gameWon = null;
	for (let [index, win] of winCombos.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
}

let count = 0;
	
function gameOver(gameWon) {
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false);
	}
	count += 1
	document.getElementById("lose").innerHTML = count;
	declareWinner(gameWon.player == huPlayer ? "You win" : "You lose");
}
let win = 0;
function declareWinner(who) {
    document.querySelector(".endgame").style.display = "block";
	document.querySelector(".endgame .text1").innerText = who;
	// if (gameWon.player === huPlayer) {
	// 	win += 1;
	// 	document.getElementById('yWin') = win;
	// }
}

function emptySquares() {
    return origBoard.filter(s => typeof s === 'number');
}

function bestSpot() {
    return minimax(origBoard, aiPlayer).index;
}
let tie = 0;
function checkTie() {
    if (emptySquares().length === 0) {
        for (var i = 0; i < cells.length; i++) {
            cells[i].removeEventListener('click', turnClick, false);
		}
		tie += 1;
		document.getElementById('tie').innerHTML = tie;
        declareWinner("ROUND TIED");
        return true;
    }
    return false;
}

function minimax(newBoard, player) {
	var availSpots = emptySquares();

	if (checkWin(newBoard, huPlayer)) {
		return {score: -10};
	} else if (checkWin(newBoard, aiPlayer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == aiPlayer) {
			var result = minimax(newBoard, huPlayer);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === aiPlayer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}

function restartBtGame() {
    document.getElementById("restartBt").addEventListener('click', () => {

        let fuck = document.querySelector(".restartGame");
        fuck.style.display = "block"
        document.querySelector(".restartYes").addEventListener("click", () => {
            fuck.style.display = "none";}) 
            document.querySelector(".cancelRestart").addEventListener('click', () => {
                fuck.style.display = "none";
            })
        
    })
}
restartBtGame()

