#!/usr/bin/env python
# coding: utf-8
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

N_MAIN = int((HEIGHT - 2 * MARGIN) / MAIN_SPACING)
NUM_LINE = 200
Y_OFFSET = MAIN_SPACING
X_FREQ = WIDTH / 5
Y_FREQ = HEIGHT / 50

filename = sys.argv[1]
ts = zoom_timeseries(filename, 5)

ts_max = max(v for t, v in ts) * 1

vsk = vsketch.Vsketch()
vsk.size("{}in".format(WIDTH), "{}in".format(HEIGHT))
vsk.scale("1in")

mains = []
for i, chunk in enumerate(split_into_chunks(ts, N_MAIN)):
    print(i)
    x_coords = np.linspace(MARGIN, WIDTH - MARGIN, len(chunk))
    y_coords = [i * MAIN_SPACING + MAIN_SPACING * (1 - v / ts_max) for t, v in chunk]
    line = LineString(zip(x_coords, y_coords))
    vsk.stroke(1)
    vsk.geometry(line)
    
    baseline_rect = Polygon([
        (0, (i + 1) * MAIN_SPACING),
        (WIDTH, (i + 1) * MAIN_SPACING),
        (WIDTH, HEIGHT * 2),
        (0, HEIGHT * 2),
    ])
    for j in range(40):
        line = LineString(zip(x_coords, [y + j * (1 / 25.4) for y in y_coords]))
        line = line.difference(baseline_rect)
        if line:
            vsk.stroke(3)
            vsk.geometry(line)
        
    # mains.append(y_coords)
    # y_coords = [i * MAIN_SPACING + MAIN_SPACING for _ in chunk]
    # vsk.stroke(2)
    # vsk.polygon(x_coords, y_coords)

# vsk.stroke(2)
    
# for a, b in zip(mains[:-1], mains[1:]):
#     for j in range(N_MINOR):
#         y_coords = []
#         weight = (j + 1) / (N_MINOR + 1)
#         for x, y0, y1 in zip(x_coords, a, b):
#             y = weight * y0 + (1 - weight) * y1
#             y_coords.append(y)
#         vsk.polygon(x_coords, y_coords)
        
vsk.display()
vsk.save("zoom_lines.svg")
