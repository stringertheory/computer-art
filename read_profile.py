import pprint
import json
import os
import sys
import pyperclip

import shapely.affinity
import shapely.geometry

from boltons.iterutils import remap
from svg.path import parse_path

SIMPLIFY_TOLERANCE_METERS = 0.01
FLOAT_DIGITS = 8
SCALE = 2.5


def linearize_segment(segment, n_points):
    """Interpolate between endpoints of each segment."""
    return [segment.point(_ / float(n_points + 1))
            for _ in range(n_points + 2)]


def linearize(path, n_points=360):
    """Interpolate between all points on a path."""
    points = []
    for segment in path._segments:
        if type(segment).__name__ == 'Line':
            n_points = 0
        linearized = linearize_segment(segment, n_points)
        points.extend(linearized[:-1])
    points.append(linearized[-1])
    return [(_.real, _.imag) for _ in points]


def visit(path, key, value):
    """Used inside of boltons.remap for limiting precision of floating
    point numbers in json output.

    """
    if isinstance(value, float):
        value = round(value, FLOAT_DIGITS)
    return key, value


def round_floats(json_geometry):
    """Limit precision of floating point numbers for JSON output."""
    return remap(json_geometry, visit)


def read_svg_path_from_file(filename):
    with open(filename) as infile:
        svg_path = infile.read()

    return parse_path(svg_path)


def create_polygon_from_svg_path(path, orientation='ccw'):
    points = linearize(path)
    polygon = shapely.geometry.Polygon(points)
    if orientation is None:
        return polygon
    elif orientation == 'ccw':
        return shapely.geometry.polygon.orient(polygon, 1.0)
    elif orientation == 'cw':
        return shapely.geometry.polygon.orient(polygon, -1.0)
    else:
        raise ValueError((
            f'invalid orientation `{orientation}`, '
            'must be "ccw", "cw", or `None`'
        ))


def fit_in_square(polygon, size=1.0):

    translated = shapely.affinity.translate(
        polygon,
        xoff=-polygon.centroid.x,
        yoff=-polygon.centroid.y,
    )

    return shapely.affinity.scale(
        translated,
        xfact=size,
        yfact=size,
        origin='centroid',
    )


def coords_starting_at_rightmost_point(polygon):
    coords = polygon.exterior.coords
    start_y = min(abs(y) for (x, y) in coords if x > 0)
    for index, (x, y) in enumerate(coords):
        if abs(y) == start_y:
            break
    result = coords[index:] + coords[:index]
    return result


def main(filename):

    path = read_svg_path_from_file(filename)

    polygon = create_polygon_from_svg_path(path, orientation='ccw')

    scaled_polygon = fit_in_square(polygon, 2.5)

    coords = coords_starting_at_rightmost_point(scaled_polygon)

    pyperclip.copy(json.dumps(round_floats(coords)))

    msg = '{} points copied to clipboard as JSON'.format(len(coords))
    print(msg, file=sys.stderr)


if __name__ == '__main__':
    main(filename=sys.argv[1])
