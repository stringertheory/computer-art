var FRAME_FACTOR = 20

function makeSVG(id, n_x, n_y) {
  var s = Snap(id)
  s.clear()
  var frame = (n_x + 1) / (FRAME_FACTOR + 1)
  s.attr({
    width: 350,
    viewBox: Snap.format('{min_x} {min_y} {width} {height}', {
      min_x: 0 - frame,
      min_y: 0 - frame,
      width: n_x + 2 * frame,
      height: n_y + 2 * frame
    })
  })
  return s
}

function makePNG(svg_id) {
  var svg = document.getElementById(svg_id);
  svg.toDataURL("image/png", {
    callback : function(data) {
      var image = data.replace("image/png", "image/octet-stream");
      var a = document.createElement('a');
      var hash = md5(image).substring(0, 6)
      a.download = svg_id.split('-')[0] + '-' + hash + '.png';
      a.href = image
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  });
}
