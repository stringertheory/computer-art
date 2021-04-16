import time
import math
import random
import numbers

import svgwrite

def concentric(x0, y0, radius, pen_width, padding, angle=0):
    r = radius - (pen_width / 2)
    x, y = x0, y0
    while r >= (pen_width / 2):
        yield x, y, r
        r -= (pen_width + padding)
        x -= math.cos(math.radians(angle)) * padding
        y -= math.sin(math.radians(angle)) * padding

def make_drawing(width=11, height=8.5, margin=0, units='in'):

    if isinstance(margin, numbers.Number):
        margin = {
            'top': margin,
            'bottom': margin,
            'left': margin,
            'right': margin,
        }
    elif not isinstance(margin, dict):
        msg = 'margin must be number or dict, got {!r}'.format(margin)
        raise TypeError(msg)

    content_width = width - margin['left'] - margin['right']
    content_height = height - margin['top'] - margin['bottom']
    
    paper = svgwrite.Drawing(
        'circles.svg',
        size=('{}{}'.format(width, units), '{}{}'.format(height, units)),
        viewBox="{} {} {} {}".format(
            -margin['left'],
            -margin['top'],
            width,
            height,
        ),
    )

    return paper, content_width, content_height

def show_margins(paper, page_width, page_height, margin, width, height, opacity=0.03):

    paper.add(paper.rect(
        (0, 0),
        (width, height),
        fill="black",
        fill_opacity=opacity,
        stroke="none",
    ))
    paper.add(paper.rect(
        (-margin, -margin),
        (page_width, page_height),
        fill="black",
        fill_opacity=opacity,
        stroke="none",
    ))

    
        
def main():

    page_width, page_height = 165, 114
    margin = 10
    units = 'mm'

    paper, width, height = make_drawing(page_width, page_height, margin, units)
    # show_margins(paper, page_width, page_height, margin, width, height)
    
    pen_width = 0.4
    padding = 0.1
    circle_padding = 15
    angle = 0
    radius = (width - 3 * circle_padding) / 4
    style = {
        'fill': 'none',
        'stroke': 'black',
        'stroke_width': pen_width,
    }

    nx = 9
    ny = 8
    radius = (width / (nx - 1.55)) / 2
    for y in range(ny):
        y0 = (y + 0.5) * (height / ny)
        for x in range(nx):
            x0 = (x + 0.5) * (width / nx)
            angle = random.randint(0, 359)
            for x, y, r in concentric(x0, y0, radius, pen_width, padding, angle):
                paper.add(paper.circle((x, y), r, **style))
            
    # y0 = height / 2
    # x0 = circle_padding + radius
    # for x, y, r in concentric(x0, y0, radius, pen_width, padding, 0):
    #     paper.add(paper.circle((x, y), r, **style))

    # x0 = width / 2
    # for x, y, r in concentric(x0, y0, radius, pen_width, padding, 60):
    #     paper.add(paper.circle((x, y), r, **style))
        
    # x0 = 2 * circle_padding + 3 * radius
    # for x, y, r in concentric(x0, y0, radius, pen_width, padding, 120):
    #     paper.add(paper.circle((x, y), r, **style))

    paper.save()
        

if __name__ == '__main__':
    main()
