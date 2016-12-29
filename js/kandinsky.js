// http://www.wassilykandinsky.net/work-247.php
function redrawKandinsky () {
  var SVG_ID = '#kandinsky-canvas'
  var N_X = 11
  var N_Y = 11
  var DELTA = 0.1
  var N_LINES = 5
  var P_CIRCLE = 0.2
  
  // make an svg with a viewbox
  var s = makeSVG(SVG_ID, N_X, N_Y)

  var big_stroke_width = 0.5
  var big_r = N_X / 2 - 0.5
  s.rect(-1, -1, N_X + 2, N_Y + 2).attr({
    stroke: 'none',
    fill: Snap.rgb(230, 220, 210),
    style: 'mix-blend-mode: darken'
  })
  var light1 = s.rect(-N_X / 2, N_Y / 2, 2 * N_X, 2).attr({
    stroke: 'none',
    fill: chroma.random(),
    style: 'mix-blend-mode: darken'
  })
  light1.transform(
    Snap.format('r{angle},{x_center},{y_center}', {
      angle: 360 * Math.random(),
      x_center: N_X / 2,
      y_center: N_Y / 2
    })
  )
  var light1 = s.rect(-N_X / 2, N_Y / 2, 2 * N_X, 2).attr({
    stroke: 'none',
    fill: chroma.random(),
    style: 'mix-blend-mode: darken'
  })
  light1.transform(
    Snap.format('r{angle},{x_center},{y_center}', {
      angle: 360 * Math.random(),
      x_center: N_X / 2,
      y_center: N_Y / 2
    })
  )
  
  s.circle(N_X / 2, N_Y / 2, big_r).attr({
    stroke: Snap.rgb(25, 35, 45),
    fill: 'none',
    strokeWidth: big_stroke_width
  })
  
  var N_CIRCLES = 15
  var n_circles = 0
  while (n_circles < N_CIRCLES) {
    var color = chroma.random().hex()
    var x = 2 + (N_X - 4) * Math.random()
    var y = 2 + (N_Y - 4) * Math.random()
    var r = Math.pow(2 * Math.random(), 1)
    var dx = (x - N_X / 2)
    var dy = (y - N_Y / 2)
    var dr = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
    if (dr + r < (big_r - big_stroke_width)) {
      s.circle(x, y, r).attr({
        stroke: 'none',
        fill: color,
        style: 'mix-blend-mode: darken'
      })
      n_circles += 1
    }
  }

  var N_LINES = 5
  var n_lines = 0
  while (n_lines < N_LINES) {
    var x1 = 2 + (N_X - 4) * Math.random()
    var y1 = 2 + (N_Y - 4) * Math.random()
    var x2 = 2 + (N_X - 4) * Math.random()
    var y2 = 2 + (N_Y - 4) * Math.random()
    var dx = x2 - x1
    var dy = y2 - y1
    var dr = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
    if (dr > N_X / 2) {
      var strokeWidth = 0.01 + 0.09 * Math.random()
      s.line(x1, y1, x2, y2).attr({
        stroke: 'black',
        strokeWidth: strokeWidth
      })
      n_lines += 1
    }
  }

  var N_LINES = 5
  var n_lines = 0
  while (n_lines < N_LINES) {
    var x1 = 2 + (N_X - 4) * Math.random()
    var y1 = 2 + (N_Y - 4) * Math.random()
    var x2 = 2 + (N_X - 4) * Math.random()
    var y2 = 2 + (N_Y - 4) * Math.random()
    var dx = x2 - x1
    var dy = y2 - y1
    var dr = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
    if (dr < N_X / 3) {
      var strokeWidth = 0.005 + 0.015 * Math.random()
      s.line(x1, y1, x2, y2).attr({
        stroke: 'black',
        strokeWidth: strokeWidth
      })
      n_lines += 1
    }
  }
  
}
redrawKandinsky()
