import collections
import pprint
import json
import os
import sys
import pyperclip

import shapely.affinity
import shapely.geometry
import shapely_geojson

from boltons.iterutils import remap
from svg.path import parse_path
from bs4 import BeautifulSoup

SIMPLIFY_RESOLUTION = 2000
FLOAT_DIGITS = 7
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

def create_polygon_from_svg_path(path):
    points = linearize(path)
    return shapely.geometry.LineString(points)

def parse_style(element):
    style_string = element.get('style')
    result = {}
    if style_string:
        for i in style_string.split(';'):
            key, value = i.split(':')
            result[key.strip()] = value.strip()
    return result

def get_number(string):
    digits = [i for i in string if (i.isdigit() or i == '.')]
    return float(''.join(digits))

def get_size(soup):
    width = get_number(soup.find('svg')['width'])
    height = get_number(soup.find('svg')['height'])
    size = max(width, height)
    return size
    
def main(filename):

    new_filename = filename + '.json'

    with open(filename) as infile:
        soup = BeautifulSoup(infile, 'lxml-xml')

    size = get_size(soup)
    print(size, size / SIMPLIFY_RESOLUTION)
    
    feature_groups = collections.defaultdict(list)
    for path_element in soup.find_all('path'):
#        print(path_element)
        d = path_element['d']
        style = parse_style(path_element)
        cls = 'main'
        print(style)
        if style.get('fill', 'none') != 'none':
            cls = 'fill'
        elif style.get('stroke-width', '').startswith('0.01'):
            cls = 'detail'
        polygon = create_polygon_from_svg_path(parse_path(d))
        simple = polygon.simplify(1, preserve_topology=True)
        feature_groups[cls].append(shapely_geojson.Feature(simple, properties={'class': cls}))

    features = []
    for cls in ['fill', 'detail', 'main']:
        features.extend(feature_groups[cls])
        
    feature_collection = shapely_geojson.FeatureCollection(features)
    rounded = round_floats(shapely.geometry.mapping(feature_collection))
    output = json.dumps(rounded)
    
    # path = read_svg_path_from_file(filename)

    # polygon = create_polygon_from_svg_path()

    # scaled_polygon = fit_in_square(polygon, 2.5)

    # coords = coords_starting_at_rightmost_point(scaled_polygon)

    with open(new_filename, 'w') as outfile:
        outfile.write(output)
    # pyperclip.copy(output)

    # msg = 'points copied to clipboard as geoJSON'
    # print(msg, file=sys.stderr)


if __name__ == '__main__':
    main(filename=sys.argv[1])
