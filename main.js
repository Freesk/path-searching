var CELL_SIDE = 38;
var BORDER_THICKNESS = 1;
var CELL_STEP = CELL_SIDE + BORDER_THICKNESS * 2;
var ACTIVE_CELL_COLOR = "#C2FFA3";
var INACTIVE_CELL_COLOR = "#7A6935";
var PLAYER_COLOR = "#F3D921";
var ENEMY_COLOR = "#2196F3";
var PLAYER_SPEED = 0.25;
var ENEMY_SPEED = 0.3;
var activeCells = [];
var enemy;
var player;
var target;
var keyCode;
var keyIsPressed = false;
var isGameOver = false;

var map = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1],
  [1, 0, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 1],
  [1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1],
  [1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1],
  [1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1],
  [1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1],
  [1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1, 1],
  [1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

function Person(params){
  return this.init(params);
}

Person.prototype.init = function(params){
  this.div = document.createElement('div');
  this.x = params.x;
  this.y = params.y;
  this.isAnimated = false;
  this.div.style.position = "absolute";
  this.div.style.left = params.x + 'px';
  this.div.style.top = params.y + 'px';
  this.div.style.width = CELL_STEP + "px";
  this.div.style.height = CELL_STEP + "px";
  this.div.style.borderRadius = "50%";
  this.div.style.backgroundColor = params.color;
  document.body.appendChild(this.div);
  this.div.appendChild(createEye({x:10, y:10}));
  this.div.appendChild(createEye({x:27, y:10}));
}

function createEye(params){
  var eye = document.createElement('div');
  eye.style.position = "absolute";
  eye.style.left = params.x + 'px';
  eye.style.top = params.y + 'px';
  eye.style.width = 4 + "px";
  eye.style.height = 4 + "px";
  eye.style.borderRadius = "50%";
  eye.style.backgroundColor = "#000";
  return eye;
}

function init() {

  drawTheMap();

  player = new Person({
    x: activeCells[activeCells.length-1].x,
    y: activeCells[activeCells.length-1].y,
    color: PLAYER_COLOR
  });

  enemy = new Person({
    x: activeCells[0].x,
    y: activeCells[0].y,
    color: ENEMY_COLOR
  });

  window.addEventListener("keydown", keyDown);
  window.addEventListener("keyup", keyUp);

  target = activeCells[activeCells.length-1];

  alert("Use keyboard arrows to move the orange ball. Run!")

  calculateThePath();
}

function gameOver(){
  isGameOver = true;
  window.removeEventListener("keydown", keyDown);
  window.removeEventListener("keyup", keyUp);
  alert("GAME OVER");
}

function keyDown(e) {
  keyCode = e.keyIdentifier;
  if(!keyIsPressed) checkTheKeyEvents();
  keyIsPressed = true;
}

function keyUp(e) {
  keyIsPressed = false;
  keyCode = undefined;
}

function checkTheKeyEvents(){

  if(isGameOver) return;

  if(!(keyCode === "Left" || keyCode === "Right" || keyCode === "Up" || keyCode === "Down")) {
    keyIsPressed = false;
    return;
  }

  if(player.isAnimated) return;
  player.isAnimated = true;

  var currentX = player.x;
  var currentY = player.y;
  var obj;

  if(keyCode === "Left") {
    obj = { x:currentX - CELL_STEP, y:currentY, deg:270 };
  }
  else if(keyCode === "Right") {
    obj = { x:currentX + CELL_STEP, y:currentY, deg:90 };
  }
  else if(keyCode === "Up") {
    obj = { x:currentX, y:currentY - CELL_STEP, deg:0 };
  }
  else if(keyCode === "Down") {
    obj = { x:currentX, y:currentY + CELL_STEP, deg:180 };
  }

  animateThePlayer(obj);

}

function animateThePlayer(params) {

  function isActiveCell(element, index, array) {
    return element.x === params.x && element.y === params.y
  }

  var nextStep = activeCells.find(isActiveCell);

  if(!nextStep) {
    player.isAnimated = false;
    keyUp();
    return;
  }

  target = nextStep;
  player.x = nextStep.x;
  player.y = nextStep.y;

  TweenMax.to(player.div, PLAYER_SPEED, {left:params.x, top:params.y, ease:Power0.easeNone, rotation:params.deg+"_short", overwrite:0, onComplete:function(){
    player.isAnimated = false;
    checkTheKeyEvents();
  }});

}

function drawTheMap() {
  for (var a = 0; a < map.length; a++) {
    for (var b = 0; b < map[a].length; b++) {
      var position = {
        x: CELL_STEP * b,
        y: CELL_STEP * a
      };
      map[a][b] === 1 ? new Rectangle(position) : new ActiveRectangle(position);
    }
  }
}

function Rectangle(params) {
  this.color = INACTIVE_CELL_COLOR;
  this.init(params);
}

Rectangle.prototype.init = function(params) {
  this.x = params.x;
  this.y = params.y;
  this.div = document.createElement('div');
  this.div.style.width = CELL_SIDE + "px";
  this.div.style.height = CELL_SIDE + "px";
  this.div.style.backgroundColor = this.color;
  this.div.style.position = "absolute";
  this.div.style.border = BORDER_THICKNESS+"px solid #ffffff";
  this.div.style.top = params.y + "px";
  this.div.style.left = params.x + "px";
  document.body.appendChild(this.div);
}

function ActiveRectangle(params) {
  this.color = ACTIVE_CELL_COLOR;
  this.init(params);
  activeCells.push(this);
}

ActiveRectangle.prototype = Object.create(Rectangle.prototype);

function calculateThePath() {

  if(isGameOver) return;

  var cellsList = activeCells.slice();
  var counter = 0;
  var steps = [];
  var cells = [];
  var path = [];

  loop();
  buildThePath();
  animateTheEnemy();

  function animateTheEnemy(){
    var list = path.reverse();
    var item = list[0];
    var angle;

    if(item.x === player.x && item.y === player.y) gameOver();

    if((enemy.x - CELL_STEP) === item.x) angle = 270;
    else if((enemy.x + CELL_STEP) === item.x) angle = 90;
    else if((enemy.y - CELL_STEP) === item.y) angle = 0;
    else if((enemy.y + CELL_STEP) === item.y) angle = 180;

    TweenMax.to(enemy.div, ENEMY_SPEED, {left:item.x, top:item.y, rotation:angle+"_short", ease:Power0.easeNone, overwrite:0, onComplete:function(){
      enemy.x = item.x;
      enemy.y = item.y;
      calculateThePath();
    }});
  }

  function buildThePath() {
    var currentCell;
    var testList = sortCells(cells);
    var counter = cellsList.length;

    path.push(testList[testList.indexOf(target)]);
    currentCell = path[0];

    loop();

    function loop(){
      for (var i = 0; i < testList.length; i++) {
        var cell = testList[i];
        if(cell.id+1 === currentCell.id && match(cell, currentCell)) {
          path.push(cell);
          currentCell = cell;
        }
      }

      if((currentCell.x === enemy.x && currentCell.y === enemy.y) || counter < 1) return;

      counter--;
      loop();
    }
  }

  function removeFromList(step) {
    for (var i = 0; i < cellsList.length; i++) {
      if(cellsList[i] === step) cellsList.splice(i, 1);
    }
  }

  function loop() {

    if(cellsList.length === 0) return;

    for (var i = 0; i < cellsList.length; i++) {
      var step = cellsList[i];
      steps[counter] = steps[counter] || [];

      if (steps.length <= 1 ) {
        if (match(step, enemy)) pushElem(step);
      }
      else {
        for (var a = 0; a < steps[counter-1].length; a++) {
          if (match(step, steps[counter-1][a])) pushElem(step);
        }
      }
    }

    for (var b = 0; b < steps[counter].length; b++) {
      removeFromList(steps[counter][b]);
    }

    counter++;
    loop();

  }

  function pushElem(step){
    steps[counter].push(step);
    cells.push(step);
    step.id = counter;
  }

  function match(step, target) {
    if (step.x === target.x && step.y === target.y) return false;
    return (
      (step.x === target.x && (step.y === target.y + CELL_STEP || step.y === target.y - CELL_STEP)) ||
      (step.x === target.x + CELL_STEP && step.y === target.y) ||
      (step.x === target.x - CELL_STEP && step.y === target.y)
    );
  }

}

function sortCells(arr) {
  return arr.sort(function(a, b){
    var keyA = a.id,
        keyB = b.id;
    if(keyA < keyB) return 1;
    if(keyA > keyB) return -1;
    return 0;
  });
}

window.addEventListener("load", init);
