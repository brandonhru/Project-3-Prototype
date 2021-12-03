//FFT SOUND VISUALIZATION (CODING TRAIN): https://www.youtube.com/watch?v=2O3nm0Nvbi4&t=22s

//PARTICLES: https://p5js.org/examples/simulate-particles.html https://p5js.org/examples/simulate-multiple-particle-systems.html


var song
var img
var fft
// an array to add multiple particles
var particles = []

//Songs that can be played: 'Metric.mp3' 'Drake.mp3' 'House.mp3' 'Synth.mp3'
function preload() {
  song = loadSound('Synth.mp3')
  img = loadImage('background.jpg')
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES)
  imageMode(CENTER)
  rectMode(CENTER)
  fft = new p5.FFT(0.9)


  img.filter(BLUR, 12)

  noLoop()
}

function draw() {
  background(0)
  

  translate(width / 2, height / 2)
    
//https://p5js.org/reference/#/p5.FFT/getEnergy
//Returns the amount of energy (volume) at a specific frequency, or the average amount of energy between two frequencies.    
  fft.analyze()
  amp = fft.getEnergy(20, 50)

//https://p5js.org/reference/#/p5/push
//Creating backgrond effect using amp function   
  push()
  if (amp > 230) {
    rotate(random(-0.5, 0.5))
  }

  image(img, 0, 0, width + 100, height + 100)
  pop()

  var alpha = map(amp, 0, 255, 180, 150)
  fill(0, alpha)
  noStroke()
  rect(0, 0, width, height)

  
  stroke(255)
  strokeWeight(3)
  noFill()
    
    //creating sine waves in the middle of the canvas
    //https://p5js.org/examples/math-sine-wave.html
    //https://p5js.org/reference/#/p5/frameCount
    
    //Play around with numbers to create unqiue shapes
    beginShape()
    for (var i = 0; i < 360; i++) {

        var r1Min = map(sin(frameCount), -1, 1, amp, 120)
        var r1Max = map(sin(frameCount * 4), -1, 1, amp, 20)

        var r2Min = map(sin(frameCount / 2), -1, 1, 120, amp)
        var r2Max = map(sin(frameCount), -1, 1, 20, 200)

        var r1 = map(sin(i * 3), -1, 8, r1Min, r1Max)
        var r2 = map(sin(i * 6 + 90), -1, 1, r2Min, r2Max)
        var r = r1 + r2
        var x = r * cos(i)
        var y = r * sin(i)
        vertex(x, y)
    }
    endShape(CLOSE)  
    
        beginShape()
    for (var i = 0; i < 360; i++) {

        var r1Min = map(sin(frameCount), -1, 1, 75, 120)
        var r1Max = map(sin(frameCount * 8), -1, 3, amp, 20)

        var r2Min = map(sin(frameCount / 2), -1, 1, 100, 50)
        var r2Max = map(sin(frameCount), -1, 1, 10, amp)

        var r1 = map(sin(i * 3), -1, 1, r1Min, r1Max)
        var r2 = map(sin(i * 6 + 90), -1, 1, r2Min, r2Max)
        var r = r1 + r2
        var x = r * cos(i)
        var y = r * sin(i)
        vertex(x, y)
    }
    endShape(CLOSE)  
    
      beginShape()
    for (var i = 0; i < 360; i++) {

        var r1Min = map(sin(frameCount), -1, 1, 50, amp)
        var r1Max = map(sin(frameCount * 4), -1, 1, 105, 20)

        var r2Min = map(sin(frameCount / 2), -1, 1, 120, 75)
        var r2Max = map(sin(frameCount), -1, 1, 20, 200)

        var r1 = map(sin(i * 3), -1, 8, r1Min, r1Max)
        var r2 = map(sin(i * 6 + 90), -1, 1, r2Min, r2Max)
        var r = r1 + r2
        var x = r * cos(i)
        var y = r * sin(i)
        vertex(x, y)
    }
    endShape(CLOSE)
    
    
//using fft to create waveforms around circle
  var wave = fft.waveform()

  for (var t = -1; t <= 1; t += 2) {
    beginShape()
    for (var i = 0; i <= 180; i += 0.5) {
      var index = floor(map(i, 0, 180, 0, wave.length - 1))
  
      var r = map(wave[index], -1, 1, 400, 200)
      
      var x = r * sin(i) * t
      var y = r * cos(i)
      vertex(x, y)
    }
    endShape()
  }
  
  var p = new Particle()
  particles.push(p)


  for (var i = particles.length - 1; i >= 0; i--) {
    if (!particles[i].edges()) {
      particles[i].update(amp > 20000)
      particles[i].show()
    } else {
      particles.splice(i, 1)
    }
    
  }
    

}

//Mouse Click to pause and play song and effects
function mouseClicked() {
  if (song.isPlaying()) {
    song.pause()
    noLoop()
  } else {
    song.play()
    loop()
  }
}

class Particle {
  constructor() {
    this.pos = p5.Vector.random2D().mult(amp)
    this.vel = createVector(0, 0)
    //setting the speed of the particles  
    this.acc = this.pos.copy().mult(random(0.0005, 0.00003))

      //size of the particles
      this.w = random(5, 7)
      
      //colour of the particles
    this.color = [random(50, 155), random(244, 133), random(200, 255),]
  }
  update(cond) {
    this.vel.add(this.acc)
    this.pos.add(this.vel)
    if (cond) {
      this.pos.add(this.vel)
      this.pos.add(this.vel)
      this.pos.add(this.vel)
    }
  }
    
//
  edges() {
    if (this.pos.x < -width / 2 || this.pos.x > width / 2 || this.pos.y < -height / 2 || this.pos.y > height / 2) {
      return true
    } else {
      return false
    }
  }
    
  show() {
    noStroke()
    fill(this.color)
    ellipse(this.pos.x, this.pos.y, this.w)
  }
}