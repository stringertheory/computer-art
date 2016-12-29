function jitter(amount) {
  return amount * (Math.random() - 0.5);
}

function rando() {
  var h = 360 * Math.random();
  var c = 80 + 20 * Math.random()
  var l = 80 + 20 * Math.random()
  return chroma.hcl(h, c, l)
}

function compliment(color) {
  var h = color.hcl()[0] + 180
  var c = color.hcl()[1]
  var l = 0.5 * ((100 - color.hcl()[2]) + color.hcl()[2])
  return chroma.hcl(h, c, l).hex()
}

function redrawQuilt () {
  var SVG_ID = '#quilt-canvas'
  var N_X = 7
  var N_Y = 7
  var STROKE_WIDTH = 0.0
  var WHITE = '#ffffff'
  
  // make an svg with a viewbox
  var s = makeSVG(SVG_ID, N_X, N_Y)
  var color1 = rando()
  // var color1 = chroma('#ff0303')
  console.log(color1.hex(), compliment(color1))
  var colors = [
    color1.hex(),
    compliment(color1)
  ]
  // var colors = [
  //   chroma.blend('0000ff', '0000aa', 'multiply').hex(),
  //   chroma.blend('red', 'blue', 'darken').hex()
  // ]
  // var colors = _.map(_.range(2), function (i) {
  //   return rando();
  //   // return chroma.random().hex()
  //   // return Snap.rgb(Math.random() * 255, Math.random() * 255, Math.random() * 255)
  // })
  // var colors = _.map(chroma.scale([chroma.random(), chroma.random()]).colors(7), function (i) {
  //   return r
  // })
  console.log(colors)
  // var colors = [
  //   Snap.rgb(43, 188, 230),
  //   Snap.rgb(37, 165, 55),
  //   Snap.rgb(200, 200, 200),
  //   Snap.rgb(0, 0, 0),
  //   Snap.rgb(43, 188, 230),
  //   Snap.rgb(37, 165, 55),
  //   Snap.rgb(200, 200, 200),
  //   Snap.rgb(0, 0, 0)    
  // ]

  // s.rect(-1, -1, N_X + 2, N_Y + 2).attr({
  //   stroke: 'none',
  //   fill: Snap.rgb(0, 0, 0, 0.1)
  // })

  // _.each(_.range(N_X + 1), function (x) {
  //   _.each(_.range(N_Y + 1), function (y) {
  //     colors = _.shuffle(colors)
  //       s.rect(x - 0.5, y - 0.5, 1, 1).attr({
  //         fill: colors[0],
  //         stroke: 'none'
  //       })
  //   })
  // })
    
  // make a series of N_Y polygons with the irregular horizontal lines
  _.each(_.range(N_X), function (x) {
    _.each(_.range(N_Y), function (y) {


      colors = _.shuffle(colors)
      
      var group = s.g()
      
      _.each(colors, function (color, index) {
        group.add(s.rect(x - 0.5, y - 0.5, 2, 2 * (colors.length - index) / colors.length).attr({
          fill: color,
          stroke: 'none',
          strokeWidth: 0.02
        }))
      })
      var clipper = s.rect(x, y, 1, 1)
      // var clipper = s.circle(x + 0.5, y + 0.5, 0.5)
      // var a = 0;
      // var path = [
      //   [x - jitter(a), y - jitter(a)],
      //   [x + 1 + jitter(a), y - jitter(a)],
      //   [x + 1 + jitter(a), y + 1 + jitter(a)],
      //   [x - jitter(a), y + 1 + jitter(a)]
      // ]
      // var clipper = s.polyline(path)
      if (Math.random() < 1) {
        var angle = 360 * (Math.random() - 0.5)
        group.transform(
          Snap.format('r{angle},{x_center},{y_center}', {
            angle: angle,
            x_center: x + 0.5,
            y_center: y + 0.5
          })
        )
        clipper.transform(
          Snap.format('r{angle},{x_center},{y_center}', {
            angle: -angle,
            x_center: x + 0.5,
            y_center: y + 0.5
          })
        )
      }
      group.attr({
        clip: clipper
      })
    })
  })
}
redrawQuilt()
