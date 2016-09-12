var FRAME_FACTOR = 20

function makeSVG(id, n_x, n_y) {
  var s = Snap(id)
  s.clear()
  var frame = (n_x + 1) / (FRAME_FACTOR + 1)
  s.attr({
    viewBox: Snap.format('{min_x} {min_y} {width} {height}', {
      min_x: 0 - frame,
      min_y: 0 - frame,
      width: n_x + 2 * frame,
      height: n_y + 2 * frame
    })
  })
  return s
}
