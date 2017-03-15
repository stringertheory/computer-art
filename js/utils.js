var FRAME_FACTOR = 20

function makeSVG(id, n_x, n_y) {
  var s = Snap(id)
  s.clear()
  var frame = (n_x + 1) / (FRAME_FACTOR + 1)
  s.attr({
    width: 400,
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
  if (svg_id[0] === '#') {
    var svg_id = svg_id.split('#')[1];
  }
  var svg = document.getElementById(svg_id);
  svg.toDataURL("image/png", {
    callback : function(data) {
      var image = data.replace("image/png", "image/octet-stream");
      var a = document.createElement('a');
      var hash = md5(image).substring(0, 6)
      a.download = 'computer-art-' + svg_id.split('-')[0] + '-' + hash + '.png';
      console.log(a.download);
      a.href = image
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  });
}

function jitter(amount) {
  return amount * (Math.random() - 0.5);
}
