const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
CANVAS_SIZE = 500
SQUARES = 25
SQUARE_SIZE = CANVAS_SIZE / SQUARES
SPEED = 100

canvas.height = CANVAS_SIZE
canvas.width = CANVAS_SIZE

running = false

const resultP = document.getElementById("result")

class Tron {
	constructor(color, init_x, init_y, dir) {
		this.color = color;
		this.x = init_x;
		this.y = init_y;
		this.dir = dir;
		this.nextDir = dir;
		this.lost = false;
		occupiedSquares.add(this.x + (SQUARES + 10) * this.y)
		this.drawToCanvas()
	};

	drawToCanvas() {
		drawSquare(this.color, this.x, this.y)
	}

	makeMove() {
		switch(this.dir) {
			case ("u"):
				this.x -= 1;
				break;
			case("d"):
				this.x += 1;
				break;
			case("l"):
				this.y -= 1;
				break;
			case("r"):
				this.y += 1;
				break;
			default:
				throw "Illegal Direction!"
		}
	}

	checkCollision() {
		return occupiedSquares.has(this.x + (SQUARES + 10) * this.y) || outBounds(this.x, 0, SQUARES - 1) || outBounds(this.y, 0, SQUARES - 1)
	}

	move() {
		this.dir = this.nextDir
		this.makeMove()
		if(this.checkCollision()) {
			this.lost = true;
		}
		occupiedSquares.add(this.x + (SQUARES + 10) * this.y);
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
	if (event.keyCode == 32) { // Space
		main()
	} else if(event.keyCode == 74) { // J
        if(playerTwo) {
			if(playerTwo.dir != "r"){
				playerTwo.nextDir = "l";
			}
		}
    } else if(event.keyCode == 73) { // I
        if(playerTwo) {
			if(playerTwo.dir != "d"){
				playerTwo.nextDir = "u";
			}
		}
    } else if(event.keyCode == 76) { // L
        if(playerTwo) {
			if(playerTwo.dir != "l"){
				playerTwo.nextDir = "r";
			}
		}
    } else if(event.keyCode == 75) { // K
        if(playerTwo) {
			if(playerTwo.dir != "u"){
				playerTwo.nextDir = "d";
			}
		}
    } else if(event.keyCode == 87) { // W
        if(playerOne) {
			if(playerOne.dir != "d"){
				playerOne.nextDir = "u";
			}
		}
	} else if(event.keyCode == 68) { // D
		if(playerOne) {
			if(playerOne.dir != "l"){
				playerOne.nextDir = "r";
			}
		}
    } else if(event.keyCode == 83) { // S
        if(playerOne) {
			if(playerOne.dir != "u"){
				playerOne.nextDir = "d";
			}
		}
    } else if(event.keyCode == 65) { // A
        if(playerOne) {
			if(playerOne.dir != "r"){
				playerOne.nextDir = "l";
			}
		}
    }
});

main = async function(){
	if (running == false) {

		clearCanvas()
		resultP.innerHTML = ""

		occupiedSquares = new Set([])

		players = [];
		playerOne = new Tron("blue", 3, 3, "d");
		players[0] = playerOne;
		playerTwo = new Tron("red", SQUARES - 4, SQUARES - 4, "u");
		players[1] = playerTwo;

		running = true;
		while(running) {
			await sleep(SPEED);
			for (i = 0; i < players.length; i++) {
				players[i].move();
				if (players[i].lost) {
					running = false;
				} else {
					players[i].drawToCanvas();
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
