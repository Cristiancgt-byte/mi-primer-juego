const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const restartBtn = document.getElementById("restartBtn");

canvas.width = 400;
canvas.height = 600;

// Variables iniciales
let birdX, birdY, birdRadius, gravity, lift, velocity;
let pipes, pipeWidth, pipeGap, pipeSpeed, frame;
let score, gameOver;

function initGame() {
  birdX = 50;
  birdY = canvas.height / 2;
  birdRadius = 15;
  gravity = 0.5;
  lift = -8;
  velocity = 0;

  pipes = [];
  pipeWidth = 60;
  pipeGap = 150;
  pipeSpeed = 2;
  frame = 0;

  score = 0;
  gameOver = false;

  restartBtn.style.display = "none"; // ocultar botón
  loop();
}

function jump() {
  velocity = 0;
  velocity += lift;
}

// Eventos
document.addEventListener("keydown", e => {
  if (e.code === "Space" && !gameOver) jump();
});
canvas.addEventListener("click", () => {
  if (!gameOver) jump();
});

restartBtn.addEventListener("click", initGame);

function drawBird() {
  ctx.fillStyle = "yellow";
  ctx.beginPath();
  ctx.arc(birdX, birdY, birdRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}

function drawPipes() {
  ctx.fillStyle = "green";
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
    ctx.fillRect(pipe.x, pipe.top + pipeGap, pipeWidth, canvas.height);
  });
}

function updatePipes() {
  if (frame % 100 === 0) {
    let top = Math.random() * (canvas.height / 2);
    pipes.push({ x: canvas.width, top: top });
  }

  pipes.forEach(pipe => {
    pipe.x -= pipeSpeed;

    // Colisión
    if (
      birdX + birdRadius > pipe.x &&
      birdX - birdRadius < pipe.x + pipeWidth &&
      (birdY - birdRadius < pipe.top ||
        birdY + birdRadius > pipe.top + pipeGap)
    ) {
      gameOver = true;
    }

    // Punto
    if (pipe.x + pipeWidth === birdX) score++;
  });

  pipes = pipes.filter(pipe => pipe.x + pipeWidth > 0);
}

function drawScore() {
  ctx.fillStyle = "black";
  ctx.font = "24px Arial";
  ctx.fillText("Puntos: " + score, 10, 30);
}

function loop() {
  if (gameOver) {
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "36px Arial";
    ctx.fillText("Game Over", canvas.width / 2 - 90, canvas.height / 2);
    ctx.font = "24px Arial";
    ctx.fillText("Puntos: " + score, canvas.width / 2 - 40, canvas.height / 2 + 40);

    restartBtn.style.display = "inline-block"; // mostrar botón

    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Física del pájaro
  velocity += gravity;
  birdY += velocity;

  if (birdY + birdRadius > canvas.height || birdY - birdRadius < 0) {
    gameOver = true;
  }

  drawBird();

  // Tubos
  updatePipes();
  drawPipes();

  // Puntuación
  drawScore();

  frame++;
  requestAnimationFrame(loop);
}

// Iniciar juego
initGame();