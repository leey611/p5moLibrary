// https://github.com/jht9629-nyu/my-p5js-repo-2023/tree/main/p5-projects/timed-drawing-class
// timed-drawing
// my.version update required here and in index.html ?v=23 to see github pages update

let my = { version: 21, width: 640, height: 480 };
// let my = { width: 640 / 2, height: 480 / 2 };
let drawPoints;

function my_init() {
  my.save_label = 'plea';
  my.lapse = 5; // seconds to re-draw points
  // my.xoffset = my.width / 2;
  my.xoffset = 0;
  my.draw_specs = [
    { color: 'red', strokeWeight: 12 },
    { color: 'green', strokeWeight: 7 },
    { color: 'yellow', strokeWeight: 2 },
  ];
  my.draw_color = 'white';
  my.strokeWeight = 10;
  my.run = 1;
  // npoint_limit = 200; // limit number of points in drawing
  my.npoint_limit = 0; // no limit
  my.timedDrawing = 0;
  my.staticDrawing = 1;

  // simple test for mobile phone
  if (window.screen.width < window.screen.height) {
    my.width = window.screen.width;
    my.height = my.width;
    my.xoffset = 0;
  }
}

function setup() {
  my_init();

  my.canvas = createCanvas(my.width, my.height);

  drawPoints = new DrawPoints(my);

  let urlParams = get_url_params();
  drawPoints.restore_drawing(urlParams);

  ui_init();

  my.canvas.mouseReleased(canvas_mouseReleased);
  my.canvas.touchEnded(canvas_touchEnded);
  // my.canvas.touchStarted(canvas_touchStarted); // my.version = 14;
}

function mouseDragged() {
  // console.log('mouseDragged');
  drawPoints.mouseDragged();
  return false; // required to prevent touch drag moving canvas on mobile
}

function canvas_mouseReleased() {
  // console.log('canvas_mouseReleased');
  drawPoints.mouseReleased();
}

function canvas_touchEnded() {
  // console.log('canvas_touchEnded');
  drawPoints.mouseReleased();
}

// function touchEnded() {
//   // console.log('touchEnded');
//   drawPoints.mouseReleased();
// }

function draw() {
  background(0);

  drawPoints.prepareOutput();

  image(drawPoints.output, 0, 0);
}

function ui_init() {
  let msg = [
    '(' + my.version + ') drag mouse on left side of canvas to create line drawing',
    'press startTimedDraw to re-draw on right in ' + drawPoints.lapse + ' seconds',
  ];
  createDiv(msg.join('<br/>'));

  let runCheckBox = createCheckbox('Run ', drawPoints.run).changed(function () {
    drawPoints.run = this.checked();
  });
  runCheckBox.style('display:inline;');

  createButton('startTimedDraw').mousePressed(function () {
    drawPoints.startTimedDraw();
  });
  createButton('stopTimedDraw').mousePressed(function () {
    drawPoints.stopTimedDraw();
  });
  createButton('clearDrawing').mousePressed(function () {
    drawPoints.clearDrawing();
  });

  createElement('br');

  // createSlider(min, max, oldVal, step)
  let lapse_slider = createSlider(0, 30, drawPoints.lapse).input(function () {
    drawPoints.lapse = this.value();
    // console.log('create_slider aVal ', aVal, 'type', typeof aVal);
    valSpan.html(formatNumber(drawPoints.lapse) + '');
    drawPoints.startTimedDraw();
  });
  lapse_slider.style('width:50%');
  let valSpan = createSpan(drawPoints.lapse + '');

  createElement('br');
  createSpan('save_label: ');

  createInput(drawPoints.save_label).input(function () {
    drawPoints.save_label = this.value();
    // save_drawing(); // too many saves
  });

  createButton('restore').mousePressed(function () {
    drawPoints.restore_drawing();
  });
  createButton('save').mousePressed(function () {
    drawPoints.save_drawing();
  });
  createButton('save_url').mousePressed(function () {
    drawPoints.save_drawing({ url: 1 });
  });
  createButton('clear_url').mousePressed(function () {
    drawPoints.clear_url();
  });
}

// function touchStarted(event) {
//   // console.log('touchStarted event', event);
//   // prevent default
//   // return false; // stops buttons on google Pixel phone
// }

// function canvas_touchStarted() {
//   console.log('canvas_touchStarted');
//   // prevent default
//   return false;
// }

// return seconds since start of sketch
function secsTime() {
  return millis() / 1000;
}

function formatNumber(num) {
  let prec = 1000;
  return int(num * prec) / prec;
}

//
function get_url_params() {
  let query = window.location.search;
  // console.log('query |' + query + '|');
  console.log('query.length', query.length);
  if (query.length < 1) return null;
  let params = params_query(query);
  return params;
  // let store = params['store'];
  // console.log('nstore', store);
  // return store;
}

// https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
function params_query(query) {
  // eg. query='abc=foo&def=%5Basf%5D&xyz=5'
  // params={abc: "foo", def: "[asf]", xyz: "5"}
  const urlParams = new URLSearchParams(query);
  const params = Object.fromEntries(urlParams);
  return params;
}

// prevent_scrolling(); !!@ Not used
// https://alvarotrigo.com/blog/prevent-scroll-on-scrollable-element-js/
function prevent_scrolling() {
  document.querySelector('body').addEventListener('wheel', preventScroll, { passive: false });
  function preventScroll(e) {
    console.log('preventScroll');
    e.preventDefault();
    e.stopPropagation();
    return false;
  }
}
// localStorage.clear()

// https://www.buildingh.org

// https://editor.p5js.org/jht9629-nyu/sketches/MbS5C3j-F
// Necessary-forgery-timed-drawing

// convert to my.
// startTimedDraw as slider changes
// added a_drawings
// generalize draw_to
// remove class Point, use object literal for point
// added funtion lineFrom

// project files created with p5.vscode "Create p5.js Project"
// https://editor.p5js.org/jht9629-nyu/sketches/-t2O5JfBr
// timed-drawing
// !!@ p5.js/0.10.2

// TRY: use storeItem / getItem to save drawing locally
// https://p5js.org/reference/#/p5/storeItem
// https://p5js.org/reference/#/p5/getItem

// Code! Programming with p5.js
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/beginners/p5js/7.3-array-of-objects.html
// https://youtu.be/fBqaA7zRO58
// https://editor.p5js.org/codingtrain/sketches/1y_xfueO
