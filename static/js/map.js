// http://build-failed.blogspot.com/2012/11/zoomable-image-with-leaflet.html
// http://gis.stackexchange.com/a/122181/82683
// http://stackoverflow.com/a/26762020/1431778
var BASE_OPACITY = 0.5
var HIGHLIGHT_OPACITY = 0.6
var COLOR_SCALE = chroma.scale(chroma.brewer.YlGnBu);

function t(mymap, x, y, width, height) {
  var scale = 2;
  var p0 = mymap.unproject([x / scale, (1024 - y) / scale], 1);
  var p1 = mymap.unproject([(x + width) / scale, (1024 - y - height) / scale], 1);
  var rect = L.rectangle([p0, p1]);
  rect.setStyle({
    stroke: false,
    fillOpacity: BASE_OPACITY,
  }).addTo(mymap);
  return rect;
}

var mymap = L.map('map', {
  attributionControl: false,
  center: [-52, 0],
  zoom: 1,
  maxBounds: [[-95, -185], [52, 185]]
});

L.tileLayer('http://localhost:8000/{id}/{z}/{x}/{y}.png', {
  maxZoom: 4,
  id: 'medium',
  detectRetina: true,
  noWrap: true,
  tms: true,
  crs: L.CRS.Simple,
}).addTo(mymap);

var popup = L.popup({
  closeButton: false,
});

function onMouseover(e) {
  var value = Math.floor(e.target._random_value * 80);
  popup
    .setLatLng(e.target.getBounds().getCenter())
    .setContent("Occupancy: " + value + "%")
    .openOn(mymap);
  e.target.setStyle({
    fillOpacity: HIGHLIGHT_OPACITY,
  });
}
function onMouseout(e) {
  mymap.closePopup();
  e.target.setStyle({
    stroke: false,
    fillOpacity: BASE_OPACITY,
  });
}

var rects = [];
rects.push(t(mymap, 78, 38.5, 100, 80))
rects.push(t(mymap, 333, 38.5, 100, 80))
rects.push(t(mymap, 588, 38.5, 100, 80))
rects.push(t(mymap, 844, 38.5, 100, 80))
rects.push(t(mymap, 0, 157, 100, 101))
rects.push(t(mymap, 0, 257, 100, 156))
rects.push(t(mymap, 137.5, 235, 80, 100))
rects.push(t(mymap, 255, 157, 100, 101))
rects.push(t(mymap, 255, 257, 100, 156))
rects.push(t(mymap, 392.5, 235, 80, 100))
rects.push(t(mymap, 510, 313, 101, 100))
rects.push(t(mymap, 610, 313, 156, 100))
rects.push(t(mymap, 588, 195.5, 100, 80))
rects.push(t(mymap, 843, 195.5, 100, 80))
rects.push(t(mymap, 765, 313, 101, 100))
rects.push(t(mymap, 865, 313, 159, 100))
rects.push(t(mymap, 588, 450.5, 100, 80))
rects.push(t(mymap, 255, 412, 100, 101))
rects.push(t(mymap, 255, 512, 100, 156))
rects.push(t(mymap, 392.5, 490, 80, 100))

_.each(rects, function (rect, i) {
  rect.on('mouseover', onMouseover);
  rect.on('mouseout', onMouseout);
})

function colors () {
  _.each(rects, function (rect) {
    var value = Math.random()
    rect._random_value = value;
    rect.setStyle({fillColor: COLOR_SCALE(value)});
  })
}
colors()
