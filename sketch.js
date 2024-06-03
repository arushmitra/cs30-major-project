// Slither.io Rip Off
// Arush Mitra 
// Comp Sci 30 Major Project


let snake;
let foods = [];
let opponents = [];
let cameraX, cameraY;

function setup() {
  createCanvas(windowWidth, windowHeight);
  snake = new SlitherSnake(width / 2, height / 2);

  cameraX = snake.x;
  cameraY = snake.y;

  for (let i = 0; i < 3; i++) {
    let opponent = new OpponentSnake(random(width), random(height));
    opponents.push(opponent);
  }

  // Spawn food all over the place
  for (let i = 0; i < 1000; i++) {
    let newFood = new Food(random(width), random(height));
    foods.push(newFood);
  }
}

function draw() {
  background("#15212f");

  updateCamera();

  // Center the camera on the snake and apply scaling
  translate(width / 2, height / 2);
  scale(1.0); // Optional: Adjust zoom level if needed
  translate(-cameraX, -cameraY);

  // Display food
  for (let food of foods) {
    food.display();
  }

  // Update and display the player's snake
  snake.update();
  snake.display();

  // Update and display opponent snakes
  for (let opponent of opponents) {
    opponent.update();
    opponent.display();
  }

  // Check if the player's snake hits any food
  checkFoodCollision(snake);

  // Check if opponent snakes hit any food
  for (let opponent of opponents) {
    checkFoodCollision(opponent);
  }
}

function updateCamera() {
  cameraX = snake.x;
  cameraY = snake.y;
}

function checkFoodCollision(snake) {
  for (let i = foods.length - 1; i >= 0; i--) {
    if (dist(snake.x, snake.y, foods[i].x, foods[i].y) < snake.radius) {
      foods.splice(i, 1);
      snake.grow();
    }
  }
}

class SlitherSnake {
  constructor(x, y) {
    this.speed = 5;
    this.radius = 15;
    this.x = x;
    this.y = y;
    this.color = color(random(255), random(255), random(255));
    this.length = 1;
    this.path = [];
  }

  display() {
    fill(this.color);
    noStroke();
    for (let i = 0; i < this.path.length; i++) {
      let point = this.path[i];
      circle(point.x, point.y, this.radius * 2);
    }
  }

  move() {
    let dx = mouseX - width / 2;
    let dy = mouseY - height / 2;
    let angle = atan2(dy, dx);
    this.x += cos(angle) * this.speed;
    this.y += sin(angle) * this.speed;
  }

  grow() {
    this.length++;
  }

  update() {
    this.move();
    this.updatePath();
  }

  updatePath() {
    this.path.unshift(createVector(this.x, this.y));
    while (this.path.length > this.length) {
      this.path.pop();
    }
  }
}

class OpponentSnake {
  constructor(x, y) {
    this.speed = 3.2;
    this.radius = 10;
    this.x = x;
    this.y = y;
    this.color = color(random(255), random(255), random(255));
    this.length = 1;
    this.path = [];
  }

  display() {
    fill(this.color);
    noStroke();
    for (let i = 0; i < this.path.length; i++) {
      let point = this.path[i];
      circle(point.x, point.y, this.radius * 2);
    }
  }

  grow() {
    this.length += 2;
  }

  update() {
    this.move();
    this.updatePath();
  }

  updatePath() {
    this.path.unshift(createVector(this.x, this.y));
    while (this.path.length > this.length) {
      this.path.pop();
    }
  }

  move() {
    let closestFood;
    let closestDistance = Infinity;

    if (foods.length === 0) {
      return;
    }

    for (let food of foods) {
      let d = dist(this.x, this.y, food.x, food.y);
      if (d < closestDistance) {
        closestDistance = d;
        closestFood = food;
      }
    }

    if (closestFood) {
      let dx = closestFood.x - this.x;
      let dy = closestFood.y - this.y;
      let distance = sqrt(dx * dx + dy * dy);
      dx /= distance;
      dy /= distance;
      this.x += dx * this.speed;
      this.y += dy * this.speed;
    }
  }
}

class Food {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radiusOfFood = 5;
    this.color = color(random(255), random(255), random(255));
  }

  display() {
    fill(this.color);
    noStroke();
    circle(this.x, this.y, this.radiusOfFood * 2);
  }
}
