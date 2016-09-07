var SVG_ID = '#canvas';
var N_X = 10;
var N_Y = 10;
var STROKE_WIDTH = 0.02;

function random_color() {
  var lightness = 0;
  return Snap.rgb(
    255 - lightness * Math.random(),
    255 - lightness * Math.random(),
    255 - lightness * Math.random()
  );
}

var s = Snap(SVG_ID);
s.attr({
  viewBox: Snap.format('-1 -1 {max_x} {max_y}', {
    max_x: N_X + 2,
    max_y: N_Y + 2
  })
});

var outer = s.rect(0, 0, N_X, N_Y).attr({
  stroke: 'black',
  strokeWidth: STROKE_WIDTH,
  fill: 'white'
});
var frame = s.rect(0, 0, N_X, N_Y).attr({
  stroke: 'black',
  strokeWidth: STROKE_WIDTH,
  fill: 'none'
});

var current_top = [[0, 0], [N_X, 0]];
var group = s.g();
_.each(_.range(1, N_Y), function (y) {
  var current_x = 0;
  var current_y = y + 0.4 * (Math.random() - 0.5);
  var current_bottom = [[current_x, current_y]];
  _.each(_.range(N_Y), function (i) {
    current_x += 1 + Math.random();
    current_y += 0.4 * (Math.random() - 0.5);
    current_bottom.push([current_x, current_y]);
  });
  var next_top = current_bottom.slice(0);
  current_bottom.reverse()
  group.add(s.polyline(current_top.concat(current_bottom)).attr({
    stroke: 'black',
    strokeWidth: STROKE_WIDTH,
    fill: random_color()
    // fill: 'none'
  }));
  current_top = next_top;
});
current_bottom = [[0, N_Y], [N_X, N_Y]];
current_bottom.reverse();
group.add(s.polyline(current_top.concat(current_bottom)).attr({
  stroke: 'black',
  strokeWidth: STROKE_WIDTH,
  fill: random_color()
  // fill: 'none'
}));

console.log(group);
group.attr({mask: outer});
var group2 = group.clone();

_.each(_.range(N_Y), function (y) {
  var bbox = group[y].getBBox();
  var v_group = s.g();
  _.each(_.range(N_X), function (x) {
    if (Math.random() < 0.15) {
      _.each(_.range(20), function (i) {
	v_group.add(s.line(x + Math.random(), bbox.y, x + Math.random(), bbox.y2).attr({
	  stroke: 'black',
	  strokeWidth: STROKE_WIDTH
	}));
      });
    } else if (Math.random() < 0.15) {
      _.each(_.range(20), function (i) {
	var x0 = x + Math.random()
	v_group.add(s.line(x0, bbox.y, x0, bbox.y2).attr({
	  stroke: 'black',
	  strokeWidth: STROKE_WIDTH
	}));
      });
    }
  });
  v_group.attr({mask: group[y]});
});

_.each(_.range(1, N_Y), function (y) {
  _.each(_.range(1, N_X), function (x) {
    if (Math.random() < 0.1) {
      s.circle(x, y, Math.random()).attr({
	stroke: 'black',
	strokeWidth: STROKE_WIDTH,
	fill: 'none'
      });
    }    
  });
});
