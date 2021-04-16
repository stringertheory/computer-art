import random
import collections
import itertools
import svgwrite
from shapely.geometry import Polygon, MultiPolygon, LinearRing, LineString, box
from shapely.ops import polygonize_full, unary_union
from shapely.affinity import translate
import cairo

import utils

DEFAULT_FONT = ('Georgia', cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_NORMAL)

def text_to_shapely(text, x=0, y=0, font_size=100, font_parameters=DEFAULT_FONT):

    surface = cairo.SVGSurface(None, 1, 1)
    context = cairo.Context(surface)
    context.set_font_size(font_size)
    context.select_font_face(*font_parameters)

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

    return unary_union(polygons), context.font_extents()

tester = 'Hbxp 7iBö'
font_size = 120
font_params = ('Graphik', cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_BOLD)
y = 0
line_spacing = 1
line_list = []
for line in ['Vi', 'Har', 'Det', 'Godt']:
    # line = line.upper()
    mp, fe = text_to_shapely(line, y=y, font_size=font_size, font_parameters=font_params)
    y += (line_spacing * font_size)
    line_list.append(mp)

mp = unary_union(line_list)
minx, miny, maxx, maxy = mp.bounds
cx = (minx + maxx) / 2
cy = (miny + maxy) / 2
width = 400
height = 600
tx = (width / 2) - cx
ty = (height / 2) - cy
mp = translate(mp, tx, ty)


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


# b = box(10, 190, 600-10, 210)
paper = svgwrite.Drawing('kk.svg', size=(width, height))

for i in range(int(width / 2)):

    b = LineString([
        (i * 2, 0),
        (i * 2 + 100 * (random.random() - 0.5), height),
    ])

    blerg = b.intersection(mp)
    if blerg:
        if random.random() < 1:
            utils.add_shapely(paper, blerg, **{
                "stroke": "black",
                "stroke-width": 1,
                "stroke-opacity": 1,
            })


for i in range(int(height / 2)):

    b = LineString([
        (0, i * 2),
        (width, i * 2 + 100 * (random.random() - 0.5)),
    ])

    j = int((i + random.randint(-30, 30)) * 2 * len(flag) / height)
    j = min(len(flag) - 1, max(j, 0))
    stroke = flag[j]
    # stroke = random.choice(flag)
    if random.random() < 1:
        blerg = b.intersection(mp)
    else:
        blerg = b
    
    if blerg:
        # if random.random() < 0.5:
        #     stroke = "magenta"
        # else:
        #     stroke = "cyan"c_
        utils.add_shapely(paper, blerg, **{
            "stroke": stroke,
            "stroke-width": 1,
            "stroke-opacity": 1,
        })
 
       
# utils.add_shapely(paper, b, **{
#     "fill": "black",
#     "fill-opacity": 0.1,
#     "stroke": "black",
#     "stroke_width": 0.5,
# })
# utils.add_shapely(paper, mp, **{
#     "fill": "magenta",
#     "fill-opacity": 0.0,
#     "stroke": "none",
#     "stroke_width": 1,
#     "stroke-opacity": 0.5,
#     # "transform": "translate({}, {})".format(tx, ty),
# })

paper.save()

