#!/usr/bin/env python
# coding: utf-8
import math
import numpy as np
import vsketch

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

vsk = vsketch.Vsketch()
vsk.size("{}in".format(WIDTH), "{}in".format(HEIGHT))
vsk.scale("1in")

x_coords = np.linspace(MARGIN, WIDTH - MARGIN, 1000)

mains = []
for i in range(N_MAIN):
    y_coords = [MAIN_SPACING * vsk.noise((i * WIDTH) + x * X_FREQ) + (i * MAIN_SPACING) for x in x_coords]
    mains.append(y_coords)
    vsk.polygon(x_coords, y_coords)

vsk.stroke(2)
    
for a, b in zip(mains[:-1], mains[1:]):
    for j in range(N_MINOR):
        y_coords = []
        weight = (j + 1) / (N_MINOR + 1)
        for x, y0, y1 in zip(x_coords, a, b):
            y = weight * y0 + (1 - weight) * y1
            y_coords.append(y)
        vsk.polygon(x_coords, y_coords)
        
vsk.display()
vsk.save("random_lines.svg")
