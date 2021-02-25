#!/usr/bin/env python
# coding: utf-8
import math
import numpy as np
import vsketch
import random

WIDTH = 4
HEIGHT = 6
MARGIN = 10 / 25.4 # 4mm

MIN_HEIGHT = 1 / 3
MAX_HEIGHT = 1.0
MIN_WIDTH = 0.8
min_width = (WIDTH - 2 * MARGIN) * MIN_WIDTH
MAX_WIDTH = 1.0
max_width = (WIDTH - 2 * MARGIN) * MAX_WIDTH

MIN_COVER_WIDTH = 0.06
MAX_COVER_WIDTH = 0.12
COVER_PADDING = 1/3
PAGE_PADDING = 1.0

PAGE_PEN_WIDTH_MM = 0.2
PAGE_PEN_WIDTH = 0.2 / 25.4
COVER_PEN_WIDTH_MM = 0.5
COVER_PEN_WIDTH = 0.5 / 25.4

def draw_book(vsk, x0, y0, width, height, cover_height):
    page_padding = PAGE_PADDING * PAGE_PEN_WIDTH
    vsk.stroke(2)
    vsk.rect(x0 + COVER_PEN_WIDTH / 2, y0 + COVER_PEN_WIDTH / 2, width - COVER_PEN_WIDTH, cover_height - COVER_PEN_WIDTH)
    vsk.stroke(1)
    y = y0
    y += cover_height
    y += page_padding
    while y < (y0 + height - cover_height):
        y += PAGE_PEN_WIDTH / 2
        vsk.line(x0 + PAGE_PEN_WIDTH, y, x0 + width - PAGE_PEN_WIDTH, y)
        y += PAGE_PEN_WIDTH / 2
        y += page_padding
    vsk.stroke(2)
    vsk.rect(x0 + COVER_PEN_WIDTH / 2, y + COVER_PEN_WIDTH / 2, width - COVER_PEN_WIDTH, cover_height - COVER_PEN_WIDTH)
    y += cover_height
    return y

vsk = vsketch.Vsketch()
vsk.size("{}in".format(WIDTH), "{}in".format(HEIGHT))
vsk.scale("1in")

book_width = random.uniform(min_width, max_width)
book_height = random.uniform(MIN_HEIGHT, MAX_HEIGHT)
cover_height = random.uniform(MIN_COVER_WIDTH, MAX_COVER_WIDTH)

y = MARGIN
while True:
    y = draw_book(vsk, MARGIN, y, book_width, book_height, cover_height)
    y += COVER_PADDING * COVER_PEN_WIDTH
    
    book_width = random.uniform(min_width, max_width)
    book_height = random.uniform(MIN_HEIGHT, MAX_HEIGHT)
    cover_height = random.uniform(MIN_COVER_WIDTH, MAX_COVER_WIDTH)
    print(y + book_height)
    if (y + book_height) > (HEIGHT - MARGIN):
        break
    
vsk.display()
vsk.save("books-2.svg")
