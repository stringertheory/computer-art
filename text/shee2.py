#!/usr/bin/env python
# -*- coding: utf-8 -*-
# -----------------------------------------------------------------------------
#
#  FreeType high-level python API - Copyright 2011-2015 Nicolas P. Rougier
#  Distributed under the terms of the new BSD license.
#
#  - The code is incomplete and over-simplified, as it ignores the 3rd order
#    bezier curve bit and always intepolate between off-curve points.
#    This is only correct for truetype fonts (which only use 2nd order bezier curves).
#  - Also it seems to assume the first point is always on curve; this is
#    unusual but legal.
#
# -----------------------------------------------------------------------------
'''
Show how to access glyph outline description.
'''
from freetype import *

if __name__ == '__main__':
    import sys
    import numpy
    import matplotlib.pyplot as plt
    from matplotlib.path import Path
    import matplotlib.patches as patches

    ttf_filename = sys.argv[1]
    face = Face(ttf_filename)
    # face = Face('./Vera.ttf')
    face.set_char_size( 32*64 )
    face.load_char('B')
    slot = face.glyph

    outline = slot.outline
    points = numpy.array(outline.points, dtype=[('x',float), ('y',float)])
    x, y = points['x'], points['y']

    start, end = 0, 0

    VERTS, CODES = [], []
    # Iterate over each contour
    for i in range(len(outline.contours)):
        end    = outline.contours[i]
        points = outline.points[start:end+1]
        points.append(points[0])
        tags   = outline.tags[start:end+1]
        tags.append(tags[0])

        segments = [ [points[0],], ]
        for j in range(1, len(points) ):
            segments[-1].append(points[j])
            if tags[j] & (1 << 0) and j < (len(points)-1):
                segments.append( [points[j],] )
        verts = [points[0], ]
        codes = [Path.MOVETO,]
        for segment in segments:
            if len(segment) == 2:
                verts.extend(segment[1:])
                codes.extend([Path.LINETO])
            elif len(segment) == 3:
                verts.extend(segment[1:])
                codes.extend([Path.CURVE3, Path.CURVE3])
            else:
                verts.append(segment[1])
                codes.append(Path.CURVE3)
                for i in range(1,len(segment)-2):
                    A,B = segment[i], segment[i+1]
                    C = ((A[0]+B[0])/2.0, (A[1]+B[1])/2.0)
                    verts.extend([ C, B ])
                    codes.extend([ Path.CURVE3, Path.CURVE3])
                verts.append(segment[-1])
                codes.append(Path.CURVE3)
        VERTS.extend(verts)
        CODES.extend(codes)
        start = end+1

    figure = plt.figure(figsize=(8,10))
    axis = figure.add_subplot(111)
    path = Path(VERTS, CODES)

    print(path)
    path = path.interpolated(20000)
    
    glyph = patches.PathPatch(path, fill=True, facecolor=(0,0,0), alpha=.5, lw=0)
    axis.add_patch(glyph)

    axis.set_xlim(x.min(), x.max())
    axis.set_ylim(y.min(), y.max())

    plt.savefig('glyph-vector-2.svg')
    plt.show()
