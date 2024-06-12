// Slither.io Rip Off
// Arush Mitra 
// Comp Sci 30 Major Project

let snake;
let foods = [];
let opponents = [];
let score = 0; // Initialize score
let cameraX, cameraY;
let state = "start";
let startButton = new Clickable();
let startImage;
let worldWidth = 3000;
let worldHeight = 3000;

function preload() {
  startImage = loadImage('title-page.png'); // Load your image here
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  snake = new SlitherSnake(width / 2, height / 2);

  cameraX = snake.x;
  cameraY = snake.y;

  for (let i = 0; i < 6; i++) {
    let opponent = new OpponentSnake(random(worldWidth), random(worldHeight));
    opponents.push(opponent);
  }

  // Spawn food all over the place
  for (let i = 0; i < 2000; i++) {
    let newFood = new Food(random(worldWidth), random(worldHeight));
    foods.push(newFood);
  }

  startButton = new Clickable();
  startButton.x = width / 2 - 100;
  startButton.y = height / 2 + 100;
  startButton.width = 200;
  startButton.height = 100;
  startButton.textSize = 32;
  startButton.text = "Start Game";
  startButton.onPress = () => {
    state = "game";
  };
}

function draw() {
  background("#15212f");
  if (state === "start") {
    image(startImage, width / 2 - startImage.width / 2, height / 2 - startImage.height / 2 - 150);
    startButton.draw();
  } else if (state === "game") {
    // Display score
    // Stick the score to the top left 
    push();
    textSize(30);
    fill(255);
    text("Score: " + score, 10, 30); 
    pop();
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

    // Check if the player's snake collides with any opponent snakes
    checkOpponentCollision();

    // Check if opponent snakes collide with each other
    checkOpponentOpponentCollision();

    
  } else if (state === "game over") {
    // Display "GAME OVER" text
    push();
    textSize(64);
    fill(255, 0, 0);
    textAlign(CENTER, CENTER);
    text("GAME OVER", width / 2, height / 2);
    pop();
  }
}

function mousePressed() {
  let dx = mouseX - width / 2;
  let dy = mouseY - height / 2;
  let angle = atan2(dy, dx);
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
      score += 1; // Increase score
    }
  }
}

function checkSnakeCollision(snake1, snake2) {
  for (let i = 0; i < snake1.path.length; i++) {
    let point1 = snake1.path[i];
    for (let j = 0; j < snake2.path.length; j++) {
      let point2 = snake2.path[j];
      if (dist(point1.x, point1.y, point2.x, point2.y) < snake1.radius + snake2.radius) {
        return true;
      }
    }
  }
  return false;
}

function checkOpponentCollision() {
  for (let opponent of opponents) {
    if (checkSnakeCollision(snake, opponent)) {
      if (snake.length > opponent.length) {
        respawnOpponent(opponent);
      } else {
        state = "game over";
        break;
      }
    }
  }
}

function checkOpponentOpponentCollision() {
  for (let i = 0; i < opponents.length; i++) {
    for (let j = i + 1; j < opponents.length; j++) {
      if (checkSnakeCollision(opponents[i], opponents[j])) {
        if (opponents[i].length > opponents[j].length) {
          respawnOpponent(opponents[j]);
        } else {
          respawnOpponent(opponents[i]);
        }
      }
    }
  }
}

function respawnOpponent(opponent) {
  opponent.x = random(worldWidth);
  opponent.y = random(worldHeight);
  opponent.length = 10;
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

    // Ensure the snake stays within the world boundaries
    this.x = constrain(this.x, 0, worldWidth);
    this.y = constrain(this.y, 0, worldHeight);
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
    this.length = 10;  // Initial length
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
    if (!this.collidedWithFood()) {
      this.move();
      this.updatePath();
    }
  }

  collidedWithFood() {
    for (let i = foods.length - 1; i >= 0; i--) {
      let d = dist(this.x, this.y, foods[i].x, foods[i].y);
      if (d < this.radius + foods[i].radiusOfFood) {
        this.grow();
        foods.splice(i, 1);
        return true;
      }
    }
    return false;
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

      // Ensure the snake stays within the world boundaries
      this.x = constrain(this.x, 0, worldWidth);
      this.y = constrain(this.y, 0, worldHeight);
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

    // Ensure food stays within the world boundaries
    this.x = constrain(this.x, 0, worldWidth);
    this.y = constrain(this.y, 0, worldHeight);
  }
}
