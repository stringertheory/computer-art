function redrawQuilt () {
  var SVG_ID = '#quilt-canvas'
  var N_X = 31
  var N_Y = 31
  var STROKE_WIDTH = 0.0
  var WHITE = '#ffffff'
  
  // make an svg with a viewbox
  var s = makeSVG(SVG_ID, N_X, N_Y)
  var colors = _.map(_.range(20), function (i) {
    return chroma.random().hex()

    // return Snap.rgb(Math.random() * 255, Math.random() * 255, Math.random() * 255)
  })
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
      var clipper = s.rect(x + 0.0, y + 0.0, 1 - 0.0, 1 - 0.0)
      // var clipper = s.circle(x + 0.5, y + 0.5, 0.5)
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
