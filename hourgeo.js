/*
  
0,0   +--> x
      |
    y V    MAX_X, MAX_Y

0,0   +--> c
      |
    r V    MAXR, MAXC

*/
window.onload = (function () {


  var MYBACK = "white";
  var MYBLACK = "black";
  var MYTHIN = 2;
  var MYTHICK = 4;
  //var SHIFT = 20;    
  var XSTART = -180;  // DEBUG -> 0
  var YSTART = -80;  // DEBUG -> 0
  var DIGITWIDTH = 100;
  var POINTSWIDTH = 50;
  var SECOND = 1000;
  var SMOOTHES = 10;
  //  var MYX = 180, Y = 90, 
  var MYWIDTH = 670, MYHEIGHT = 220;
  var MAILHEIGHT = 20;

  var MYFORE = "darkgray"; 
 // if (DEBUG)    MYFORE = "black"; 


  var Delta = 250; // 200; // 250

  var dBegin;

  var dPause;
  var bTimer = true;
  var bPause = false;
  var tid;

  var bHourglass = true;

  var randomSand = ['O', 'G', 'C', 'S', 'Q'];
  // var randomSand = ["G", "B", "N", "P", "X"];
  // 0, 1, 2, 3
  var clrSand = ['Black', 'Silver', 'DarkGray', 'Grey'];


  var AIR = '_'; // ' ';
  var HOLE = '.';
  var SAND = 'o';
  var DRUM = 20; // 10;  //2; 

  var MAXC = 30; //25; // 5
  var MAXR = MAXC + DRUM;

  const ARCSIZE = 2; //15;
  const CELLSIZE = ARCSIZE * 2 + 3; //

  var SHIFT = 20;
  var SHIFT2 = SHIFT / 2;
  
  var width = (window.innerWidth
      || document.documentElement.clientWidth
      || document.body.clientWidth) - SHIFT;

  var height = (window.innerHeight
      || document.documentElement.clientHeight
      || document.body.clientHeight) - SHIFT;  
  /*
    var dwidth = width - MYWIDTH;
    var dheight = height - MYHEIGHT;
    if (dwidth > 0) 
      XSTART += dwidth / 2;
    if (dheight > 0)
      YSTART += dheight / 2;
   */ 
/* */
  MAXC = Math.floor((width) / 2 / CELLSIZE) - 1;
  MAXR = Math.floor((height)  / 2 / CELLSIZE) - 1;
  DRUM = 0;
  if (MAXR > MAXC) {
    DRUM = MAXR - MAXC;
  }
  else {
    MAXC = MAXR;
  };
  

  var myTable;

  // zzz
  var gTable = new Array(MAXR*2+2);
  for (var i = 0; i < MAXR*2+2; ++i) 
    gTable[i] = new Array(MAXC*2+2);
  // zzz
  for (var i = 0; i < MAXR*2+2; ++i) 
    for (var j = 0; j < MAXC*2+2; ++j) 
      gTable[i][j] = AIR;


  function debug_gTable() {
  for (var i = 0; i < (MAXR*2+2); ++i) 
    for (var j = 0; j < (MAXC*2+2); ++j) 
      console.log('gTable[i][j]', i, j, gTable[i][j]) 
  }  

  // debug_gTable();

  document.onkeydown = mykey;
  //document.onload = mystart;

  var par = location.search.substring(1);

  if (par == 'timer') 
    bHourglass = false;


  
  
  var canvas = document.getElementById("canvas");
  var ctx;
  if (canvas) {
    canvas.width = width; 
    canvas.height = height; // - MAILHEIGHT;

    ctx = canvas.getContext("2d");
    ctx.lineWidth = MYTHIN; 
    ctx.strokeStyle = MYFORE;
  }

  var bInvert  = 0;

  if (bInvert) {
//    ctx.strokeStyle = "white";
    ctx.fillStyle = MYFORE; 
//    ctx.fillRect(0, 0, width, height);
  }
  else {
    ctx.fillStyle = MYBACK; 
  }
  ctx.beginPath();
  ctx.fillRect(0, 0, width, height);
  ctx.stroke();

  
  function myarc(y, x, r) {
    ctx.beginPath();
    if (ctx) {
      ctx.arc((x * CELLSIZE) + r + 0, (y * CELLSIZE) + r + 0, r, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    }
  }

  function mycell(y, x, r) {
    ctx.beginPath();
    if (ctx) {
      ctx.arc((x * CELLSIZE) + r + 0, (y * CELLSIZE) + r + 2, r, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = 'white'; // MYBACK; //clrSand[show]; //MYFORE;
      ctx.arc((x * CELLSIZE) + r + 1, (y * CELLSIZE) + r + 3, 1, 0, 2 * Math.PI); 
      ctx.fill();
      ctx.stroke();
    }
  }

/*
1  
document.getElementById('b').onclick = alert(32);
2
if (navigator.appName=="Microsoft Internet Explorer"){                                 
  document.getElementById('b').setAttribute("onclick", function(){alert('32');});             
}                                             
else                
  document.getElementById('b').setAttribute("onclick", 'alert("32");'); 
3
document.getElementById('b').addEventListener('click', "alert('32')"); 
*/

  function mykey(e) {
    var c;
    var cESC = 27;
    var cENTER = 13;
    var cSPACE = 32;
    var cTAB = 9;

    if (e) {
      c = e.which;
    }
    else if (window.event) {
      c = window.event.keyCode;
    }
    if (c == cSPACE) {
      bPause = !bPause;
      if (bPause) {
        dPause = new Date();
        myalert(' pause on ');
      }
      if (!bPause) {
        dPause = new Date() - dPause;
        myloop();
        myalert(' pause off ');
      }
    }
    if (c == cESC) {
      bTimer = !bTimer;
      if (bTimer) {
        myalert('');
        mystart();
      }
      if (!bTimer) {
        clearTimeout(tid);
        myalert(' timer off');
      }
    }
    if (c == cENTER) {
      mystart();
      myalert('')
    }
    if (c == cTAB) {
      bHourglass = !bHourglass;
      showHourglass(bHourglass)
    }
  }

  function showHourglass(b) {
  }

  function mypause() {
      bPause = !bPause;
      if (bPause) {
        dPause = new Date();
        myalert(' pause on ');
      }
      if (!bPause) {
        dPause = new Date() - dPause;
        myloop();
        myalert(' pause off ');
      }
  }

  function mystart() {
    dBegin = new Date();
    dPause = null;
    bTimer = true;
    bPause = false;
    if (bHourglass)  
      fillGlass();
  // zzz  myloop();
  }

  // ???
  function myloop() {
    if ((!bPause) && bTimer) {
      drawtime();
      if (bHourglass)  
        oneGrain();
      // ///   tid = setTimeout("myloop()", Delta);
      tid = setInterval("myloop()", Delta);
    }
  }

// ???
  function drawtime() {
    var d, x;
    var dNow = new Date();
    if (dPause){
      dBegin.setTime(dBegin.getTime() + dPause);
      dPause = null;
    }
    var t = Math.round((dNow.getTime() - dBegin.getTime()) / 1000);
    d = t % 60;
    x = (d < 10) ? '0' + d : d;
    t = (t - d) / 60;
    d = t % 60;
    x = ((d < 10) ? ('0' + d) : d) + ' : ' + x;
    t = (t - d) / 60;
    x = t + ' : ' + x;
  }

  function fillGlass() {
    var newRow;
    var newCell;
      for (y = 0; y <= MAXR * 2; y++) {
        for (x = 0; x <= MAXC * 2; x++) {
          if (inBottom(y, x)) {
            drawGCell(y, x);
          }
          if (inTop(y, x)){
            drawGCell(y, x, myrandom());          
          }
        }
      }
  }

  function oneGrain() {
    var e;
    var rb = 0;
  /*
  // get a sand from top !!
    var rt = 0;
    var ct = -1;
      for (rt = 0; rt <= MAXY; rt++) {
        var t = countBusy(rt);
        if (t > 0) {
          ct = getBusy(rt, t);
          break;
        }
      }
  */
  // get a sand from neck  !!
    var rt = MAXR;
    var ct = MAXC;
    if (isSand(rt, ct)) {
      var tt = gTable[rt][ct]; // myTable.rows[rt].cells[ct].innerHTML;
      for (rb = MAXR * 2; rb >= MAXR; rb--) {
        e = countEmpty(rb);
        if (e > 0) {
          var ra = Math.round(Math.random() * e);
          if (ra > 0)
            ra--;
          drawGCell(rt, ct);
          if (!dropGrain(rb, ra, tt)) {
            dropGrain(rb, ra, tt); // debug purposes
          }
          break;
        }
      }
    }
    var cstop;
   // var ct = -1;
    for (rt = 0; rt <= MAXR; rt++) {
      var t = countBusy(rt);
      if (t > 0) {
        ct = getBusy(rt, t);
        cstop = ct;
        break;
      }
    }
  /*
      for (rb = MAXY * 2; rb >= MAXY; rb--) {
        e = countEmpty(rb);
        if (e > 0) {
          var ran = Math.random();
          ra = Math.round(ran * e);
          if (ra > 0)
            ra--;
          if (ct >= 0 && e > 0) {
            break;
          }
        }
      }
   */
    // drop the rest of sands from neck to surface
    var rto = MAXR;
    var cto = MAXC;
    var cdelta = 0;
    if (cstop > MAXC)
      cdelta = 1;
    else if (cstop < MAXC)
      cdelta = -1;
    var cfrom = MAXC;
    for (var r = MAXR; r > 0; r--) {
      var rfrom = r - 1;
      if (cfrom != cstop)
        cfrom += cdelta;
      if (isHole(rfrom, cfrom))
        break;
      // zzz
      var tt = gTable[rfrom][cfrom];
      
      drawGCell(rfrom, cfrom);
      var ix = sandIndex(tt);
      drawGCell(rto, cto, ix);
      rto = rfrom;
      cto = cfrom;
    }
  }

  function countMates(r, c) {
    var n = 0;
    var b = -1;
    var e = 1;
    if (c == 0)
      b = 0;
    if (c == MAXC + MAXC)
      e = 0;
    for (var i = b; i <= e; i++)
      if (inTop(r, c + i))
        if (isSand(r, c + i))
          n++;
    return n;
  }

  function randomMate(r, c, n) {
    var b = -1;
    var e = 1;
    var dc = 0;
    var ran = Math.floor(Math.random() * n);

    if (n == 3) 
      if ((c < MAXC) && (ran == 1))
        ran = Math.floor(Math.random() * n);
      if ((c > MAXC) && (ran == -1))
        ran = Math.floor(Math.random() * n);
    // twice
    if (n == 3)
      if ((c < MAXC) && (ran == 1))
        ran = Math.floor(Math.random() * n);
      if ((c > MAXC) && (ran == -1))
        ran = Math.floor(Math.random() * n);
    if (c == 0)
      b = 0;
    if (c == MAXC + MAXC)
      e = 0;
    for (var i = b; i <= e; i++)
      if (inTop(r, c + i))
      if (isSand(r, c + i))
        if (dc == ran)
          break; 
        else
          dc++;
    return i; 
  }

  function countBusy(r) {
    var rc = 0;
    var m = rightBound(r);
    for (var c = leftBound(r); c <= m; c++)
      if (isSand(r, c))  
        rc++;
    return rc;
  }

  function getBusy(r, t) {
    var rc = 0;
    var m = rightBound(r);
    var ra = Math.round(Math.random() * t);
    for (var c = leftBound(r); c <= m; c++)
      if (isSand(r, c)) { 
        rc = c;
        if (ra-- == 0)
          break;
      }
    return rc;
  }

  function countEmpty(r) {
    var rc = 0;
    var c = MAXC;
    for (c = MAXC; c >= 0; c--) { 
      var x = c;
      var y = r - Math.round(c / 2) + Math.round(MAXC / 2);
      if (!inBottom(y, x))
        break;
      if (isHole(y, x))
        rc++;
      if (c < MAXC) {
        x = MAXC + (MAXC - x);
        if (isHole(y, x))
          rc++;
      }
    }
    return rc;
  }

  function sandIndex(t) {
    for (var i = 0; i < randomSand.length; i++)
      if (t == randomSand[i])
        break;
    return i;
  }

  function dropGrain(r, ra, t) { // row, random counter, text
    var done = 0;
    var y = r;
    var x = MAXC;
    var ix = sandIndex(t); 
    if (isHole(y, x)) {
      if (ra-- == 0) {
        drawGCell(y, x, ix);
        done++;
      }
    }
    if (done == 0)
      for (var c = MAXC - 1; c >= 0; c--) {
        x = c;
        y = r - Math.round(c / 2) + Math.round(MAXC / 2);
        if (!inBottom(y, x))
          break;
        if (isHole(y, x)) {
          if (ra-- == 0) {
            drawGCell(y, x, ix);
            done++;
          }
        }
        x = MAXC + (MAXC - x);
        if (isHole(y, x)) {
          if (ra-- == 0) {
            drawGCell(y, x, ix);
            done++;
          }
        }
      }
    return (done == 1);
  }

  function inTop(r, c) {
    var b = false;
    if (r <= DRUM) {
      if (c <= MAXC + MAXC) 
        b = true;
    }
    else {
      if (r <= MAXR) {
        if (c <= MAXC) {
          if (c >= r - DRUM)
            b = true;
        }
        if (c > MAXC) {
          if (MAXC + MAXC - c >= r - DRUM)
            b = true;
        }
      }
    }
    return b;
  }

  function inBottom(r, c) {
    var b = false;
    if ((c <= MAXC + MAXC) && (r <= MAXR + MAXR)) {
      if (r > MAXR + MAXR - DRUM) {
        if (c <= MAXC + MAXC) 
          b = true;
      }
      else {
        if (r >= MAXR && r <= MAXR * 2) {
          if (c <= MAXC) {
            if (MAXC + MAXC - c <= r - DRUM)
              b = true;
          }
          if (c >= MAXC) {
            if (c <= r - DRUM)
              b = true;
          }
        }
      }
    }
    return b;
  }

  function leftBound(r) {
    if (r <= DRUM)
      return 0;
    else if (r < MAXR)
      return r - DRUM;
    else {
      return (MAXR * 2 - r); // !!!
    }
  }

  function rightBound(r) {
    if (r <= DRUM)
      return (MAXC + MAXC);
    else if (r < MAXR)
      return (MAXC * 2 - r + DRUM);
    else {
      return r; // !!!
    }
  }

  function isSand(r, c) {
    return !isHole(r, c); 
  }

  function isHole(r, c) {
    return gTable[r][c] == HOLE || gTable[r][c] == AIR;
  }

  function drawCell(c, i) {
  }

  function myshow(show) {
    if (show >= 0) {
      ctx.strokeStyle = clrSand[show]; 
      ctx.fillStyle = clrSand[show];
      ctx.lineWidth = MYTHIN;
    }
    else {
      ctx.strokeStyle = MYBACK;
      ctx.fillStyle = MYBACK; 
      ctx.lineWidth = MYTHICK; // !! MYTHIN;
    }
  }

  function drawGCell(y, x, i) {
    if (i >= 0) {
      t = randomSand[i];
      gTable[y][x] = t;
      myshow(i);
      mycell(y, x, ARCSIZE);
    }
    else {
      t = HOLE;
      gTable[y][x] = t;
      myshow(-1);
      mycell(y, x, ARCSIZE);
    }
  }

  // ...


  function myrandom() {
    return Math.floor(Math.random() * 4); 
  }

  function myrandomc() {
    return Math.ceil(Math.random() * 4);
  }

  function myalert(a) {
    if (a == '')
      document.getElementById('e').innerHTML = a;
    else 
      document.getElementById('e').innerHTML += a + '<br/>';
  }

  function mybug(a) {
    //  myalert('!!! ' + a)
  }

  function bug(a, b) {
    return ' ' + a + ' : ' + b + ' '; 
  }

  function bug1(a) {
    return ' ' + a + ' ' ; 
  }

  function myerror(a) {
    alert(a)
  }

  mystart();

  setInterval(function() {
  if ((!bPause) && bTimer) {
    drawtime();
    if (bHourglass)  
      oneGrain();
  }}, Delta);

});