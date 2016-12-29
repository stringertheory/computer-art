function convertToPath(points) {
  var path = '';
  _.each(points, function (point, index) {
    var x = point[0]
    var y = point[1]
    if (index === 0) {
      path += 'M' + x + ',' + y + ' R'
    } else if (index === points.length - 1) {
      path += x + ',' + y
    } else {
      path += x + ',' + y + ','
    }
  })
  return path;
}


// http://www.wassilykandinsky.net/work-247.php
function redrawRand () {
  var SVG_ID = '#rand-canvas'
  var N_X = 40
  var N_Y = N_X * (Math.sqrt(5) + 1) / 2
  var DELTA = 0.1
  var N_LINES = 5
  var P_CIRCLE = 0.2
  
  // make an svg with a viewbox
  var s = makeSVG(SVG_ID, N_X, N_Y)

  var bgColor = Snap.rgb(25, 25, 25)
  s.rect(-1, -1, N_X + 2, N_Y + 2).attr({
    stroke: 'none',
    fill: bgColor
  })

  var text = 'Hello'
  var xText = 1 + (N_X - 2) * Math.random()
  var yText = 1 + (N_Y - 2) * Math.random()
  console.log(xText, yText)
  s.text(xText, yText, text).attr({
    fill: Snap.rgb(230, 230, 230),
    'font-size': 1,
    'font-family': 'Adelle Sans'
  })

  _.each(_.range(4, 40), function (y) {
  var sigPoints = []
  var charX = N_X - 6
  var charY = y
  _.each(_.range(5), function () {
    _.each(_.range(5), function () {
      var x = charX + Math.random()
      var y = charY + Math.random()
      sigPoints.push([x, y])
    })
    charX += 1
  })
  var path = convertToPath(sigPoints)
  console.log(path)
  var sig = s.path(path).attr({
      fill: 'none',
      stroke: 'white',
      strokeWidth: 0.05
    })
  console.log('a', Snap.path.toCubic(path))
  })
  var sigPoints = []
  var charX = N_X - 6
  var charY = N_Y - 2
  _.each(_.range(5), function () {
    _.each(_.range(5), function () {
      var x = charX + Math.random()
      var y = charY + Math.random()
      sigPoints.push([x, y])
    })
    charX += 1
  })
  var path = convertToPath(sigPoints)
  console.log(path)
  var sig = s.path(path).attr({
      fill: 'none',
      stroke: 'white',
      strokeWidth: 0.05
    })
  console.log('a', Snap.path.toCubic(path))
  
  var total_area = N_X * N_Y
  var circle_area = 0
  var N_CIRCLES = 21
  var n_circles = 0
  while (n_circles < N_CIRCLES) {
    var color = chroma.random().hex()
    var x = 1 + (N_X - 2) * Math.random()
    var y = 1 + (N_Y - 2) * Math.random()
    var r = 0.5
    if (true) {
      s.circle(x, y, r).attr({
        stroke: 'none',
        fill: color,
        // style: 'mix-blend-mode: lighten'
      })
      n_circles += 1
    }
  }

  
}
redrawRand()
