import random
import collections
import itertools
import svgwrite
from shapely.geometry import Polygon, MultiPolygon, LinearRing, LineString, box
from shapely.ops import polygonize_full, unary_union
from shapely import affinity
import cairo

import utils


DEFAULT_FONT = ('Georgia', cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_NORMAL)

def text_to_shapely(text, x=0, y=0, align='left', font_size=100, font_parameters=DEFAULT_FONT):

    surface = cairo.SVGSurface(None, 1, 1)
    context = cairo.Context(surface)
    context.set_font_size(font_size)
    context.select_font_face(*font_parameters)
    context.set_tolerance(font_size / 2000)

    extents = context.text_extents('D')
    print(extents)
    rsb = extents.x_advance - extents.x_bearing - extents.width
    print(rsb)
    extents = context.text_extents('e')
    print(extents)
    rsb = extents.x_advance - extents.x_bearing - extents.width
    print(rsb)
    extents = context.text_extents('M')
    print(extents)
    rsb = extents.x_advance - extents.x_bearing - extents.width
    print(rsb)
    raise 'STOP'

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
    # result = affinity.translate(result, -dx/2, 0)

    return result

def stretch_to_fit(polygon, bounds):
    minx, miny, maxx, maxy = polygon.bounds
    new_minx, new_miny, new_maxx, new_maxy = bounds
    old_width, new_width = maxx - minx, new_maxx - new_minx
    x_scale = new_width / old_width
    old_height, new_height = maxy - miny, new_maxy - new_miny
    y_scale = new_height / old_height
    scaled = affinity.scale(polygon, x_scale, y_scale)
    minx, miny, maxx, maxy = scaled.bounds
    dx = new_minx - minx
    dy = new_miny - miny
    result = affinity.translate(scaled, dx, dy)
    return result

font_size = 145
font_params = ('Graphik', cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_BOLD)
y = 0
line_spacing = 1
line_list = []
# for line in ['Vi', 'Har', 'Det', 'Godt']:
for line in ['Data', 'science', 'X', 'Man']:
    mp = text_to_shapely(line, y=y, font_size=font_size, font_parameters=font_params)
    y += (line_spacing * font_size)
    line_list.append(mp)

first = unary_union(line_list)

line_list = []
for line in ['DATA']:
    mp = text_to_shapely(line, y=y, font_size=font_size, font_parameters=font_params)
    y += (line_spacing * font_size)
    line_list.append(mp)

x = text_to_shapely('X', y=0, font_size=font_size, font_parameters=font_params)
    
second = unary_union(line_list)
second = affinity.rotate(second, -90)

width = 1200
height = 800
padding = 50

first = stretch_to_fit(first, (padding, padding, width - padding, height - padding))
second = stretch_to_fit(second, (padding, padding, width - padding, height - padding))

paper = svgwrite.Drawing('scretched.svg', size=(width, height))

third = first.intersection(second)

utils.add_shapely(paper, first, **{
    "stroke": "black",
    "fill": "blue",
    "fill-opacity": 0.0,
    "stroke-opacity": 0.2,
})
utils.add_shapely(paper, second, **{
    "stroke": "black",
    "fill": "red",
    "fill-opacity": 0.0,
    "stroke-opacity": 0.2,
})
utils.add_shapely(paper, third, **{
    "stroke": "none",
    "fill": "black",
    "fill-opacity": 0.9,
})
        
paper.save()

