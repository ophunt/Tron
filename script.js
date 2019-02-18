const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
CANVAS_SIZE = 500;
SQUARES = 25;
SQUARE_SIZE = CANVAS_SIZE / SQUARES;
SPEED = 100;

canvas.height = CANVAS_SIZE;
canvas.width = CANVAS_SIZE;

running = false;

const resultP = document.getElementById("result");

class Tron {
	constructor(color, init_x, init_y, dir) {
		this.color = color;
		this.x = init_x;
		this.y = init_y;
		this.dir = dir;
		this.nextX = this.x;
		this.nextY = this.y;
		this.nextDir = dir;
		this.lost = false;
		squareOccupations[this.x][this.y] += 1;
		this.drawToCanvas();
	};

	drawToCanvas() {
		if (this.lost) {
			this.color = "black";
		}
		drawSquare(this.color, this.x, this.y);
	}

	preMakeMove() {
		switch(this.dir) {
			case ("u"):
				this.nextX -= 1;
				break;
			case("d"):
				this.nextX += 1;
				break;
			case("l"):
				this.nextY -= 1;
				break;
			case("r"):
				this.nextY += 1;
				break;
			default:
				throw "Illegal Direction!";
		}
	}

	makeMove() {
		this.x = this.nextX;
		this.y = this.nextY;
	}

	checkCollision() {
		return outBounds(this.x, 0, SQUARES - 1)
				|| outBounds(this.y, 0, SQUARES - 1)
				|| squareOccupations[this.x][this.y] > 1;
	}

	preMove() {
		this.dir = this.nextDir;
		this.preMakeMove();
		try {
			squareOccupations[this.nextX][this.nextY] += 1;
		} catch (error) {
			;
		}
	}

	move() {
		this.makeMove();
		if(this.checkCollision()) {
			this.lost = true;
		}
		this.drawToCanvas();
	}
}

drawRect = function(color, x, y, w, h) {
	ctx.fillStyle = color;
	ctx.fillRect(y, x, w, h);
}

drawSquare = function(color, x, y) {
	drawRect(color, x*SQUARE_SIZE, y*SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
}

clearCanvas = function() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

outBounds = function(n, bottom, top) {
	return n < bottom || n > top;
}

sleep = function(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

document.addEventListener('keydown', function(event) {
	switch (event.keyCode) {
		case 32: // Space
			main();
			break;
		case 74: // J
			if (typeof playerTwo !== "undefined") {
				if (playerTwo.dir != "r") {
					playerTwo.nextDir = "l";
				}
			}
			break;
		case 73: // I
			if (typeof playerTwo !== "undefined") {
				if (playerTwo.dir != "d") {
					playerTwo.nextDir = "u";
				}
			}
			break;
		case 76: // L
			if (typeof playerTwo !== "undefined") {
				if (playerTwo.dir != "l") {
					playerTwo.nextDir = "r";
				}
			}
			break;
		case 75: // K
			if (typeof playerTwo !== "undefined") {
				if (playerTwo.dir != "u") {
					playerTwo.nextDir = "d";
				}
			}
			break;
		case 87: // W
			if (typeof playerOne !== "undefined") {
				if (playerOne.dir != "d") {
					playerOne.nextDir = "u";
				}
			}
			break;
		case 68: // D
			if (typeof playerOne !== "undefined") {
				if (playerOne.dir != "l") {
					playerOne.nextDir = "r";
				}
			}
			break;
		case 83: // S
			if (typeof playerOne !== "undefined") {
				if(playerOne.dir != "u") {
					playerOne.nextDir = "d";
				}
			}
			break;
		case 65: // A
			if (typeof playerOne !== "undefined") {
				if(playerOne.dir != "r"){
					playerOne.nextDir = "l";
				}
			}
			break;
		default:
			break;
	}
});

main = async function(){
	if (running == false) {

		clearCanvas()
		resultP.innerHTML = ""

		squareOccupations = Array(SQUARES).fill().map(() => Array(SQUARES).fill(0));

		players = [];
		playerOne = new Tron("blue", 3, 3, "d");
		players[0] = playerOne;
		playerTwo = new Tron("red", SQUARES - 4, SQUARES - 4, "u");
		players[1] = playerTwo;

		running = true;
		while(running) {
			await sleep(SPEED);
			for (i = 0; i < players.length; i++) {
				players[i].preMove();
			}
			for (i = 0; i < players.length; i++) {
				players[i].move();
				if (players[i].lost) {
					running = false;
				}
			}
		}

		switch(playerOne.lost + 2 * playerTwo.lost) {
			case 1:
				resultP.innerHTML = "RED WINS!"
				break;
			case 2:
				resultP.innerHTML = "BLUE WINS!"
				break;
			case 3:
				resultP.innerHTML = "DRAW!"
				break;
			default:
				throw "Why did game end?"
		}
	}
}
