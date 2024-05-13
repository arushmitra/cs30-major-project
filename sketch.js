// Slither.io Rip Off
// Arush Mitra 
// Comp Sci 30 Major Project

let snake;
let food;
let foods = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  snake = new slitherSnake(width/2,height/2);

  // spawning food all over the place 
  for(let spawnFood = 0; spawnFood < 350; spawnFood++){
    food = new Food(random(width),random(height));
    foods.push(food);
  }
}

function draw() {
  background("darkblue");
  snake.update();
  snake.display();

  // update foods 
  for(let foodCheck of foods){
    foodCheck.display();
  }

// check if snake hits the food
for(let i = foods.length-1; i > 0; i--){
  if(dist(snake.x, snake.y, foods[i].x, foods[i].y) < snake.radius){
    foods.splice(i, 1);
    snake.grow(); 
}

}



class slitherSnake{
  constructor(x,y){
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


  move(){
      // Move the snake towards the mouse cursor
      let dx = mouseX - this.x;
      let dy = mouseY - this.y;
  
      let distance = sqrt(dx * dx + dy * dy);
      dx /= distance;
      dy /= distance;
  
      // Adjust speed
      let speedChanger = this.speed / 1.5;
      this.x += dx * speedChanger;
      this.y += dy * speedChanger;
  
  

    //grow the snake 
    this.length++;
  }

  wrapAroundScreen() {
    // Wrap around the screen if it falls off
    if (this.x < 0) {
      this.x += width;
    }
    if (this.x > width) {
      this.x -= width;
    }
    if (this.y < 0) {
      this.y += height;
    }
    if (this.y > height) {
      this.y -= height;
    }
  }

  update(){
    this.move();
    this.wrapAroundScreen();
    this.updatePath();
  }

  updatePath(){
    // adding one more element to this.path which helps the co-ordinates of the vector (snake)
    this.path.unshift(createVector(this.x,this.y));

    // if the path's length is more than the size of snake keep it going 
    while(this.path.length > this.length){
      this.path.pop();
    }
  }
}

class Food{
  constructor(x,y){
    this.x = x;
    this.y = y;
    this.radiusOfFood = 5;
    this.color = color(random(255),random(255),random(255));
  }

  display(){
    noStroke();
    fill(this.color)
    circle(this.x,this.y,this.radiusOfFood * 2);
  }
}