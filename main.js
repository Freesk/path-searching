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
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
var width;
var height;
var playerMovement;

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
  this.angle = 0;
  this.speed = params.speed;
  this.isAnimated = false;
  this.foo = function() {

    var canvas1 = document.createElement('canvas');
    canvas1.width = CELL_WIDTH;
    canvas1.height = CELL_WIDTH;
    var ctx2 = canvas1.getContext('2d');
    ctx2.save();
    ctx2.translate(CELL_WIDTH/2, CELL_WIDTH/2);
    ctx2.rotate(this.angle * Math.PI/180);
    ctx2.strokeStyle = "#fff";
    ctx2.beginPath();
    ctx2.arc(0, 0, CELL_WIDTH/2, 0*Math.PI, 1*Math.PI);
    ctx2.fillStyle = params.color;
    ctx2.stroke();
    ctx2.fill();
    ctx2.restore();

    var canvas2 = document.createElement('canvas');
    canvas2.width = CELL_WIDTH;
    canvas2.height = CELL_WIDTH;
    var ctx3 = canvas2.getContext('2d');
    ctx3.save();
    ctx3.translate(CELL_WIDTH/2, CELL_WIDTH/2);
    ctx3.rotate(this.angle * Math.PI/180);
    ctx3.strokeStyle = "#fff";
    ctx3.beginPath();
    ctx3.arc(0, 0, CELL_WIDTH/2, 0.5*Math.PI, 1.5*Math.PI);
    ctx3.fillStyle = params.color;
    ctx3.stroke();
    ctx3.fill();
    ctx3.restore();

    ctx.drawImage(canvas1, 0, 0);
    ctx.drawImage(canvas2, 0, 0);

  }
  this.draw();
}

Person.prototype.move = function(params) {
  var that = this;
  var callback = params.callback || function() {};
  var degShift = 45;
  that.isAnimated = true;
  TweenMax.to(that, that.speed, {
    x:params.x,
    y:params.y,
    angle:params.deg + degShift + "_short",
    ease:Power0.easeNone,
    overwrite:0,
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
  document.getElementsByTagName('body')[0].appendChild(canvas);

  canvas.width = width = map[0].length * CELL_WIDTH;
  canvas.height = height = map.length * CELL_WIDTH;

  drawTheMap();

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

  animateThePlayer();
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
  TweenLite.ticker.removeEventListener("tick", mianLoop);
  alert("GAME OVER");
}

function keyDown(e) {
  keyCode = e.keyIdentifier;
  if(['Left', 'Right', 'Up', 'Down'].indexOf(keyCode) < 0) return;
  checkTheKeyEvent();
}

function keyUp(e) {
  keyCode = undefined;
  playerMovement = undefined;
}

function checkTheKeyEvent(){
  var currentX = player.x;
  var currentY = player.y;
  if(keyCode === "Left") {
    playerMovement = { x:currentX - CELL_WIDTH, y:currentY, deg:270 };
  } else if(keyCode === "Right") {
    playerMovement = { x:currentX + CELL_WIDTH, y:currentY, deg:90 };
  } else if(keyCode === "Up") {
    playerMovement = { x:currentX, y:currentY - CELL_WIDTH, deg:0 };
  } else if(keyCode === "Down") {
    playerMovement = { x:currentX, y:currentY + CELL_WIDTH, deg:180 };
  }
  animateThePlayer();
}

function animateThePlayer() {

  if(!playerMovement) return;

  function isActiveCell(element) {
    return isTheSamePosition(element, playerMovement);
  }

  var nextStep = activeCells.find(isActiveCell);
  if(!nextStep) return;

  target = nextStep;

  player.move({
    x: playerMovement.x,
    y: playerMovement.y,
    deg: playerMovement.deg,
    callback:animateThePlayer
  });
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

  var cellsList = activeCells.slice(); // create a copy of activeCells
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
    var list = path.reverse();
    var item = list[0];
    var deg;

    if(isTheSamePosition(item, player)) gameOver();

    if     ((enemy.x - CELL_WIDTH) === item.x) deg = 270;
    else if((enemy.x + CELL_WIDTH) === item.x) deg = 90;
    else if((enemy.y - CELL_WIDTH) === item.y) deg = 0;
    else if((enemy.y + CELL_WIDTH) === item.y) deg = 180;

    enemy.move({
      x: item.x,
      y: item.y,
      deg: deg,
      callback: calculateThePath
    });

  }

  function buildThePath() {
    var currentCell;
    var testList = sortCells(cells); // sort by step number
    var counter = cellsList.length;
    var testCell;

    path.push(testList[testList.indexOf(target)]); // push the last elemnt

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

function isTheSamePosition(object1, object2) {
  return object1.x === object2.x && object1.y === object2.y;
}

function checkIfCanGoThere(step, target) { // return true if available for the next step
  if (isTheSamePosition(step, target)) return false;
  return (
    (step.x === target.x && (step.y === target.y + CELL_WIDTH || step.y === target.y - CELL_WIDTH)) ||
    (step.x === target.x + CELL_WIDTH && step.y === target.y) ||
    (step.x === target.x - CELL_WIDTH && step.y === target.y)
  );
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
