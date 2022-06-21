const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

const players = document.querySelectorAll(".player");
const char1 = document.querySelector(".char1");
const char2 = document.querySelector(".char2");
const button = document.querySelector(".btn");
const choose = document.querySelector(".choose-player");

const greyCat = document.querySelector(".grey-cat");
const orangeCat = document.querySelector(".orange-cat");
const fish = document.querySelector("#fish");
const deadFish = document.querySelector("#dead-fish");

const player1 = {
	image: greyCat,
	width: 100,
	height: 70,
	x: canvas.width / 2 - 50,
	y: canvas.height / 2 + 230,
	speed: 5,
	dx: 0,
	dy: 0,
};

const player2 = {
	image: orangeCat,
	width: 100,
	height: 70,
	x: canvas.width / 2 - 50,
	y: canvas.height / 2 + 230,
	speed: 5,
	dx: 0,
	dy: 0,
};

function choosePlayer() {
	players.forEach((player) => {
		player.addEventListener("click", function () {
			player.classList.add("active");

			if (player.classList.contains("char1")) {
				char2.classList.remove("active");
			} else if (player.classList.contains("char2")) {
				char1.classList.remove("active");
			}
		});
	});
}

choosePlayer();

function playerChosen() {
	players.forEach((player) => {
		if (
			player.classList.contains("char1") &&
			player.classList.contains("active")
		) {
			return ctx.drawImage(
				player1.image,
				player1.x,
				player1.y,
				player1.width,
				player1.height
			);
		} else if (
			player.classList.contains("char2") &&
			player.classList.contains("active")
		) {
			return ctx.drawImage(
				player2.image,
				player2.x,
				player2.y,
				player2.width,
				player2.height
			);
		}
	});
}

function clear() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function detectWalls() {
	// left wall
	if (player1.x < 0 || player2.x < 0) {
		player1.x = 0;
		player2.x = 0;
	}

	// right wall
	if (
		player1.x + player1.width > canvas.width ||
		player2.x + player2.width > canvas.width
	) {
		player1.x = canvas.width - player1.width;
		player2.x = canvas.width - player2.width;
	}
}

function newPos() {
	player1.x += player1.dx;
	player2.x += player2.dx;

	detectWalls();
}

function updateGame() {
	clear();

	playerChosen();

	newPos();

	requestAnimationFrame(updateGame);
}

function startGame() {
	updateGame();
}

function moveRight() {
	player1.dx = player1.speed;
	player2.dx = player2.speed;
}

function moveLeft() {
	player1.dx = -player1.speed;
	player2.dx = -player2.speed;
}

function keyDown(e) {
	if (e.key === "ArrowRight" || e.key === "Right") {
		moveRight();
	} else if (e.key === "ArrowLeft" || e.key === "Left") {
		moveLeft();
	}
}

function keyUp(e) {
	if (
		e.key === "ArrowRight" ||
		e.key === "Right" ||
		e.key === "ArrowLeft" ||
		e.key === "Left"
	) {
		player1.dx = 0;
		player2.dx = 0;
	}
}

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

button.addEventListener("click", function () {
	if (
		!char1.classList.contains("active") &&
		!char2.classList.contains("active")
	) {
		choose.classList.add("error");
		choose.innerHTML = "Choose your player!!!";
	} else {
		choose.classList.remove("error");
		choose.innerHTML = "Choose your player";

		return startGame();
	}
});

// ctx.drawImage(kitty, player.x, player.y, player.width, player.height);
