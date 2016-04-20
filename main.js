var CELL_SIDE = 38;
var BORDER_THICKNESS = 1;
var CELL_STEP = CELL_SIDE + BORDER_THICKNESS * 2;
var ACTIVE_CELL_COLOR = "#C2FFA3";
var INACTIVE_CELL_COLOR = "#7A6935";
var PLAYER_COLOR = "#F3D921";
var ENEMY_COLOR = "#2196F3";
var PLAYER_SPEED = 0.3;
var ENEMY_SPEED = 0.3;
var PLAYER_INTERVAL_VAL = 400;
var ENEMY_INTERVAL_VAL = 500;
var activeCells = [];
var enemy;
var player;
var currentTarget;
var firstMove = true;
var target;
var keyCode;
var interval1;
var interval2;

var map = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1],
  [1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1],
  [1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1, 1],
  [1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

function Person(params){
  return this.init(params);
}

Person.prototype.init = function(params){
  this.div = document.createElement('div');
  this.x = params.x;
  this.y = params.y;
  this.div.style.position = "absolute";
  this.div.style.left = params.x + 'px';
  this.div.style.top = params.y + 'px';
  this.div.style.width = CELL_STEP + "px";
  this.div.style.height = CELL_STEP + "px";
  this.div.style.borderRadius = "50%";
  this.div.style.backgroundColor = params.color;
  document.body.appendChild(this.div);
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

  interval1 = setInterval(calculateThePathTo, ENEMY_INTERVAL_VAL);
  interval2 = setInterval(checkTheKeyEvents, PLAYER_INTERVAL_VAL);
}

function gameOver(){
  clearInterval(interval1);
  clearInterval(interval2);
  window.removeEventListener("keydown", keyDown);
  window.removeEventListener("keyup", keyUp);
  alert("GAME OVER :(");
}

function keyDown(e) {
  keyCode = e.keyIdentifier;
}

function keyUp(e) {
  keyCode = undefined;
}

function checkTheKeyEvents(){

  if(!keyCode) return;

  var currentX = player.x;
  var currentY = player.y;
  var point;

  if(keyCode === "Left") {
    animateThePlayer({ x:currentX - CELL_STEP, y:currentY });
    return;
  }
  else if(keyCode === "Right") {
    animateThePlayer({ x:currentX + CELL_STEP, y:currentY });
    return;
  }
  else if(keyCode === "Up") {
    animateThePlayer({ x:currentX, y:currentY - CELL_STEP });
    return;
  }
  else if(keyCode === "Down") {
    animateThePlayer({ x:currentX, y:currentY + CELL_STEP });
    return;
  }
}

function animateThePlayer(points) {

  function isActiveCell(element, index, array) {
    return element.x === points.x && element.y === points.y
  }

  var nextStep = activeCells.find(isActiveCell);

  if(!nextStep) return;

  target = nextStep;
  firstMove = false;

  TweenMax.to(player.div, PLAYER_SPEED, {left:points.x, top:points.y, ease:Power0.easeNone, overwrite:0, onComplete:function(){
    player.x = points.x;
    player.y = points.y;
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
  var self = this;
  this.color = ACTIVE_CELL_COLOR;
  this.init(params);
  activeCells.push(this);
}

ActiveRectangle.prototype = Object.create(Rectangle.prototype);

function calculateThePathTo() {

  if(firstMove) return;

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
    if(item.x === player.x && item.y === player.y) {
      gameOver();
    }
    TweenMax.to(enemy.div, ENEMY_SPEED, {left:item.x, top:item.y, ease:Power0.easeNone, overwrite:0, onComplete:function(){
      enemy.x = item.x;
      enemy.y = item.y;
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
