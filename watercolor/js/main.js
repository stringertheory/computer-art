function deform (polygon, nDeform) {
  var ux = d3.randomUniform(polygon.bounds.left - 40, polygon.bounds.right + 40);
  var uy = d3.randomUniform(polygon.bounds.bottom - 40, polygon.bounds.top + 40);
  _.each(_.range(nDeform), function (index) {
    var curve = polygon.firstCurve;
    _.each(_.range(polygon.curves.length), function (index) {
      var second = curve.divideAtTime(0.5)
      var fd = d3.randomNormal(0, second.length / 2);
      second.point1.x += fd();
      second.point1.y += fd();
      curve = second.next;
    });

    var circleGroup = new Group();
    _.each(_.range(100), function (index) {
      circleGroup.addChild(new Path.Circle({
        center: [ux(), uy()],
        radius: 40,
        strokeColor: 'black'
      }));
    });

    var group = new Group(circleGroup, polygon);
    group.clipped = true;

  });
}

var blend = 'color';
var basePolygon = new Path.RegularPolygon({
  center: view.center,
  sides: 8,
  radius: 200,
  fillColor: new Color(0.85, 0.05, 0.10)
});
basePolygon.opacity = 0.05;
basePolygon.blendMode = blend;
deform(basePolygon, 3)

var basePolygon2 = new Path.RegularPolygon({
  center: view.center + new Point(200, 0),
  sides: 8,
  radius: 200,
  fillColor: new Color(0.05, 0.35, 0.95)
});
basePolygon2.opacity = 0.05;
basePolygon2.blendMode = blend;
deform(basePolygon2, 3)

var basePolygon3 = new Path.RegularPolygon({
  center: view.center + new Point(100, 150),
  sides: 8,
  radius: 200,
  fillColor: new Color(0.9, 0.9, 0.9)
});
basePolygon3.opacity = 0.05;
basePolygon3.blendMode = blend;
deform(basePolygon3, 3)

var bases = [
  basePolygon,
  basePolygon2,
  basePolygon3
];

_.each(_.range(75), function (index) {
  var i = index % bases.length;
  deform(bases[i].clone(), 3);
});
