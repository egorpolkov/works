// draw bounds
/*
 
 ?test if apple in snake
 set canvas bounds of whole shapes
 text with clean screen
 
 
 
*/

var XBOUND; // = 20;
var YBOUND; // = 20; 
var SHIFT = 1; // 40   
var MYSIZE = 45; // 30; // 15


var clrSOME = '#933';
var clrTAIL = 'lightgray'; //'#666';
var clrHEAD = 'darkgray'; //'#000';
var clrAPPLE = 'red'; // '#933'
var clrFIELD = 'white';

var msize2 = MYSIZE * 2;

var canvas;
var ctx;
var intervalID;

function finish(t) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font="30px Arial";
  ctx.fillText(t, canvas.width / 2, canvas.height / 2);
  clearInterval(intervalID);

  // strokeText
  
    // alert(t);
    // location.reload(); 
}

function setApple(a) {
  var appx = (Math.random() * (XBOUND - 1) + 0 | 0) + 1;
  var appy = (Math.random() * (YBOUND - 1) + 0 | 0) + 1;
  console.log('appx, appy:', appx, appy);
  //  var apple = {'x': appx, 'y': appy};  // -1
  a.x = appx;
  a.y = appy;
}

function myarc(x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke(); 
}

var lastlink;

function update(direction, snake, apple) {
  var eaten = false;
  var gameover = false;
  var prev = snake[0];
  var current  = {'x': snake[0].x + direction.x, 'y': snake[0].y + direction.y};
  if ((current.x <= 0) || (current.y <= 0) || (current.x >= XBOUND) || (current.y >= YBOUND) ) {
//  if ((current.x < 0) || (current.y < 0) || (current.x >= XBOUND) || (current.y >= YBOUND) ) {
    finish('OOPS! with ' + snake.length);
  }
/*
  if ((snake[0].x < 0) || (snake[0].y < 0) || (snake[0].x > XBOUND) || (snake[0].y > YBOUND) ) {
    alert('OOPS!');
    location.reload(); 
  }
*/
  if (current.x === XBOUND) 
    current.x = 0;
  if (current.x === -1)
    current.x = XBOUND - 1;
  if (current.y === YBOUND)
    current.y = 0;
  if (current.y === -1)
    current.y = YBOUND - 1;
  snake[0] = current;
  if (snake[0].x === apple.x && snake[0].y === apple.y)
    eaten = true;
  for (var i = 1, len = snake.length; i < len; i++)
    if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) 
      gameover = true;
  for (var i = 1, len = snake.length; i < len; i++) {
    current = snake[i];
    snake[i] = prev;
    prev = current; 
    // zzz
    lastlink = prev;
  }
  if (eaten) {
    snake.push(current);
    var inside;
    do {
      inside = false;
/*      
      apple.x = (Math.random() * (XBOUND - 1) | 0) + 1;
      apple.y = (Math.random() * (YBOUND - 1) | 0) + 1;  // -1
      console.log('appx, appy:', apple.x, apple.y);
*/      
      setApple(apple);

      for (var i = 0, len = snake.length; i < len; i++)
        if (apple.x === snake[i].x && apple.y === snake[i].y) 
          inside = true;
      if (inside)
        console.log('inside: ', apple.x, apple.y);
    } while (inside)
    
  }
  if (gameover) {
    finish('OOPS!!! with ' + snake.length);
  }
};

function drawn(ctx, snake, apple) {
  ctx.beginPath();
  for (var i = 0, len = snake.length; i < 2; i++) 
  {
    //var i = 0;
    var link = snake[i];
    ctx.fillStyle = (i === 0) ? clrHEAD : clrTAIL;
    ctx.strokeStyle = ctx.fillStyle;
    myarc(link.x * msize2, link.y * msize2, MYSIZE); 
  }
  {
    i = snake.length - 1;  // ??
    link = lastlink;
    ctx.fillStyle = clrFIELD; // clrAPPLE; // clrFIELD;
    // ctx.fillStyle = (i === 0) ? clrFIELD : clrTAIL;
    ctx.strokeStyle = ctx.fillStyle;
    myarc(link.x * msize2, link.y * msize2, MYSIZE+1); 
  }
  ctx.fillStyle = clrAPPLE; // '#933';
  ctx.strokeStyle = clrAPPLE; // '#933';
  ctx.moveTo(apple.x * msize2, apple.y * msize2);
  myarc(apple.x * msize2, apple.y * msize2, MYSIZE - 1);
  //ctx.fillRect(apple.x * 32, apple.y * 32, 32, 32);
  ctx.stroke(); 
};

function draw1(ctx, snake, apple) {
  ctx.beginPath();
  for (var i = 0, len = snake.length; i < len; i++) 
  {
    ctx.fillStyle = (i === 0) ? clrFIELD : clrTAIL;
    ctx.strokeStyle = ctx.fillStyle;
    myarc(snake[i].x * msize2, snake[i].y * msize2, MYSIZE); 
  }
  ctx.fillStyle = clrAPPLE; 
  ctx.strokeStyle = clrAPPLE; 
  myarc(apple.x * msize2, apple.y * msize2, MYSIZE - 1);
  ctx.stroke(); 
};

function main () {
  canvas = document.getElementById('snake');
  var width = (window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth) - SHIFT;
  var height = (window.innerHeight
    || document.documentElement.clientHeight
    || document.body.clientHeight) - SHIFT;  
  width -= width % (MYSIZE * 2);
  height -= height % (MYSIZE * 2);
  
  canvas.width  = width; //1024; //480; 
  canvas.height = height; //700; //320;

  ctx = canvas.getContext('2d');

  XBOUND = width / MYSIZE / 2;
  YBOUND = height / MYSIZE / 2; 
 
  var snake = [{'x': 5, 'y': 3}, {'x': 4, 'y': 3}, {'x': 3, 'y': 3}];
  var direction = {'x': 1, 'y': 0};
  
  console.log('w h xbound ybound:', width, height, XBOUND, YBOUND);
 /*  
  var appx = (Math.random() * (XBOUND - 1) + 0 | 0) + 1;
  var appy = (Math.random() * (YBOUND - 1) + 0 | 0) + 1;
  console.log('appx, appy:', appx, appy);
  var apple = {'x': appx, 'y': appy};  // -1
  // var apple = {'x': (Math.random() * XBOUND + 1) | 0, 'y': (Math.random() * YBOUND + 1) | 0};  // -1
  // alert('GET READY!');
*/  
  var apple = {'x': 0, 'y': 0};  
  setApple(apple);
  
  
  draw1(ctx, snake, apple);
/*
  ctx.fillStyle = clGROUND;
  ctx.fillRect(0, 0, width, height);
*/
  intervalID = setInterval(function () {
      // ctx.clearRect(0, 0, canvas.width, canvas.height);
      update(direction, snake, apple);
      drawn(ctx, snake, apple);
    }, 1000 / 4);

    // zzz
  var KLEFT, KRIGHT, KUP, KDOWN;

  document.onkeydown = function (event) {
        if (event.keyCode === 37)
    if (direction.x !==  1) direction = {'x': -1, 'y': 0};
        if (event.keyCode === 38)
    if (direction.y !==  1) direction = {'x': 0, 'y': -1};
        if (event.keyCode === 39)
    if (direction.x !== -1) direction = {'x': 1, 'y': 0};
        if (event.keyCode === 40)
    if (direction.y !== -1) direction = {'x': 0, 'y': 1};
  };
}

window.onload = main();
