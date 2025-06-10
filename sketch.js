let player;
let obstacles = [];
let crops = [];
let timeLeft = 60;
let gameOver = false;
let gameWon = false;

function setup() {
  createCanvas(800, 600);

  // Inicializa o jogador
  player = new Player(50, height - 80);

  // Inicializa obstáculos
  for (let i = 0; i < 5; i++) {
    obstacles.push(new Obstacle(random(width), random(100, height - 100)));
  }

  // Inicializa os cultivos (áreas de semeadura, rega e colheita)
  crops.push(new Crop(random(200, width - 100), height - 120, 'semear'));
  crops.push(new Crop(random(200, width - 100), height - 120, 'regar'));
  crops.push(new Crop(random(200, width - 100), height - 120, 'colher'));

  textSize(18);
  textAlign(CENTER, CENTER);
}

function draw() {
  background(135, 206, 235); // Céu claro

  if (gameOver) {
    fill(0);
    textSize(30);
    text("Jogo Finalizado! Você não completou a tarefa a tempo!", width / 2, height / 2);
    return;
  }

  if (gameWon) {
    fill(0);
    textSize(30);
    text("Parabéns! Você conseguiu concluir o jogo!", width / 2, height / 2);
    return;
  }

  // Desenha obstáculos e o jogador
  player.update();
  player.display();

  // Desenha obstáculos
  for (let obs of obstacles) {
    obs.update();
    obs.display();
    if (obs.hits(player)) {
      gameOver = true;
    }
  }

  // Desenha cultivos e verifica as interações
  let remainingCrops = crops.length;
  for (let i = crops.length - 1; i >= 0; i--) {
    let crop = crops[i];
    crop.display();
    if (crop.isDone) {
      fill(0, 255, 0);
      text(crop.type + " feito!", crop.x, crop.y - 20);
      // Remove a bolinha da tela após a ação ser realizada
      crops.splice(i, 1);  // Remove a bolinha do array
    }
  }

  // Verifica se o jogador concluiu todas as tarefas
  if (remainingCrops === 0 && timeLeft > 0) {
    gameWon = true;
  }

  // Cronômetro
  fill(0);
  text("Tempo Restante: " + timeLeft.toFixed(1) + "s", width - 120, 30);

  // Atualiza o cronômetro
  if (timeLeft > 0) {
    timeLeft -= deltaTime / 1000;
  } else {
    gameOver = true;
  }
}

// Classe para o jogador
class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 60;
    this.speed = 3;
  }

  update() {
    if (keyIsDown(LEFT_ARROW)) {
      this.x -= this.speed;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      this.x += this.speed;
    }
    if (keyIsDown(UP_ARROW)) {
      this.y -= this.speed;
    }
    if (keyIsDown(DOWN_ARROW)) {
      this.y += this.speed;
    }
  }

  display() {
    fill(0, 255, 0);
    rect(this.x, this.y, this.width, this.height);
  }
}

// Classe para os obstáculos
class Obstacle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 40;
    this.speed = 2;
  }

  update() {
    this.x -= this.speed;
    if (this.x < 0) {
      this.x = width;
      this.y = random(100, height - 100);
    }
  }

  display() {
    fill(139, 69, 19);
    rect(this.x, this.y, this.width, this.height);
  }

  hits(player) {
    return (this.x < player.x + player.width &&
            this.x + this.width > player.x &&
            this.y < player.y + player.height &&
            this.y + this.height > player.y);
  }
}

class Crop {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;  // 'semear', 'regar', 'colher'
    this.isDone = false;
  }

  display() {
    fill(255, 165, 0);
    ellipse(this.x, this.y, 40, 40);

    // Verifica se o jogador está na área e se a ação foi feita
    let distance = dist(player.x, player.y, this.x, this.y);
    if (distance < 50 && !this.isDone) {
      // Mostra a distância de depuração
      fill(0);
      textSize(14);
      text("Distância: " + distance.toFixed(2), this.x, this.y - 20);

      // Verifica se a tecla correspondente foi pressionada
      if (keyIsPressed) {
        // Depuração: qual tecla foi pressionada?
        text("Tecla: " + key, this.x, this.y - 40);

        if (key.toLowerCase() === this.type.charAt(0).toLowerCase()) {
          this.isDone = true;  // Marca como feito
        }
      }
    }
  }
}
