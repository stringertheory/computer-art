import time
import math
import random

from shapely.geometry import MultiPoint
from shapely.ops import unary_union
from shapely import affinity
import svgwrite

def path_d(polygon):
    if polygon.is_empty:
        return "<g />"
    exterior_coords = [["{},{}".format(*c) for c in polygon.exterior.coords]]
    interior_coords = [
        ["{},{}".format(*c) for c in interior.coords]
        for interior in polygon.interiors
    ]
    path = " ".join([
        "M {} L {} z".format(coords[0], " L ".join(coords[1:]))
        for coords in exterior_coords + interior_coords
    ])
    return path

def line_path_d(line):
    coords = ["{},{}".format(*c) for c in line.coords]
    path = 'M {}'.format(' L '.join(coords))
    return path

def add_shapely(paper, shape, layer, **kwargs):
    if layer is None:
        layer = paper
    if shape.geom_type == "MultiPolygon":
        group = paper.g()
        layer.add(group)
        for subshape in shape:
            group.add(paper.path(path_d(subshape), **kwargs))
    elif shape.geom_type == "Polygon":
        layer.add(paper.path(path_d(shape), **kwargs))
    elif shape.geom_type == "MultiLineString":
        group = paper.g()
        layer.add(group)
        for subshape in shape:
            group.add(paper.path(line_path_d(subshape), **kwargs))
    elif shape.geom_type == "LineString":
        layer.add(paper.path(line_path_d(shape), **kwargs))

        
def main():

    t = int(time.time())
    paper = svgwrite.Drawing('2-{}.svg'.format(t), debug=False)
    
    colors = [
        '#000000',
        # '#d94d99',
        # '#ffe600',
        # '#99b333',
        '#06004f',
        # '#264653',
        # '#2a9d8f',
        # '#e9c46a',
        # '#f4a261',
        # '#e76f51',
    ]
    margin = 5
    n_panels = 1
    phi = (math.sqrt(5) + 1) / 2
    n_y = 33
    n_x = int(n_y * phi / n_panels)
    padding = 1

    width = (n_x + padding) * n_panels + 2 * margin
    height = n_y + 2 * margin
    paper.add(paper.rect((-margin, -margin), (width, height), fill="rgb(240,240,240)"))
    
    for i_panel in range(n_panels):
    
        array = [random.randint(0, 1) for i in range(n_x)]

        grid = []
        for i in range(n_y):
            array = one_round(array, {
                (1, 1, 1): 0,
                (1, 1, 0): 0,
                (1, 0, 1): 0,
                (1, 0, 0): 1,
                (0, 1, 1): 1,
                (0, 1, 0): 1,
                (0, 0, 1): 1,
                (0, 0, 0): 0,
            })
            grid.append(array)
            print_one(array)

        shapes = []
        graph = make_graph(grid)
        for component in nx.connected_components(graph):
            if len(component) > 1:
                points = [((n_x + padding) * i_panel + x, y) for x, y in list(component)]
                p = MultiPoint(points)
                shapes.append(p.buffer(0.75))

        shape = unary_union(shapes)
        shape = shape.simplify(0.25)

        buffed = [shape]
        # for i in range(len(colors) - 1):
        #     print('buffering', i)
        #     shape = shape.buffer(-0.4)
        #     buffed.append(shape)
        for i in range(1):
            print('buffering', i)
            shape = shape.buffer(-0.4)
            shape = affinity.translate(shape, xoff=-0.2, yoff=-0.2)
            buffed.append(shape)
            
        for i, (color, shape) in enumerate(zip(colors, buffed)):
            # add_shapely(paper, shape, fill=color, stroke="none", stroke_width=0.0, stroke_linecap="round", stroke_linejoin="round")
            # add_shapely(paper, shape, fill=color, stroke="black", stroke_width=0.05, stroke_linecap="round", stroke_linejoin="round")
            add_shapely(paper, shape, fill=color, stroke="none", stroke_width=0.05, stroke_linecap="round", stroke_linejoin="round")
            # add_shapely(paper, shape, fill="none", stroke="rgb(0,51,68)", stroke_opacity=max((10-i)/10, 0), stroke_width=0.1)

    paper.update(
        {
            # "width": "{:.2f}px".format(VIEWBOX_WIDTH),
            # "height": "{:.2f}px".format(VIEWBOX_HEIGHT),
            "viewBox": "-{} -{} {} {}".format(
                margin, margin, (n_x + padding) * n_panels  + 2 * margin, n_y + 2 * margin,
            ),
        }
    )
        
    paper.save()
    

if __name__ == '__main__':
    main()
