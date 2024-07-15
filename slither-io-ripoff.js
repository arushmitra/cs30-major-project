// Slither.io Rip Off
// Arush Mitra 

let snake;
let foods = [];
let opponents = [];
let score = 0; 
let cameraX, cameraY;
let state = "start";
let startButton;
let instructionButton;
let backButton;
let startImage;
let startImage2;
let bgMusic;
let youDiedMusic;
let worldWidth = 5000;
let worldHeight = 5000;
let zoom = 1; 

// Function to load all assets
function preload() {
  startImage = loadImage('assets/title-page.png'); // Load image here
  startImage2 = loadImage('assets/slio.png'); // Load image here
  bgMusic = loadSound('assets/Shake and Bake.mp3'); // Load music file 
  youDiedMusic = loadSound('assets/Sad Ending Music.wav'); // Load death file 
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  snake = new SlitherSnake(width / 2, height / 2);

  cameraX = snake.x;
  cameraY = snake.y;

  // To add more opponents just change it from 5 to whatever you want 
  for (let i = 0; i < 5; i++) {
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
  startButton.height = 50;
  startButton.textSize = 32;
  startButton.text = "Start Game";
  startButton.onPress = () => {
    state = "game";
    bgMusic.loop();
  };

  instructionButton = new Clickable();
  instructionButton.x = width / 2 - 100;
  instructionButton.y = height / 2 + 200;
  instructionButton.width = 200;
  instructionButton.height = 50;
  instructionButton.textSize = 32;
  instructionButton.text = "Instructions";
  instructionButton.onPress = () => {
    state = "instructions";
  };

  backButton = new Clickable();
  backButton.x = width / 2 - 100;
  backButton.y = height / 2 + 300;
  backButton.width = 200;
  backButton.height = 50;
  backButton.textSize = 32;
  backButton.text = "Back";
  backButton.onPress = () => {
    state = "start";
  };

  function mousePressed(){
    snake.toggleBoost();
    // Snake lose length when boosted
    if (snake.length > 20) {
      snake.shrink();
    } else {
      snake.length = 1; 
    }
  };
}

function draw() {
  background("#15212f");
  if (state === "start") {
    image(startImage, width / 2 - startImage.width / 2, height / 2 - startImage.height / 2 - 150);
    startButton.draw();
    instructionButton.draw();
  } else if (state === "game") {
    // Display score
    push();
    textSize(30);
    fill(255);
    text("Score: " + score, 10, 30); 
    pop();
    updateCamera();
    // Center the camera on the snake and apply scaling
    translate(width / 2, height / 2);
    scale(zoom); 
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
    
  } 
  else if (state === "instructions") {
    push();
    image(startImage2, width / 2 - startImage.width / 2 + 150, height / 2 - startImage.height / 2 - 300);
    textSize(30);
    fill(255);
    textAlign(CENTER);
    
    text("This is a SlitherIO rip off. To play this game you have to eat the food as fast as you can and kill your opponents to win.", width / 2, height / 2);
    text("You have to eat the smaller snake to grow, but if you're the smaller one- you're gonna die.", width / 2, height / 2 + 100);
    text("If you click the mouse, you will speed up but lose your length!", width / 2, height / 2 + 200);
    pop();
    backButton.draw();
  } else if (state === "game over") {
    bgMusic.stop();
    // Display "GAME OVER" text
    push();
    textSize(64);
    fill(255, 0, 0);
    textAlign(CENTER, CENTER);
    text("GAME OVER", width / 2, height / 2);
    youDiedMusic.loop();
    pop();
  }
}

function mouseWheel(x) {
  // Adjust zoom level based on scroll wheel movement
  zoom -= x.delta / 1000;
  zoom = constrain(zoom, 0.5, 2); 
}

function updateCamera() {
  cameraX = snake.x;
  cameraY = snake.y;
}

// Check if player has hit the food 
function checkFoodCollision(snake) {
  for (let i = foods.length - 1; i >= 0; i--) {
    if (dist(snake.x, snake.y, foods[i].x, foods[i].y) < snake.radius) {
      foods.splice(i, 1);
      snake.grow();
      score += 1; 
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

// Check for player and opponent crashes 
function checkOpponentCollision() {
  for (let opponent of opponents) {
    if (checkSnakeCollision(snake, opponent)) {
      if (snake.length > opponent.length) {
        // Increase player's snake length by 10
        snake.length += 25;
        snake.score += 25;
        respawnOpponent(opponent);
        // Remove the opponent from the opponents array
        opponents.splice(opponents.indexOf(opponent), 1);
      } else {
        state = "game over";
        break;
      }
    }
  }
}

// Check for opponent to opponent crashes 
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

// Respawns opponent with legnth of 10
function respawnOpponent(opponent) {
  opponent.x = random(worldWidth);
  opponent.y = random(worldHeight);
  opponent.length = 10;
}

class SlitherSnake {
  constructor(x, y) {
    this.speed = 5;
    this.boostSpeed = 8; // Increased speed during boost
    this.radius = 19;
    this.x = x;
    this.y = y;
    this.color = color(random(255), random(255), random(255));
    this.headColor = color(random(255), random(255), random(255));
    this.length = 10;
    this.path = [];
    this.boostActive = false; // Flag to indicate boost mode
  }

  display() {
    // Display snake body
    noStroke();
    for (let i = 0; i < this.path.length; i++) {
      let point = this.path[i];
      if (i == 0) {
        fill(this.headColor);
      } else {
        fill(this.color);
      }
      circle(point.x, point.y, this.radius * 2);
    }
  }

  move() {
    let dx = mouseX - width / 2;
    let dy = mouseY - height / 2;
    let angle = atan2(dy, dx);

    // To check if snake is in boost mode 
    if (this.boostActive) {
      this.x += cos(angle) * this.boostSpeed;
      this.y += sin(angle) * this.boostSpeed;
    } else {
      this.x += cos(angle) * this.speed;
      this.y += sin(angle) * this.speed;
    }

    // Ensure the snake stays within the world boundaries
    this.x = constrain(this.x, 0, worldWidth);
    this.y = constrain(this.y, 0, worldHeight);
  }

  grow() {
    this.length++;
  }

  shrink() {
    this.length -= 10; 
    this.length = max(this.length, 1); 
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

  toggleBoost() {
    this.boostActive = !this.boostActive;
  }
}

class OpponentSnake {
  constructor(x, y) {
    this.speed = 1.3;
    this.radius = 20;
    this.x = x;
    this.y = y;
    this.color = color(random(255), random(255), random(255));
    this.headColor = color(random(255), random(255), random(255));
    this.length = 1;  
    this.path = [];
  }

  display() {
    noStroke();
    for (let i = 0; i < this.path.length; i++) {
      let point = this.path[i];
      if (i == 0) {
        fill(this.headColor);
      } else {
        fill(this.color);
      }
      circle(point.x, point.y, this.radius * 2);
    }
  }

  grow() {
    this.length += 2.2;
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

    // This is to make the opponents move to the food 
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
    drawingContext.shadowBlur = 20; 
    drawingContext.shadowColor = this.color;
    fill(this.color);
    noStroke();
    circle(this.x, this.y, this.radiusOfFood * 2);
    
    drawingContext.shadowBlur = 0;
    drawingContext.shadowColor = 'rgba(0,0,0,0)';
    
    // Ensure food stays within the world boundaries
    this.x = constrain(this.x, 0, worldWidth);
    this.y = constrain(this.y, 0, worldHeight);
  }
}
