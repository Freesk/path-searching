
var PLAYER_COLOR = "#F3D921";
var ENEMY_COLOR = "#2196F3";
var ACTIVE_CELL_COLOR = "#C2FFA3";
var INACTIVE_CELL_COLOR = "#7A6935";
var BORDER_COLOR = '#C2FFA3';
var PLAYER_SPEED = 0.25;
var ENEMY_SPEED = 0.3;
var CELL_WIDTH = 40;

var activeCells = [];
var liveObjects = [];
var enemy;
var player;
var target;
var keyCode;
var isGameOver = false;
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
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
  liveObjects.push(this);
  return this.init(params);
}

Person.prototype = Object.create(GameObject.prototype);

Person.prototype.init = function(params) {
  this.x = params.x;
  this.y = params.y;
  this.isAnimated = false;
  this.foo = function() {
    ctx.strokeStyle = "#fff";
    ctx.beginPath();
    ctx.arc(CELL_WIDTH/2,CELL_WIDTH/2,CELL_WIDTH/2,0,2*Math.PI);
    ctx.fillStyle = params.color;
    ctx.stroke();
    ctx.fill();
  }
  this.draw();
}

TweenLite.ticker.addEventListener("tick", mianLoop);

function moveLiveObjects() {
  if(liveObjects.length <= 0) return;
  liveObjects.map(function(object){
    object.draw();
  });
}

function mianLoop() {
  ctx.clearRect(0, 0, width, height);
  moveLiveObjects();
}

function init() {

  document.getElementsByTagName('body')[0].appendChild(canvas);

  console.log(map);

  width = map[0].length * CELL_WIDTH;
  height = map.length * CELL_WIDTH;

  console.log(width + ":" + height);

  canvas.width = width;
  canvas.height = height;

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
  if(player.isAnimated) return;
  if(!(keyCode === "Left" || keyCode === "Right" || keyCode === "Up" || keyCode === "Down")) return;
  checkTheKeyEvents();
}

function keyUp(e) {
  keyCode = undefined;
}

function checkTheKeyEvents(){

  if(isGameOver) return;

  var currentX = player.x;
  var currentY = player.y;
  var obj;

  if(keyCode === "Left") {
    obj = { x:currentX - CELL_WIDTH, y:currentY, deg:270 };
  }
  else if(keyCode === "Right") {
    obj = { x:currentX + CELL_WIDTH, y:currentY, deg:90 };
  }
  else if(keyCode === "Up") {
    obj = { x:currentX, y:currentY - CELL_WIDTH, deg:0 };
  }
  else if(keyCode === "Down") {
    obj = { x:currentX, y:currentY + CELL_WIDTH, deg:180 };
  }

  animateThePlayer(obj);

}

function animateThePlayer(params) {

  if(!params) return;

  function isActiveCell(element, index, array) {
    return element.x === params.x && element.y === params.y;
  }

  var nextStep = activeCells.find(isActiveCell);

  if(!nextStep) return;

  target = nextStep;

  moveCharacter({
    character:player,
    speed:PLAYER_SPEED,
    x:params.x,
    y:params.y,
    deg:params.deg
  }, checkTheKeyEvents);

}

function drawTheMap() {
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
  liveObjects.push(this);
  this.foo = function() {
    ctx.strokeStyle = BORDER_COLOR;
    ctx.beginPath();
    ctx.rect(0, 0, 150, 100);
    ctx.fillStyle = this.color;
    ctx.stroke();
    ctx.fill();
  }
}

function ActiveRectangle(params) {
  this.color = ACTIVE_CELL_COLOR;
  this.init(params);
  this.draw();
  activeCells.push(this);
}

ActiveRectangle.prototype = Object.create(Rectangle.prototype);

function moveCharacter(params, callback) {
  params.character.isAnimated = true;
  TweenMax.to(params.character, params.speed, {
    x:params.x,
    y:params.y,
    // rotation:params.deg+"_short",
    ease:Power0.easeNone,
    overwrite:0,
    onComplete:function(){
      params.character.isAnimated = false;
      params.character.x = params.x;
      params.character.y = params.y;
      callback();
    }
  });
}

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
    var deg;

    if(item.x === player.x && item.y === player.y) gameOver();

    if((enemy.x - CELL_WIDTH) === item.x) deg = 270;
    else if((enemy.x + CELL_WIDTH) === item.x) deg = 90;
    else if((enemy.y - CELL_WIDTH) === item.y) deg = 0;
    else if((enemy.y + CELL_WIDTH) === item.y) deg = 180;

    moveCharacter({
      character:enemy,
      speed:ENEMY_SPEED,
      x:item.x,
      y:item.y,
      deg:deg
    }, calculateThePath);
  }

  function buildThePath() {
    var currentCell;
    var testList = sortCells(cells); // sort by step number
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
      (step.x === target.x && (step.y === target.y + CELL_WIDTH || step.y === target.y - CELL_WIDTH)) ||
      (step.x === target.x + CELL_WIDTH && step.y === target.y) ||
      (step.x === target.x - CELL_WIDTH && step.y === target.y)
    );
  }

}

function sortCells(arr) { // sort by step number
  return arr.sort(function(a, b){
    var keyA = a.id,
        keyB = b.id;
    if(keyA < keyB) return 1;
    if(keyA > keyB) return -1;
    return 0;
  });
}

window.addEventListener("load", init);
