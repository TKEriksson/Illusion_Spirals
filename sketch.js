// Tobias Eriksson, 2024.

let slider1; //For slider 1 (Number of spirals)
let slider2; //For slider 2 (Turns)
let slider3; //For slider 3 (Speed)
let slider4; //For slider 4 (Thickness)

let myPicker; //For colorpicker

let sld1; // For the value of slider 1 (Number of spirals)
let sld2; // For the value of slider 2 (Turns)
let sld3; // For the value of slider 3 (Speed)
let sld4; // For the value of slider 4 (Thickness)
let pick; // For the value of colorpicker

let v = 0.0; // v for the angle, will increase every time r (radius) grow, to make the spiral.

let sx = 0.0; //spiral X
let sy = 0.0; //Spiral Y
let cx = 0.0; //Current X
let xy = 0.0; //Current Y

let bg;

function setup() {
  createCanvas(260, 440);
  sliders(3, 6, 40, 8, "yellow"); // Calling the sliders-function. It creates the slider/picker-elements. Passing the std-values.
}

function draw() {
  // Check if fullscreen. If not, draw the elements, if true, render and spin the spirals!
  if (!fullscreen()) {
    resizeCanvas(260, 440); //Reset the size.
    background(150, 100, 255); // Set bg-color

    fill(0, 255, 0); //fill color for title
    stroke(255, 0, 255); //stroke-color for title

    strokeWeight(5); //Big stroke for title.
    textSize(18); //Title font size
    text("Spirals", 20, 20, 200, 20); // Title

    //Set font and fontcolor for element-labels.
    strokeWeight(1);
    fill(0);
    stroke(0);
    textSize(14);
    text("Number of spirals: " + slider1.value(), 20, 60, 200, 20); // Label for slider 1, and slider value
    text("Number of turns: " + slider2.value(), 20, 120, 200, 20); // Label for slider 2, and slider value
    text("Speed: " + slider3.value() + "%", 20, 180, 200, 20); // Label for slider 3, and slider value
    text("Thickness: " + slider4.value(), 20, 240, 200, 20); // Label for slider 4, and slider value

    // SPIN-button
    stroke(0, 55, 0);
    fill(0, 255, 0);
    rect(100, 300, 120, 80);
    textSize(22);
    fill(0);
    text("SPIN!", 130, 330, 150, 30);

    textSize(14);
    text("(Mouse press to close)", 20, 400, 150, 30);
  } else {
    // Fullscreen on - set the width and height to match the screen, then spin the spirals
    resizeCanvas(windowWidth, windowHeight);
    background(0);

    //Paint the spirals
    spirals();
  }
}

// Create the sliders and pick.
function sliders(sld1, sld2, sld3, sld4, pick) {
  slider1 = createSlider(1, 10, sld1, 1); // Slider 1, passing the sld1 as value.
  slider1.position(20, 80);
  slider1.size(200);

  slider2 = createSlider(2, 10, sld2, 1); // Slider 2, passing the sld2 as value.
  slider2.position(20, 140);
  slider2.size(200);

  slider3 = createSlider(0, 100, sld3, 1); // Slider 3, passing the sld3 as value.
  slider3.position(20, 200);
  slider3.size(200);

  slider4 = createSlider(1, 10, sld4, 1); // Slider 4, passing the sld4 as value.
  slider4.position(20, 260);
  slider4.size(200);

  myPicker = createColorPicker(pick); // picker, passing the pick as colorvalue.
  myPicker.position(20, 320);
}

// Get mouse press (to close the spirals in fullscreenmode, or start the spin from the button.)
function mousePressed() {
  //Get if fullscreen is on.
  if (fullscreen()) {
    //Fullscreen is on when mouse clicked!
    fullscreen(false); // Turn off fullscreen
    sliders(sld1, sld2, sld3, sld4, pick); //Create the elements again.
  } else {
    // check if the spin-button pressed.
    if (mouseX > 100 && mouseX < 220 && mouseY > 300 && mouseY < 380) {
      fullscreen(true); //Set fullscreen
      // Get the values from the elements.
      sld1 = slider1.value();
      sld2 = slider2.value();
      sld3 = slider3.value();
      sld4 = slider4.value();
      pick = myPicker.color();
      // Remove elements so they not visible when the spirals spin.

      localStorage.setItem("sld1", sld1.toString());
      localStorage.setItem("sld2", sld2.toString());
      localStorage.setItem("sld3", sld3.toString());
      localStorage.setItem("sld4", sld4.toString());
      localStorage.setItem("pick", pick.toString()); // Convert color to string

      removeElements();
    }
  }
}

//Function that paints spirals in the middle of the screen.
function spirals() {
  let rTurn; // Variable for the amount of radius a spiral grows in 1 turn of the spiral.
  let r; // Radius.
  let rot; // Rotation.

  //Translate to center of screen.
  translate(width / 2, height / 2);

  //Set the color and thickness.
  fill(pick);
  stroke(pick);
  strokeWeight(sld4);

  // For-loop for each spiral.
  for (let spiral = 0; spiral < sld1; spiral++) {
    // Reset all variables.
    cx = 0;
    cy = 0;
    sx = 0;
    sy = 0;
    v = 0;

    // rTurn is the length of the longest side of the screen divided by 2 divided by how many turns the user set.
    rTurn = width > height ? width / 2 / sld2 : height / 2 / sld2;

    // Loop for every turn of the spiral.
    for (let t = 0; t <= sld2; t++) {
      // If the turn is even (to alternate direction each turn)

      //Loop every turn, and let r increase with "rturn" amount of radius each loop.
      for (r = t * rTurn; r < (t + 1) * rTurn; r += 1) {
        // v (angle) increase or decrease with rate (rate is set to 0.07 by testing what looks good) depending on direction in the turn.
        v = t % 2 == 0 ? v + 0.07 : v - 0.07;

        cx = sx; // Set the sx as the current before setting the new sx.
        cy = sy; // Set the sy as the current before setting the new sy.
        sx = cos(rot + v + ((2 * PI) / sld1) * spiral) * r; // Calculate the new x for the spiral (sx). Think like drawing a circle (x with cos, y with sin) but with increasing radius, with altered direction depending on turns.
        sy = sin(rot + v + ((2 * PI) / sld1) * spiral) * r; // Calculate the new y for the spiral (sy). Think like drawing a circle (x with cos, y with sin) but with increasing radius, with altered direction depending on turns.
        rot = (sld3 / 100) * 0.3 * (frameCount % 100000); //Set the rotation-variable to grow with the frameCount of the scene, in proportion to the speed set in slider 3. % 100k to prevent overflow jic.
        line(cx, cy, sx, sy); //Draw a line from the current x&y to the new.
      }

      // If the turn is even (to alternate direction each turn)
    }
  }
}
