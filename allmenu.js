var PFX = 'div_';
var lastobj;

function myclick(e) {
  var mysrc = e && e.target || window.event.srcElement;
  var obj = document.getElementById(PFX + mysrc.id)
  if (lastobj)
    lastobj.style.display = 'none';
  if (obj) {
    if (obj.style.display == 'none')
      obj.style.display = 'block'
    else
      obj.style.display = 'none';
    lastobj = obj;
    return false;
  }
}

document.onclick = myclick;
