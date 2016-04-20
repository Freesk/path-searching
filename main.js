var CELL_SIDE = 38;
var BORDER_THICK = 1;
var CELL_STEP = CELL_SIDE + BORDER_THICK * 2;
var ACTIVE_CELL_COLOR = "#C2FFA3";
var INACTIVE_CELL_COLOR = "#7A6935";
var MARKED_CELL_COLOR = "rgb(126, 228, 74)";
var RED_CELL_COLOR = "#FF2F00";
var activeCells = [];
var person;
var currentTarget;
var isComplete = true;
var tl = new TimelineLite({onComplete:function(){ isComplete = true }});

var map = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
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

function init() {

  drawTheMap();

  person = document.createElement('div');

  person.x = activeCells[0].x;
  person.y = activeCells[0].y;

  person.style.position = "absolute";
  person.style.left = activeCells[0].x + 'px';
  person.style.top = activeCells[0].y + 'px';
  person.style.width = CELL_STEP + "px";
  person.style.height = CELL_STEP + "px";
  person.style.borderRadius = "50%";
  person.style.backgroundColor = "#2196F3";

  document.body.appendChild(person);
}

function drawTheMap() {
  for (var a = 0; a < map.length; a++) {
    for (var b = 0; b < map[a].length; b++) {
      var position = {
        x: CELL_STEP * a,
        y: CELL_STEP * b
      };
      map[a][b] === 1 ? new Rectangle(position) : new ActiveRectangle(position);
    }
  }
}

function Rectangle(params) {
  // console.log('static rect');
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
  this.div.style.border = BORDER_THICK+"px solid #ffffff";
  this.div.style.top = params.x + "px";
  this.div.style.left = params.y + "px";
  document.body.appendChild(this.div);
}

function ActiveRectangle(params) {
  // console.log('active rect');
  var self = this;
  this.color = ACTIVE_CELL_COLOR;
  this.init(params);
  this.div.addEventListener("click", function(){
    calculateThePathTo(self);
  });
  activeCells.push(this);
}

ActiveRectangle.prototype = Object.create(Rectangle.prototype);

function calculateThePathTo(target) {

  if (target !== currentTarget) {
    if(currentTarget) currentTarget.div.style.backgroundColor = ACTIVE_CELL_COLOR;
    target.div.style.backgroundColor = RED_CELL_COLOR;
    currentTarget = target;
  }

  var cellsList = activeCells.slice();
  var counter = 0;
  var steps = [];
  var cells = [];
  var path = [];

  loop();
  buildAPath();
  //colorThePath();
  animateThePerson();

  // TweenLite.ticker.addEventListener("tick", function(){
  //   console.log(person.x+"/"+person.y);
  // });

  function animateThePerson(){
    tl.clear();
    var list = path.reverse();
    for(var i = 0; i < list.length; i++) tl.add(returnNewMove(list[i]));
    function returnNewMove(item){
      return TweenMax.to(person, 0.15, {left:item.y, top:item.x, ease:Power0.easeNone, overwrite:0, onComplete:function(){
        person.x = item.x;
        person.y = item.y;
      }});
    }
  }

  function colorThePath() {
    var list = []
    for (var i = 0; i < path.length; i++) list.push(path[i].div);
    list = list.reverse();
    list.splice(list.length-1, 1);
    TweenMax.staggerTo(list, 1, {backgroundColor:MARKED_CELL_COLOR, repeat:1, yoyo:true, ease:Power3.easeOut}, 0.05);
  }

  function buildAPath() {
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

      if((currentCell.x === person.x && currentCell.y === person.y) || counter < 1) return;

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

      steps[counter] =  steps[counter] || [];

      // first run
      if (steps.length <= 1 ) {
        if (match(step, person)) pushElem(step);
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
    if(step.x === target.x && step.y === target.y) return;
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
