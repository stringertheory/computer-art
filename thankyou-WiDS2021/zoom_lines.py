import math
import numpy as np
import vsketch
import sys
from shapely.geometry import LineString, Polygon
from okzoomer import zoom_timeseries

def split_into_chunks(ts, n_pieces):
    return np.array_split(ts, n_pieces)
    

WIDTH = 4
HEIGHT = 6
MARGIN = 4 / 25.4
MAIN_SPACING = 0.5
N_MINOR = 14
MM = 1 / 25.4

N_MAIN = int((HEIGHT - 2 * MARGIN) / MAIN_SPACING) - 1
NUM_LINE = 200
Y_OFFSET = MAIN_SPACING
X_FREQ = WIDTH / 5
Y_FREQ = HEIGHT / 50

filename = sys.argv[1]
ts = zoom_timeseries(filename, 5)

mult = 0.5
ts_max = max(v for t, v in ts) * mult

vsk = vsketch.Vsketch()
vsk.size("{}in".format(WIDTH), "{}in".format(HEIGHT))
vsk.scale("1in")

mains = []
chunks = split_into_chunks(ts, N_MAIN)
for i, chunk in enumerate(chunks):
    print(i)
    x_coords = list(np.linspace(MARGIN, WIDTH - MARGIN, len(chunk)))
    y_coords = [i * MAIN_SPACING + MAIN_SPACING * (1 - v / ts_max) for t, v in chunk]
    line = LineString(zip(x_coords, y_coords))
    vsk.stroke(1)
    vsk.geometry(line)

    vsk.stroke(2)
    baseline_rect = Polygon([
        (MARGIN, (i - 1) * MAIN_SPACING),
        (WIDTH - MARGIN, (i - 1) * MAIN_SPACING),
        (WIDTH - MARGIN, (i + 1) * MAIN_SPACING),
        (MARGIN, (i + 1) * MAIN_SPACING),
    ])
    # vsk.geometry(baseline_rect)

    vsk.stroke(3)
    poly = list(zip(x_coords, y_coords))
    left_chunk = chunks[(i - 1) % N_MAIN]
    right_chunk = chunks[(i + 1) % N_MAIN]
    left_y = [i * MAIN_SPACING + MAIN_SPACING * (1 - v / ts_max) for t, v in left_chunk]
    right_y = [i * MAIN_SPACING + MAIN_SPACING * (1 - v / ts_max) for t, v in right_chunk]
    left_x = list(np.linspace(-WIDTH + MARGIN, MARGIN, len(left_y)))
    right_x = list(np.linspace(WIDTH - MARGIN, 2 * WIDTH - MARGIN, len(right_y)))
    full_poly = list(zip(left_x, left_y)) + poly + list(zip(right_x, right_y))
    full_poly.append((2 * WIDTH - MARGIN, 2 * HEIGHT))
    full_poly.append((-WIDTH + MARGIN, 2 * HEIGHT))

    poly = Polygon(full_poly)
    while poly:
        intersection = poly.intersection(baseline_rect)
        try:
            l = intersection.geoms
        except AttributeError:
            vsk.geometry(intersection)
        else:
            for geom in l:
                vsk.geometry(geom)
        poly = poly.buffer(-0.5 * MM)
            
vsk.display()
vsk.save("zoom_lines.svg")
