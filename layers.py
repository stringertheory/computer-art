import collections
import pprint
import json
import os
import sys
import pyperclip
from xml.dom import minidom

import shapely.affinity
import shapely.geometry
import shapely.ops

from boltons.iterutils import remap
from svg.path import parse_path

SIMPLIFY_TOLERANCE_METERS = 0.1
FLOAT_DIGITS = 8
SCALE = 2.5
N_POINTS = 60
# X = 24
# Y = 10
# WIDTH = 20.375
# HEIGHT = 8.5
X = 13
Y = 13
WIDTH = 8.5
HEIGHT = 8.5


def linearize_segment(segment, n_points):
    """Interpolate between endpoints of each segment."""
    return [segment.point(_ / float(n_points + 1))
            for _ in range(n_points + 2)]


def linearize(path, n_points=360):
    """Interpolate between all points on a path."""
    points = []
    for i, segment in enumerate(path._segments):
        if type(segment).__name__ == 'Line':
            linearized = linearize_segment(segment, 0)
        else:
            linearized = linearize_segment(segment, n_points)
        points.extend(linearized[:-1])
    points.append(linearized[-1])
    return [(_.real, _.imag) for _ in points]


def read_svg(filename):

    doc = minidom.parse(filename)

    paths = collections.defaultdict(list)
    for path in doc.getElementsByTagName('path'):
        for cls in path.getAttribute('class').split():
            paths[cls].append(path)

    return paths


def create_polygon_from_svg_path(path, n_points=N_POINTS):
    points = linearize(path, n_points=n_points)
    return shapely.geometry.Polygon(points)


def create_line_from_svg_path(path, n_points=N_POINTS):
    points = linearize(path, n_points=n_points)
    return shapely.geometry.LineString(points)
    

def main(filename):

    paths = read_svg(filename)

    x_lines = []
    for path in paths['x-line']:
        # print(path.writexml(sys.stdout))
        svg_path = parse_path(path.getAttribute('d'))
        line = create_line_from_svg_path(svg_path)
        x_lines.append(line)
        # print(line.length)

    x_lines = shapely.geometry.MultiLineString(x_lines)

    y_lines = []
    for path in paths['y-line']:
        # print(path.writexml(sys.stdout))
        svg_path = parse_path(path.getAttribute('d'))
        line = create_line_from_svg_path(svg_path)
        y_lines.append(line)
        # print(line.length)

    y_lines = shapely.geometry.MultiLineString(y_lines)
    
    back_circles = []
    for path in paths['back-circle']:
        # print(path.writexml(sys.stdout))
        try:
            svg_path = parse_path(path.getAttribute('d'))
        except ZeroDivisionError:
            continue
        else:
            circle = create_polygon_from_svg_path(svg_path)
            # print(circle)
            back_circles.append(circle)

    tail_shapes = []
    for path in paths['tail']:

        if 'tail-centerline' in path.getAttribute('class'):
            continue

        # print(path.writexml(sys.stdout))
        
        try:
            svg_path = parse_path(path.getAttribute('d'))
        except ZeroDivisionError:
            continue
        else:
            shape = create_polygon_from_svg_path(svg_path).buffer(0)
            # print(circle)
            tail_shapes.append(shape)

    tail_feathers = []
    for path in paths['tail-semicircle']:
        # print(path.writexml(sys.stdout))
        try:
            svg_path = parse_path(path.getAttribute('d'))
        except ZeroDivisionError:
            continue
        else:
            shape = create_line_from_svg_path(svg_path)
            tail_feathers.append(shape)

    tail_feathers = shapely.geometry.MultiLineString(tail_feathers)

    tail_squares = []
    for path in paths['tail-square']:
        # print(path.writexml(sys.stdout))
        try:
            svg_path = parse_path(path.getAttribute('d'))
        except ZeroDivisionError:
            continue
        else:
            shape = create_polygon_from_svg_path(svg_path).buffer(0)
            tail_squares.append(shape)

    tail_squares = shapely.geometry.MultiPolygon(tail_squares)
    
            
    tail_shapes = shapely.geometry.MultiPolygon(tail_shapes)
    all_tail = shapely.ops.cascaded_union(tail_shapes)
    
    back_circles = shapely.geometry.MultiPolygon(back_circles)
    all_circles = shapely.ops.cascaded_union(back_circles)
    circle_lines = []
    circle_lines = shapely.geometry.MultiLineString([c.boundary for c in back_circles])
    # print(circle_lines)

    frame_rect = shapely.geometry.Polygon([(0, 0), (X, 0), (X, Y), (0, Y)])
    big_rect = frame_rect.buffer(X)
    matte_rect = big_rect.difference(frame_rect)

    params = {
        'scale_factor': 0.01,
        'stroke_color': '#000000',
    }
    polygon_params = {
        'scale_factor': 0.01,
        'fill_color': 'none',
    }
    print("""
<svg xmlns="http://www.w3.org/2000/svg" id="canvas" width="{}in" height="{}in" viewBox="0 0 {} {}">
""".format(WIDTH, HEIGHT, X, Y))
    
    print(x_lines.difference(all_circles).difference(all_tail).svg(**params))
    print(y_lines.difference(all_circles).difference(all_tail).svg(**params))
    print(circle_lines.difference(matte_rect).difference(all_tail).svg(**params))
    print(tail_feathers.svg(**params))
    print(tail_squares.svg(**polygon_params))
    print(frame_rect.svg(**polygon_params))
    
    print("""
</svg>
""")
    
if __name__ == '__main__':
    main(filename=sys.argv[1])

