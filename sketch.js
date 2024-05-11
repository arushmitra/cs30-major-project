// Slither.io Rip Off
// Arush Mitra 
// Comp Sci 30 Major Project

let snake;
let food;

function setup() {
  createCanvas(windowWidth, windowHeight);
  snake = new slitherSnake(width/2,height/2);
}

function draw() {
  background(220);
  snake.update();
  snake.display();

}



class slitherSnake{
  constructor(x,y){
    this.speed = 5;
    this.radius = 15;
    this.x = x;
    this.y = y;
    this.color = color(random(255), random(255), random(255));
  }

  display() {
    noStroke();
    fill(this.color);
    circle(this.x,this.y,this.radius*2);
  }

  move(){
    // following the mouse
    let dx = mouseX - this.x;
    let dy = mouseY - this.y;

    // direction vector 
    // using magnitude of vector formula
    let distance = sqrt(dx * dx + dy * dy);
    dx /= distance;
    dy /= distance;

    // speed 
    let speedChanger = this.speed / 1.5;
    this.x += dx * speedChanger;
    this.y += dy * speedChanger;
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
  }

  food(){
    
  }

}