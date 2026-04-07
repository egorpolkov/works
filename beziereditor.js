/* 
 * Canvas curves example
 *
 * By Craig Buckler,    http://twitter.com/craigbuckler
 * of OptimalWorks.net    http://optimalworks.net/
 * for SitePoint.com    http://sitepoint.com/
 * 
 * Refer to:
 * http://blogs.sitepoint.com/html5-canvas-draw-quadratic-curves/
 * http://blogs.sitepoint.com/html5-canvas-draw-bezier-curves/
 *
 * This code can be used without restriction. 
 */

 
(function() {

  var canvas, ctx, code, point, style, drag = null, dPoint;

  // define initial points
  function Init() {

    point = {
      p1: { x:100, y:250, color: "red"},
      p2: { x:400, y:250, color: "yellow"},
      p3: { x:109, y:259, color: "green"},
      p4: { x:409, y:259, color: "indigo"} 
    };
    
    
    point.cp1 = { x: 150, y: 100, color: "orange" };
    point.cp2 = { x: 350, y: 100, color: "orange" };
    point.cp3 = { x: 159, y: 109, color: "blue" };
    point.cp4 = { x: 359, y: 109, color: "blue" };
    
    

// +++
    var par = location.search.substring(1);
    if (par) {
      var num = +par;
      if ((num >= 0) && (num <= 9)) {
        point.p1.x = points[num][0];
        point.p1.y = points[num][1];
        point.cp1.x = points[num][2];
        point.cp1.y = points[num][3];
        point.cp2.x = points[num][4];
        point.cp2.y = points[num][5];
        point.p2.x = points[num][6];
        point.p2.y = points[num][7];

        point.p3.x = points[num][8];
        point.p3.y = points[num][9];
        point.cp3.x = points[num][10];
        point.cp3.y = points[num][11];
        point.cp4.x = points[num][12];
        point.cp4.y = points[num][13];
        point.p4.x = points[num][14];
        point.p4.y = points[num][15];
      } 
    }
    myborder = {
      x: 120, y: 100, wi: 120, he: 200, 
      xx: 120, yy: 176, ww: 240, hh: 300,
      color: "555", linewidth: 1
    }
// ...    

    // default styles
    style = {
      curve:  { width: 6, color: "#333" },
      cpline: { width: 1, color: "#C00" },
      point:  { radius: 5, width: 2, color: "#900", fill: "rgba(200,200,200,0.5)", arc1: 0, arc2: 2 * Math.PI },
      curve1:  { width: 6, strokeStyle: "red" }, //"#f00"
      curve2:  { width: 6, strokeStyle: "indigo" }, //"#00f"
      cpline1: { width: 1, color: "#C00" },
      cpline2: { width: 1, color: "#00C" },
    
    }
    
    // line style defaults
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // event handlers
    canvas.onmousedown = DragStart;
    canvas.onmousemove = Dragging;
    canvas.onmouseup = canvas.onmouseout = DragEnd;
    
    DrawCanvas();
  }
  
  
  // draw canvas
  function DrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

//
    ctx.beginPath();
    ctx.lineWidth = myborder.linewidth;
    ctx.strokeStyle = myborder.color;
    ctx.strokeRect(myborder.x, myborder.y, myborder.wi, myborder.he);
    ctx.moveTo(myborder.xx, myborder.yy);
    ctx.lineTo(myborder.ww, myborder.yy);
//    ctx.lineTo(300, 400);
//    ctx.strokeRect(myborder.xx, myborder.yy, myborder.ww, myborder.hh);
    ctx.stroke(); // ???
//
    
    // control lines
    ctx.lineWidth = style.cpline.width;
    if (point.cp2) {
      ctx.strokeStyle = style.cpline1.color;
      ctx.beginPath();
      ctx.moveTo(point.p1.x, point.p1.y);
      ctx.lineTo(point.cp1.x, point.cp1.y);
      ctx.moveTo(point.p2.x, point.p2.y);
      ctx.lineTo(point.cp2.x, point.cp2.y);
      ctx.stroke();

      ctx.strokeStyle = style.cpline2.color;
      ctx.beginPath();
      ctx.moveTo(point.p3.x, point.p3.y);
      ctx.lineTo(point.cp3.x, point.cp3.y);
      ctx.moveTo(point.p4.x, point.p4.y);
      ctx.lineTo(point.cp4.x, point.cp4.y);
      ctx.stroke();
    }
    
    // curve
    ctx.lineWidth = style.curve.width;
  //  ctx.moveTo(point.p1.x, point.p1.y);
    if (point.cp2) {
      ctx.strokeStyle = style.curve.color;
      ctx.beginPath();
      ctx.strokeStyle = style.curve1.strokeStyle;
      ctx.moveTo(point.p1.x, point.p1.y);
      ctx.bezierCurveTo(point.cp1.x, point.cp1.y, point.cp2.x, point.cp2.y, point.p2.x, point.p2.y);
      ctx.stroke();
      
      ctx.strokeStyle = style.curve2.strokeStyle;
      ctx.beginPath();
      ctx.moveTo(point.p3.x, point.p3.y);
      ctx.bezierCurveTo(point.cp3.x, point.cp3.y, point.cp4.x, point.cp4.y, point.p4.x, point.p4.y);
      ctx.stroke();
    }

    // control points
    for (var p in point) {
      ctx.lineWidth = style.point.width;
      ctx.strokeStyle = point[p].color; //style.point.color;
      ctx.fillStyle = point[p].color; // style.point.fill;
      ctx.beginPath();
      ctx.arc(point[p].x, point[p].y, style.point.radius, style.point.arc1, style.point.arc2, true);
      ctx.fill();
      ctx.stroke();
    }


    
    ShowCode();
  }
  
  
  // show canvas code
  function ShowCode() {
    if (code) {
      code.firstChild.nodeValue = 
/* */
      "canvas = document.getElementById(\"canvas\");\n"+
        "ctx = canvas.getContext(\"2d\")\n"+
        "ctx.lineWidth = " + style.curve.width +
        ";\nctx.strokeStyle = \"" + style.curve.color +
        "\";\nctx.beginPath();\n" +
        "ctx.moveTo(" + point.p1.x + ", " + point.p1.y +");\n" +
        (point.cp2 ? 
          "ctx.bezierCurveTo("+point.cp1.x+", "+point.cp1.y+", "+point.cp2.x+", "+point.cp2.y+", "+point.p2.x+", "+point.p2.y+");" :
          "ctx.quadraticCurveTo("+point.cp1.x+", "+point.cp1.y+", "+point.p2.x+", "+point.p2.y+");"
        ) +
        "\nctx.stroke();"
        +
/* */        
        "\n" + "[" + 
         point.p1.x + ", " + point.p1.y + ", " + 
         point.cp1.x+", "+point.cp1.y+", "+point.cp2.x+", "+point.cp2.y+", "+point.p2.x+", "+point.p2.y +   
         ",   " +
         point.p3.x + ", " + point.p3.y + ", " + 
         point.cp3.x+", "+point.cp3.y+", "+point.cp4.x+", "+point.cp4.y+", "+point.p4.x+", "+point.p4.y +   
         
         "],"
      ;
    }
  }
  
  
  // start dragging
  function DragStart(e) {
    e = MousePos(e);
    var dx, dy;
    for (var p in point) {
      dx = point[p].x - e.x;
      dy = point[p].y - e.y;
      if ((dx * dx) + (dy * dy) < style.point.radius * style.point.radius) {
        drag = p;
        dPoint = e;
        canvas.style.cursor = "move";
        return;
      }
    }
  }
  
  
  // dragging
  function Dragging(e) {
    if (drag) {
      e = MousePos(e);
      point[drag].x += e.x - dPoint.x;
      point[drag].y += e.y - dPoint.y;
      dPoint = e;
      DrawCanvas();
    }
  }
  
  
  // end dragging
  function DragEnd(e) {
    drag = null;
    canvas.style.cursor = "default";
    DrawCanvas();
  }

  
  // event parser
  function MousePos(event) {
    event = (event ? event : window.event);
    return {
      x: event.pageX - canvas.offsetLeft,
      y: event.pageY - canvas.offsetTop
    }
  }
  
  
  // start
  canvas = document.getElementById("canvas");
  code = document.getElementById("code");
  if (canvas.getContext) {
    ctx = canvas.getContext("2d");
    Init();
  }
  
})();

 
