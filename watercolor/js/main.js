function deform (polygon, nDeform, chunkiness, maskFraction) {

  // defaults: chunkiness of 1 starts getting *zany*, but 1.5 looks
  // pretty cool. Once it starts getting up there (~5), then it's
  // basically the original shape.
  chunkiness = (typeof chunkiness !== 'undefined') ?  chunkiness : 1.5;

  // fraction of the width of the polygon to use as the clipping
  // circle radius (makes stuff slow when it gets high since it scales
  // quadratically)
  maskFraction = (typeof maskFraction !== 'undefined') ?  maskFraction : 10;

  // radius to use for texture circles
  var radius = (polygon.bounds.right - polygon.bounds.left) / maskFraction;

  // functions to generate texture circle center points
  var ux = d3.randomUniform(
    polygon.bounds.left - radius,
    polygon.bounds.right + radius
  );
  var uy = d3.randomUniform(
    polygon.bounds.bottom - radius,
    polygon.bounds.top + radius
  );

  // each run through this loop subdivides every edge
  _.each(_.range(nDeform), function (index) {

    // start with the first curve in the polygon
    var curve = polygon.firstCurve;
    _.each(_.range(polygon.curves.length), function (index) {

      // add a new segment half way through (this returns the new curve)
      var second = curve.divideAtTime(0.5)

      // determines how many standard deviations (in units of lengths
      // of the new segment) to jitter the new middle point
      var fd = d3.randomNormal(0, second.length / chunkiness);
      second.point1.x += fd();
      second.point1.y += fd();

      // now set `curve` to be the next curve in the sequence (TODO:
      // there must be a better way to do this than with this hack
      // inside of a for loop)
      curve = second.next;
    });

    // make a bunch of circles in a group
    var circleGroup = new Group();
    _.each(_.range(maskFraction * maskFraction), function (index) {
      circleGroup.addChild(new Path.Circle({
        center: [ux(), uy()],
        radius: radius,
      }));
    });

    // use the group of circles to clip the polygon
    var group = new Group(circleGroup, polygon);
    group.clipped = true;

  });
}

function randomColor() {
  var rgb = _.map(chroma.random().rgb(), function (value) {
    return value / 255;
  });
  return new Color(rgb[0], rgb[1], rgb[2]);
}

var nLayers = 42;
var nSides = 7;
var opacity = 1 / (nLayers + 1);
var blend = 'lighten';
var nPoints = 5;
var hiddenRadius = 600;

var pointList = [];
_.each(_.range(1), function (i) {
  var x = 0.5 * view.bounds.width * (1 - 2 * Math.random());
  var y = 0.5 * view.bounds.height * (1 - 2 * Math.random());
  var p = new Point(x, y);
  pointList.push(p);
});

var pointList = _.map(_.range(nPoints), function (i) {
  var angle = i * (2 * Math.PI / nPoints);
  var r = 2 * Math.PI * hiddenRadius / nPoints;
  console.log(r, angle);
  return new Point((0.25 * r * (1 + 3 * Math.random())) * Math.cos(angle), (0.25 * r * (1 + 3 * Math.random())) * Math.sin(angle));
});

// var pointList = [
//   new Point(-radius * 0.5 * (1 + Math.random()), 0),
//   new Point(radius * 0.5 * (1 + Math.random()), 0),
//   new Point(0, radius),
//   new Point(300, -100),
//   new Point(-300, -100),
// ]
console.log(pointList)
var basePolygons = _.map(pointList, function (offset) {
  var radius = 2 * hiddenRadius * Math.sin(Math.PI / nPoints)
  // var radius = 10;
  var result = new Path.RegularPolygon({
    center: view.center + offset,
    sides: nSides,
    radius: radius,
    opacity: opacity,
    blendMode: blend,
    fillColor: randomColor()
  });
  deform(result, 1, 1.5, 0.25);
  return result;
})

_.each(_.range(nLayers * basePolygons.length), function (index) {
  var i = index % basePolygons.length;
  deform(basePolygons[i].clone(), 4, 1.5, 5);
});

// var logo = project.importSVG('js/IDEO_LOGO_2014_FINAL-white.svg', function (item) {
//   item.position = view.center;
// });
