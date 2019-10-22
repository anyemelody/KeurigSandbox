var nmobiles = 4000;
var mobiles = [];
var noisescale;
var a1, a2, a3, a4, a5, amax;
var bw = false;
let sliderTemp,
  tempDiv,
  sliderStrength,
  strengthDiv,
  sliderCupSize,
  sizeDiv,
  tempValue,
  strengthValue,
  button,
  submitted = false;

let width1, height1;

let logoImg;

function preload() {
  logoImg = loadImage("assets/title.png");
}

function setup() {
  width1 = window.innerWidth;
  height1 = window.innerHeight;
  createCanvas(width1, height1);
  background(229, 216, 199);
  noFill();
  colorMode(HSB, 360, 100, 100, 255);
  strokeWeight(0.1);
  /////////create temp slider
  imageMode(CENTER);
  image(logoImg, width1 / 2, 100);
  tempDiv = createDiv("Temperature");
  tempDiv.style("font-size", "24px");
  tempDiv.style("color", "#5C2F29");
  tempDiv.position(width1 / 2 - 160, height1 / 2 - 55);
  sliderTemp = createSlider(0, 360, 200);
  sliderTemp.position(width1 / 2, height1 / 2 - 50);
  sliderTemp.style("width", width1 / 6 + "px");
  strengthDiv = createDiv("Strength");
  strengthDiv.position(width1 / 2 - 160, height1 / 2 - 5);
  strengthDiv.style("font-size", "24px");
  strengthDiv.style("color", "#5C2F29");
  sliderStrength = createSlider(1, 5, 2);
  sliderStrength.position(width1 / 2, height1 / 2);
  sliderStrength.style("width", width1 / 6 + "px");

  sizeDiv = createDiv("Cup Size");
  sizeDiv.style("font-size", "24px");
  sizeDiv.style("color", "#5C2F29");
  sizeDiv.position(width1 / 2 - 160, height1 / 2 + 45);
  sliderCupSize = createSlider(190, 210, 200);
  sliderCupSize.position(width1 / 2, height1 / 2 + 50);
  sliderCupSize.style("width", width1 / 6 + "px");

  // reset();
  tempValue = sliderTemp.value();
  strengthValue = sliderStrength.value() * 0.1;
  button = createButton("SUBMIT");
  button.position(width1 / 2 - 60, (height1 * 3) / 4);
  button.size(120, 50);
  button.style("font-size", "24px");
  button.style("color", "#E6DAC6");
  button.style("background-color", "#5C2F29");
  button.mousePressed(reset);
}

function removeDom() {
  button.remove();
  sliderTemp.remove();
  sliderStrength.remove();
  sliderCupSize.remove();
  tempDiv.remove();
  strengthDiv.remove();
  sizeDiv.remove();
}

function reset() {
  noisescale = random(0.08, 0.1);
  noiseDetail(int(random(1, 5)));
  amax = random(5);
  a1 = random(1, amax);
  a2 = random(1, amax);
  a3 = random(1, amax);
  a4 = random(1, amax);
  a5 = 10;
  for (var i = 0; i < nmobiles; i++) {
    mobiles[i] = new Mobile(i, sliderTemp);
  }
  submitted = true;
  strokeWeight(strengthValue);
  removeDom();
}

function draw() {
  tempValue = sliderTemp.value();
  strengthValue = sliderStrength.value() * 0.1;

  //noiseSeed(millis()*.00004);
  if (submitted) {
    for (var i = 0; i < nmobiles; i++) {
      mobiles[i].run();
    }
  }
}

function keyReleased() {
  //if (key=="s" || key=="S")saveCanvas("svimg" + day() + "_" + month() + "_" + hour() + "_" + minute() + "_" + second() + ".jpg");
  if (key == "s" || key == "S")
    saveCanvas(
      "POSTHELIOS_NOISE3_" +
        day() +
        "_" +
        month() +
        "_" +
        hour() +
        "_" +
        minute() +
        "_" +
        second() +
        ".png"
    );

  if (keyCode == 32) reset();
  if (key == "r" || key == "R") setup();
  if (key == "b" || key == "B") bw = !bw;
}

function Mobile(index, sliderTemp) {
  this.index = index;
  this.temp = sliderTemp;
  this.velocity = createVector(200, 200, 200);
  this.acceleration = createVector(200, 200, 200);
  this.position0 = createVector(
    random(0, width),
    random(0, height),
    random(0, sin(height))
  );
  this.position = this.position0.copy();
  this.trans = random(50, 100);

  // this.hu=(noise(a1*cos(PI*this.position.x/width), a1*sin(PI*this.position.y/height))*720)%random(360);
  // this.hu = ((tempValue - 190) * 360) / 20;
  this.hu = tempValue;
  console.log(this.hu);
  this.sat =
    noise(
      a2 * sin((PI * this.position.x) / width),
      a2 * sin((PI * this.position.y) / height)
    ) * 200;
  this.bri =
    noise(
      a3 * cos((PI * this.position.x) / width),
      a3 * cos((PI * this.position.y) / height)
    ) * 200;
}

Mobile.prototype.run = function() {
  this.update();
  this.display();
};

// Method to update position
Mobile.prototype.update = function() {
  this.velocity = createVector(
    1 -
      2 *
        noise(
          a4 + a2 * sin((TAU * this.position.x) / width),
          a4 + a2 * sin((TAU * this.position.y) / height)
        ),
    1 -
      2 *
        noise(
          a2 + a3 * cos((TAU * this.position.x) / width),
          a4 + a3 * cos((TAU * this.position.y) / height)
        )
  );

  this.velocity.mult(a5);
  //100*fbm(this.position);
  this.velocity.rotate(
    sin(100) * noise(a4 + a3 * sin((TAU * this.position.x) / width))
  );
  this.position0 = this.position.copy();
  this.position.add(this.velocity);
};

// Method to display
Mobile.prototype.display = function() {
  //if(bw)stroke(255,this.trans); else stroke((frameCount*1.8)%360, (millis()%360), (frameCount)%360, this.trans%255);
  stroke(this.hu, this.sat, this.bri, this.trans % 255);

  line(this.position0.x, this.position0.y, this.position.x, this.position.y);

  if (
    this.position.x > width ||
    this.position.x < 0 ||
    this.position.y > height ||
    this.position.y < 0
  ) {
    this.position0 = createVector(
      random(0, width),
      random(0, height),
      random(0, height * width)
    );
    this.position = this.position0.copy();
  }
};
