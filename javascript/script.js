const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

const players = document.querySelectorAll(".player");
const char1 = document.querySelector(".char1");
const char2 = document.querySelector(".char2");
const button = document.querySelector(".start-game");
const restart = document.querySelector(".restart-game");
const chooseHeading = document.querySelector(".choose-player");
let score = document.querySelector(".ss span");
let highScore = document.querySelector(".hs span");
let scoreNum = 0;
let highScoreNum = 0;
let totalFrames = 0;
let fishArr = [];
let animationID = null;
let animationStopped = false;

const greyCat = document.querySelector(".grey-cat");
const orangeCat = document.querySelector(".orange-cat");
const orangeFishImg = document.querySelector(".fish");
const deadFishImg = document.querySelector(".dead-fish");
const meowSound = new Audio();
meowSound.src = "/sounds/Cat-sound.mp3";
const angrySound = new Audio();
angrySound.src = "/sounds/Angry-cat-sound.mp3";
const bgImg = new Image();
bgImg.src = "/images/pink-bg1.png";

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

const fish = {
	image: orangeFishImg,
	x: Math.floor(Math.random() * canvas.width),
	y: 0,
	width: 70,
	height: 40,
	dy: 3,
};

const deadFish = {
	image: deadFishImg,
	x: Math.floor(Math.random() * canvas.width),
	y: 0,
	width: 60,
	height: 40,
	dy: 4,
};

class DrawImage {
	constructor(image, x, y, width, height) {
		this.image = image;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	draw() {
		ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
	}
}

class DrawFish extends DrawImage {
	constructor(image, x, y, width, height, dy, alive) {
		super(image, x, y, width, height);

		this.dy = dy;
		this.alive = alive;
	}

	createFish() {
		ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
	}

	moveFish() {
		this.y += this.dy;
	}
}

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

function renderPlayer() {
	players.forEach((player) => {
		if (
			player.classList.contains("char1") &&
			player.classList.contains("active")
		) {
			const createGC = new DrawImage(
				player1.image,
				player1.x,
				player1.y,
				player1.width,
				player1.height
			);

			return createGC.draw();
		} else if (
			player.classList.contains("char2") &&
			player.classList.contains("active")
		) {
			const createOC = new DrawImage(
				player2.image,
				player2.x,
				player2.y,
				player2.width,
				player2.height
			);

			return createOC.draw();
		}
	});
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

function createFishArr() {
	if (totalFrames % 60 === 0) {
		fishArr.push(
			new DrawFish(
				fish.image,
				Math.floor(Math.random() * canvas.width),
				fish.y,
				fish.width,
				fish.height,
				fish.dy,
				true
			)
		);
	}

	if (totalFrames % 120 === 0) {
		fishArr.push(
			new DrawFish(
				deadFish.image,
				Math.floor(Math.random() * canvas.width),
				deadFish.y,
				deadFish.width,
				deadFish.height,
				deadFish.dy,
				false
			)
		);
	}
}

function addFish() {
	for (let i = fishArr.length - 1; i >= 0; i--) {
		fishArr[i].moveFish();

		if (fishArr[i].y > canvas.height) {
			fishArr.splice(i, 1);
		} else {
			fishArr[i].createFish();
		}

		if (fishArr[i].width < 0) {
			fishArr[i].x = 0;
		}

		if (fishArr[i].x + fishArr[i].width > canvas.width) {
			fishArr[i].x = canvas.width - fishArr[i].width;
		}
	}
}

function detectFish() {
	for (let i = 0; i < fishArr.length; i++) {
		if (
			fishArr[i].x < player1.x + player1.width &&
			fishArr[i].x + fishArr[i].width > player1.x &&
			fishArr[i].y < player1.y + player1.height &&
			fishArr[i].height + fishArr[i].y > player1.y
		) {
			if (fishArr[i].alive) {
				scoreNum += 1;
				score.innerHTML = scoreNum;
				console.log(score);
				fishArr.splice(i, 1);
				i--;
			} else {
				angrySound.play();
				fishArr.splice(i, 1);
				i--;

				clear();

				ctx.fillStyle = "#ffd6db";
				ctx.fillRect(0, 0, canvas.width, canvas.height);
				ctx.strokeStyle = "red";
				ctx.font = "50px Arial";
				ctx.textAlign = "center";
				ctx.strokeText("YOU LOST", canvas.width / 2, canvas.height / 1.9);

				endGame();
			}
		}
	}
}

function endGame() {
	// clear();
	animationStopped = true;
	highScore.innerHTML = scoreNum;
	score.innerHTML = 0;
	fishArr = [];
	player1.x = -100;
	player1.y = -100;
	player2.x = -100;
	player2.y = -100;
	cancelAnimationFrame(animationID);
}

function clear() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function startGame() {
	button.classList.add("disabled");
	button.disabled = true;
	if (totalFrames === 0) {
		meowSound.play();
	}

	totalFrames++;

	createFishArr();

	clear();

	ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

	addFish();

	detectFish();

	renderPlayer();

	newPos();

	if (!animationStopped) {
		animationID = requestAnimationFrame(startGame);
	}
}

function moveRight() {
	player1.dx = player1.speed;
	player2.dx = player2.speed;
	console.log("right");
}

function moveLeft() {
	player1.dx = -player1.speed;
	player2.dx = -player2.speed;
	console.log("left");
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
		chooseHeading.classList.add("error");
		chooseHeading.innerHTML = "CHOOSE YOUR PLAYER";
	} else {
		chooseHeading.classList.remove("error");
		chooseHeading.innerHTML = "Choose your player";
		startGame();
	}
});

restart.addEventListener("click", function () {
	player1.x = canvas.width / 2 - 50;
	player1.y = canvas.height / 2 + 230;
	player2.x = canvas.width / 2 - 50;
	player2.y = canvas.height / 2 + 230;
	// choosePlayer();
	// clear();
	score.innerHTML = scoreNum;
	animationStopped = false;
	totalFrames = 0;
	console.log("before startGame");
	startGame();
	console.log("after startGame");
});
