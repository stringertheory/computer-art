import random
import collections
import itertools
import svgwrite
from svgwrite.extensions import Inkscape
from shapely.geometry import Polygon, MultiPolygon, LinearRing, LineString, box
from shapely.ops import polygonize_full, unary_union
from shapely.affinity import translate
import cairo
import utils


DEFAULT_FONT = ('Georgia', cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_NORMAL)

def text_to_shapely(text, x=0, y=0, align='left', font_size=100, font_parameters=DEFAULT_FONT):

    surface = cairo.SVGSurface(None, 1, 1)
    context = cairo.Context(surface)
    context.set_font_size(font_size)
    context.select_font_face(*font_parameters)
    context.set_tolerance(font_size / 2000)
    
    current_point = (x, y)
    polygons = []
    for char in text:
        context.new_path()
        context.move_to(*current_point)
        context.text_path(char)
        # extents = context.text_extents(char)

        current_point = context.get_current_point()

        rings = []
        for t, p in context.copy_path_flat():
            if t == cairo.PATH_MOVE_TO:
                points = [p]
            elif t == cairo.PATH_LINE_TO:
                points.append(p)
            elif t == cairo.PATH_CURVE_TO:
                raise ValueError('BUG. no curves allowed')
            elif t == cairo.PATH_CLOSE_PATH:
                rings.append(LinearRing(points))

        outers = set(range(len(rings)))
        contains = collections.defaultdict(list)
        within = collections.defaultdict(list)
        for ai, a in enumerate(rings):
            for bi, b in enumerate(rings):
                if ai != bi:
                    if Polygon(a).contains(Polygon(b)):
                        contains[ai].append(bi)
                        within[bi].append(ai)
                        outers.remove(bi)

        for index, outer_list in within.items():
            if len(outer_list) > 1:
                raise ValueError('contained within more than one outer')

        for outer_index in sorted(outers):
            outer = rings[outer_index]
            holes = [rings[_] for _ in contains[outer_index]]
            polygons.append(Polygon(outer, holes))

    print((x, y), current_point)
    dx = current_point[0] - x

    result = unary_union(polygons)
    result = translate(result, -dx/2, 0)

    return result

tester = 'Hbxp 7iBö'
font_size = 100
font_params = ('Graphik', cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_BOLD)
y = 0
line_spacing = 1
line_list = []
# for line in ['Vi', 'Har', 'Det', 'Godt']:
for line in ['WHAT', 'A', 'MESS']:
    # line = line.upper()
    mp = text_to_shapely(line, y=y, font_size=font_size, font_parameters=font_params)
    y += (line_spacing * font_size)
    line_list.append(mp)

mp = unary_union(line_list)
minx, miny, maxx, maxy = mp.bounds
cx = (minx + maxx) / 2
cy = (miny + maxy) / 2
width = 380
height = 580
tx = (width / 2) - cx
ty = (height / 2) - cy
d = 8
zag = width
mp = translate(mp, tx, ty)
mps = [mp]
for i in range(1, d + 1):
    mps.append(translate(mp, i, 0))
    mps.append(translate(mp, -i, 0))
    mps.append(translate(mp, 0, i))
    mps.append(translate(mp, 0, -i))

# for y in range(0, height, 10):
# b = LineString([(10, y), (590, y)])

flag = ['#222222']
# flag = [
#     '#e40303',
#     '#ff8c00',
#     '#ffed00',
#     '#008026',
#     '#004dff',
#     '#750787',
# ]


cropper = box(-width, -height, 2 * width, 2 * height).difference(box(d, d, width-d, height-d))
width_croppers = [cropper]
for i in range(1, d + 1):
    width_croppers.append(translate(cropper, i, 0))
    width_croppers.append(translate(cropper, -i, 0))
height_croppers = [cropper]
for i in range(1, d + 1):
    height_croppers.append(translate(cropper, 0, i))
    height_croppers.append(translate(cropper, 0, -i))

paper = svgwrite.Drawing('jagged-in.svg', size=(width, height))
ink = Inkscape(paper)
               
n_layers = 3
layers = []
for i in range(n_layers):
    layer = ink.layer(str(i + 1))
    paper.add(layer)
    layers.append(layer)

q = 2
for i in range(int(width / q)):

    b = LineString([
        (i * q, 0 + d * random.random()),
        (i * q + zag * (random.random() - 0.5), height - d * random.random()),
    ])

    # blerg = b.difference(random.choice(mps)).difference(random.choice(height_croppers))
    blerg = b.intersection(random.choice(mps))
    if blerg:
        layer = random.choice(layers)
        utils.add_shapely(paper, blerg, layer, **{
            "stroke": "black",
            "stroke-width": 1,
            "stroke-opacity": 0.8,
        })


for i in range(int(height / q)):

    b = LineString([
        (0 + d * random.random(), i * q),
        (width - d * random.random(), i * q + zag * (random.random() - 0.5)),
    ])

    # blerg = b.difference(random.choice(mps)).difference(random.choice(width_croppers))
    blerg = b.intersection(random.choice(mps))#.difference(random.choice(width_croppers))
    if blerg:
        layer = random.choice(layers)
        utils.add_shapely(paper, blerg, layer, **{
            "stroke": "black",
            "stroke-width": 1,
            "stroke-opacity": 0.8,
        })

utils.add_shapely(paper, cropper, layer, **{
    "stroke": "none",
    "fill": "black",
    "fill-opacity": 0.2,
})
        
paper.save()

