var PLAYER_COLOR = "#F3D921";
var ENEMY_COLOR = "#2196F3";
var ACTIVE_CELL_COLOR = "#C2FFA3";
var INACTIVE_CELL_COLOR = "#7A6935";
var BORDER_COLOR = '#C2FFA3';
var PLAYER_SPEED = 0.25;
var ENEMY_SPEED = 0.3;
var CELL_WIDTH = 40;

var activeCells = [];
var objectsArr = [];
var enemy;
var player;
var target;
var keyCode;
var isGameOver = false;
var canvas;
var ctx;
var width;
var height;

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

function GameObject() {}

GameObject.prototype.init = function() {
  this.x = 0;
  this.y = 0;
}

GameObject.prototype.draw = function() {
  ctx.save();
  ctx.translate(this.x, this.y);
  this.foo();
  ctx.restore();
}

function Person(params){
  objectsArr.push(this);
  return this.init(params);
}

Person.prototype = Object.create(GameObject.prototype);

Person.prototype.init = function(params) {
  this.x = params.x;
  this.y = params.y;
  this.angle = params.angle;
  this.speed = params.speed;
  this.isAnimated = false;
  this.foo = function() {
    ctx.translate(CELL_WIDTH/2, CELL_WIDTH/2);
    ctx.strokeStyle = "#fff";
    ctx.beginPath();
    ctx.arc(0, 0, CELL_WIDTH/2, 0, 2 * Math.PI);
    ctx.fillStyle = params.color;
    ctx.stroke();
    ctx.fill();
  }
  this.draw();
}

Person.prototype.move = function(params) {
  var that = this;
  var callback = params.callback || function() {};
  that.isAnimated = true;
  TweenMax.to(that, that.speed, {
    x: params.x,
    y: params.y,
    ease: Power0.easeNone,
    onComplete:function(){
      that.isAnimated = false;
      that.x = params.x;
      that.y = params.y;
      callback();
    }
  });
}

function drawObjects() {
  if(objectsArr.length <= 0) return;
  objectsArr.map(function(object){
    object.draw();
  });
}

function init() {
  canvas = document.createElement('canvas');
  canvas.width = width = map[0].length * CELL_WIDTH;
  canvas.height = height = map.length * CELL_WIDTH;
  document.getElementsByTagName('body')[0].appendChild(canvas);
  ctx = canvas.getContext('2d');

  createMapObjects();

  var playerInitialPosition = activeCells[activeCells.length-1];

  player = new Person({
    x: playerInitialPosition.x,
    y: playerInitialPosition.y,
    color: PLAYER_COLOR,
    speed: PLAYER_SPEED
  });

  enemy = new Person({
    x: activeCells[0].x,
    y: activeCells[0].y,
    color: ENEMY_COLOR,
    speed: ENEMY_SPEED
  });

  window.addEventListener("keydown", keyDown);
  window.addEventListener("keyup", keyUp);
  TweenLite.ticker.addEventListener("tick", mianLoop);

  target = playerInitialPosition;

  alert("Use keyboard arrows to move the orange ball. Run!")

  calculateThePath();
}

function mianLoop() {
  ctx.clearRect(0, 0, width, height);
  drawObjects();
  checkTheKeyEvent();
}

function gameOver(){
  isGameOver = true;
  window.removeEventListener("keydown", keyDown);
  window.removeEventListener("keyup", keyUp);
  keyUp();
  alert("GAME OVER");
  enemy.move({
    x: player.x,
    y: player.y,
    callback: killTheLoop
  });
}

function killTheLoop() {
  TweenLite.ticker.removeEventListener("tick", mianLoop);
}

function keyDown(e) {
  keyCode = e.keyIdentifier;
  if(['Left', 'Right', 'Up', 'Down'].indexOf(keyCode) < 0) return;
  checkTheKeyEvent();
}

function keyUp(e) {
  keyCode = undefined;
}

function checkTheKeyEvent(){
  if(!keyCode) return;
  var currentX = player.x;
  var currentY = player.y;
  var nextX;
  var nextY;
  if(keyCode === "Left") {
    nextX = currentX - CELL_WIDTH;
    nextY = currentY;
  } else if(keyCode === "Right") {
    nextX = currentX + CELL_WIDTH;
    nextY = currentY;
  } else if(keyCode === "Up") {
    nextX = currentX;
    nextY = currentY - CELL_WIDTH;
  } else if(keyCode === "Down") {
    nextX = currentX;
    nextY = currentY + CELL_WIDTH;
  }
  animateThePlayer({ x:nextX, y:nextY });
}

function animateThePlayer(nextPosition) {
  if(!nextPosition) return;
  var nextStep = activeCells.find(function(item){
    return isTheSamePosition(item, nextPosition);
  });
  if(!nextStep) return;
  // point enemy to this position
  target = nextStep;
  player.move({
    x: nextStep.x,
    y: nextStep.y,
    callback:animateThePlayer
  });
}

function createMapObjects() {
  for (var a = 0; a < map.length; a++) {
    for (var b = 0; b < map[a].length; b++) {
      var position = { x: CELL_WIDTH * b, y: CELL_WIDTH * a };
      map[a][b] ? new Rectangle(position) : new ActiveRectangle(position);
    }
  }
}

Rectangle.prototype = Object.create(GameObject.prototype);

function Rectangle(params) {
  this.color = INACTIVE_CELL_COLOR;
  this.init(params);
  this.draw();
}

Rectangle.prototype.init = function(params) {
  this.x = params.x;
  this.y = params.y;
  this.foo = function() {
    ctx.strokeStyle = BORDER_COLOR;
    ctx.beginPath();
    ctx.rect(0, 0, 150, 100);
    ctx.fillStyle = this.color;
    ctx.stroke();
    ctx.fill();
  }
  objectsArr.push(this);
}

function ActiveRectangle(params) {
  this.color = ACTIVE_CELL_COLOR;
  this.init(params);
  this.draw();
  activeCells.push(this);
}

ActiveRectangle.prototype = Object.create(Rectangle.prototype);

function calculateThePath() {

  if(isGameOver) return;

  // create a copy of activeCells
  var cellsList = activeCells.slice();
  var counter = 0;
  var steps = [];
  var cells = [];
  var path = [];
  var step;

  while(cellsList.length !== 0) {
    for (var i = 0; i < cellsList.length; i++) {
      step = cellsList[i];
      steps[counter] = steps[counter] || [];
      if (steps.length <= 1 ) {
        if (checkIfCanGoThere(step, enemy)) pushElem(step);
      } else {
        for (var a = 0; a < steps[counter-1].length; a++) {
          if (checkIfCanGoThere(step, steps[counter-1][a])) pushElem(step);
        }
      }
    }

    // Remvoe from the to do list
    steps[counter].map(function(item){
      for(var i = 0; i < cellsList.length; i++)
        if(item === cellsList[i]) cellsList.splice(i, 1);
    });

    counter++;
  }

  buildThePath();
  animateTheEnemy();

  function animateTheEnemy(){
    var nextStep = path[path.length-1];
    if(isTheSamePosition(nextStep, player)) gameOver();
    enemy.move({
      x: nextStep.x,
      y: nextStep.y,
      callback: calculateThePath
    });
  }

  function buildThePath() {
    var currentCell;
    // sort by step number
    var testList = sortCells(cells);
    var counter = cellsList.length;
    var testCell;

    // push the last elemnt
    path.push(testList[testList.indexOf(target)]);

    currentCell = path[0];

    while(true) {
      for(var i = 0; i < testList.length; i++) {
        testCell = testList[i];
        if(testCell.id + 1 === currentCell.id && checkIfCanGoThere(testCell, currentCell)) {
          path.push(testCell);
          currentCell = testCell;
        }
      }
      if(isTheSamePosition(currentCell, enemy) || counter < 1) break;
      counter--;
    }
  }

  function pushElem(step){
    steps[counter].push(step);
    cells.push(step);
    step.id = counter;
  }

}

function isTheSamePosition(pos1, pos2) {
  return pos1.x === pos2.x && pos1.y === pos2.y;
}

// return true if available for the next step
function checkIfCanGoThere(currentStep, nextStep) {
  // maybe usefull?
  // if (isTheSamePosition(currentStep, nextStep)) return false;
  return (
    (currentStep.x == nextStep.x && (currentStep.y == nextStep.y + CELL_WIDTH || currentStep.y === nextStep.y - CELL_WIDTH)) ||
    (currentStep.x == nextStep.x + CELL_WIDTH && currentStep.y == nextStep.y) ||
    (currentStep.x == nextStep.x - CELL_WIDTH && currentStep.y == nextStep.y)
  );
}

// sort by step number
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
