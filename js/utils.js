var FRAME_FACTOR = 10

function makeSVG(id, n_x, n_y) {
  var s = Snap(id)
  s.clear()
  var frame = (n_x + 1) / (FRAME_FACTOR + 1)
  s.attr({
    width: 600,
    height: 600,
    viewBox: Snap.format('{min_x} {min_y} {width} {height}', {
      min_x: 0 - frame,
      min_y: 0 - frame,
      width: n_x + 2 * frame,
      height: n_y + 2 * frame
    })
  })
  s.rect(-1, -1, n_x + 2, n_y + 2).attr({
    // fill: chroma.hcl(90, 1, 100),
    // fill: chroma.hcl(135, 10, 10),
    fill: 'none',
    stroke: 'none'
  })
  return s
}

function dataURItoBlob(dataURI) {
  // convert base64 to raw binary data held in a string doesn't handle
  // URLEncoded DataURIs - see SO answer #6850276 for code that does
  // this
  var byteString = atob(dataURI.split(',')[1]);

  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
  }

  // write the ArrayBuffer to a blob, and you're done
  var blob = new Blob([ab], {type: mimeString});
  return blob;
}

function makePNG(svg_id, label) {
  if (svg_id[0] === '#') {
    var svg_id = svg_id.split('#')[1];
  }
  var svg = document.getElementById(svg_id);
  svg.toDataURL("image/png", {
    callback : function(data) {
      var image = data.replace("image/png", "image/octet-stream");

      var hash = md5(image).substring(0, 6)
      var filename = 'computer-art-' + label + '-' + hash;
      var png_filename = filename + ".png";
      var svg_filename = filename + ".svg";

      var blob = dataURItoBlob(image);
      var blobUrl = URL.createObjectURL(blob);
      download_as_file(png_filename, blobUrl);

      var svgString = (new XMLSerializer()).serializeToString(svg);
      var svgUrl = 'data:text/plain;charset=utf-8,';
      svgUrl += encodeURIComponent(svgString);
      download_as_file(svg_filename, svgUrl);

      // var a = document.createElement('a');
      // a.download = png_filename;
      // a.href = blobUrl;
      // // document.body.appendChild(a);
      // a.click();
      // a.remove();
      // console.log("hi" + svg, svg);
      // download_inner(svg_filename, ();
    }
  });
}

function download_as_file(filename, url) {
  console.log(filename);
  var a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  a.remove();
}

function jitter(amount) {
  return amount * (Math.random() - 0.5);
}

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

module.exports = {
  makeSVG: makeSVG,
  makePNG: makePNG,
  jitter: jitter,
  convertToPath: convertToPath
}

