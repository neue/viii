var blips = [];
var palette = [
  '#8c6c90',
  '#adcc9f',
  '#D8802D',
  '#B81600',
  '#7C614B',
  '#312724',
  '#D2985E',
  '#BC7C55',
  '#E2B96A',
  '#d4949b',
  '#ca6452',
];
var backgroundColor;
var waveColor;
var globalAngleX = 0;
var globalHue = 0;
var globalSine = 0;
var angleSlider,hueSlider, sineAmpSlider, sineFreqSlider, sineSpeedSlider;
var time = 0;
var timeStep = 0.0;

function randomColor() {
  return palette[Math.floor(random(0,palette.length))];
}

function setup() {
	createCanvas(windowWidth, windowHeight);
  noStroke();
  ellipseMode(CENTER);
  rectMode(CENTER);
  angleMode(DEGREES);
  colorMode(HSB);
  strokeCap(ROUND);
  
  backgroundColor = color('#fff8e1');
  waveColor = color('#ffea9c');
  generate();
  angleSlider = createSlider(0, 360, 0);
  angleSlider.position(20, 20);
  hueSlider = createSlider(0, 360, 0);
  hueSlider.position(20, 40);
  sineAmpSlider = createSlider(0, 300, 1);
  sineAmpSlider.position(180, 20);
  sineFreqSlider = createSlider(1, 50, 0);
  sineFreqSlider.position(180, 40);
}
function draw() {update();render();}

function generate(){
  blips = [];
  for (var i = 0; i < 9; i++) {
    addBlip();
  }
  blips.push(new blip(
    250,
    250,
    random(20,100),
    3,
    color(randomColor()))
  );
}

function addBlip() {
  blips.push(new blip(
    random(0,width),
    random(0,height),
    random(20,100),
    Math.floor(random(0,3.90)),
    color(randomColor()))
  );
}

function update() {
  globalAngleX = angleSlider.value();
  globalHue    = hueSlider.value();
  for (var i = 0; i < blips.length; i++) {
    blips[i].update();
  }
}

function render() {
  blendMode(BLEND);
  background(hue(backgroundColor)+globalHue,saturation(backgroundColor),brightness(backgroundColor));
  stroke(hue(waveColor)+globalHue,saturation(waveColor),brightness(waveColor));
  blendMode(MULTIPLY);
  strokeWeight(5);
  noFill();
  beginShape();
  for (var i = 0; i < width; i+=20) {
      curveVertex(i,250+globalSineOffset(i));
  }
  endShape();
  noStroke();
  // drawGrid();
  for (var i = 0; i < blips.length; i++) {
    blips[i].render();
  }
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
  }  
  if (key == "Z") {
    triggerInstrument(0);
  }
  if (key == "X") {
    triggerInstrument(1);
  }
  if (key == "C") {
    triggerInstrument(2);
  }
  if (key == "V") {
    triggerInstrument(3);
  }
  if (key == "R") {
    generate();
  }
  if (key == "N") {
    addBlip();
  }
}

function triggerInstrument(intrumentNo) {
  for (var i = 0; i < blips.length; i++) {
    if (blips[i].type == intrumentNo) {
      blips[i].impulse();        
    }
  }
}

function globalSineOffset(objectX){
  return Math.sin((objectX+frameCount)*(sineFreqSlider.value()*0.005))*sineAmpSlider.value();
}

function drawGrid() {
  var gridSpaceX = width / 10;
  var gridSpaceY = height / 10;
  for (var x = 0; x < 10; x++) {
    for (var y = 0; y < 20; y++) {
      fill(hue(waveColor)+globalHue,saturation(waveColor),brightness(waveColor));
      ellipse(
        (gridSpaceX/2)+gridSpaceX*x,
        -(height/2)+((gridSpaceY/2)+gridSpaceY*y)+globalSineOffset(gridSpaceX*x),
        5,
        5);
    }
  }
}

function blip(_x,_y,_size,_type,_color) {
  this.x        = _x;
  this.y        = _y;
  this.initX    = _x;
  this.initY    = _y;
  this.size     = _size;
  this.initSize = _size;
  this.type     = _type;
  this.color    = _color;
  if (this.type == 1) {
    this.angle = random(0,360);
    this.targetAngle = this.angle;
  }
  if (this.type == 2) {
    this.flecks = [];
    for (var i = 0; i < Math.round(random(4,9)); i++) {
      var fX = random(-30,30);
      var fY = random(-30,30);
      this.flecks.push({
        x: fX,
        y: fY,
        initX: fX,
        initY: fY,
        angle: random(0,360),
      });
    }
  }
  if (this.type == 3) {
    this.angle = random(0,360);
    this.targetAngle = this.angle;
    this.shrinky = 0.6;
    this.targetShrinky = 0.6;
    this.size = random(40,100);
  }
  console.log(this.flecks);
}

blip.prototype.update = function() {
  switch (this.type) {
  case 0:
    if (this.size > this.initSize) {
      this.size *= 0.95;
    }
  break;
  case 1:
    if (this.size > this.initSize) {
      this.size *= 0.95;
    }
    this.angle = lerp(this.angle,this.targetAngle,0.1);
  break;
  case 2:
    this.x = lerp(this.x,this.initX,0.1);
    this.y = lerp(this.y,this.initY,0.1);
    for (var i = 0; i < this.flecks.length; i++) {
      this.flecks[i].x = lerp(this.flecks[i].x,this.flecks[i].initX,0.1);
      this.flecks[i].y = lerp(this.flecks[i].y,this.flecks[i].initY,0.1);
    }
  break;
  case 3:
    if (this.size > this.initSize) {
      this.size *= 0.95;
    }
    
    this.angle = lerp(this.angle,this.targetAngle,0.1);
    this.shrinky = lerp(this.shrinky,this.targetShrinky,0.1);
  break;
  default:
    
  };
}

blip.prototype.render = function() {
  fill(hue(this.color)+globalHue,saturation(this.color),brightness(this.color));
  push();
  translate(width/2,height/2);
  rotate(globalAngleX);
  translate(this.x-(width/2),(this.y-(height/2))+globalSineOffset(this.x));
  switch (this.type) {
  case 0:
    ellipse(0,0,this.size,this.size);    
  break;
  case 1:
    rotate(this.angle);
    rect(0,0,this.size,this.size);    
  break;
  case 2:
    for (var i = 0; i < this.flecks.length; i++) {
      stroke(hue(this.color)+globalHue,saturation(this.color),brightness(this.color));
      rotate(this.flecks[i].angle);
      line(this.flecks[i].x,this.flecks[i].y,this.flecks[i].x,this.flecks[i].y+10);
      noStroke();
    }
  break;
  case 3:
    rotate(this.angle);
    stroke(hue(this.color)+globalHue,saturation(this.color),brightness(this.color));
    noFill();
      rect(0,0,this.size,this.size);
      rotate(this.angle+10);
      rect(0,0,this.size*this.shrinky,this.size*this.shrinky);
      rotate(this.angle+10);
      rect(0,0,this.size*(this.shrinky*this.shrinky),this.size*(this.shrinky*this.shrinky));
    noStroke();
  break;
  default:
  };
  pop();
}

blip.prototype.impulse = function() {
  switch (this.type) {
  case 0:
    this.size += random(50,200);    
  break;
  case 1:
    this.size += random(50,200);
    this.targetAngle += random(-200,200);
  break;
  case 2:
    for (var i = 0; i < this.flecks.length; i++) {
      this.flecks[i].x += random(-50,50);
      this.flecks[i].y += random(-50,50);
    }
  break;
  case 3:
    this.size += random(this.size+5,this.size+10);
    // this.targetAngle += random(-200,200);
    this.shrinky = 1;
  break;
  default:
  }
}