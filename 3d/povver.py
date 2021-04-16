from vapory import *

color = lambda col: Texture( Pigment( 'color', col))

def scene(t):
    """ Returns the scene at time 't' (in seconds) """
    return Scene(
        Camera( 'location', [0, 2, -3], 'look_at',  [1, 1, 2] ), [
            LightSource( [2, 4, -3], 'color', [1.5,1.5,1.5] ),
            Background( "color", [1,1,1] ),
            Sphere([0, 1, 2], 2, color([.8, 1, .2])),
            Box( [-.8 + .5 * t, -1.5, -.5] , [-.75+.5*t, 3.5, 5], # <= t
                 color([1,.6,.5]), 'rotate', [0, 30, 0] ),
            Sphere( [ 3 - 2 * t , 1, 1.1] , .75,  color([.5, .5, .9]))
        ])

from moviepy.editor import VideoClip

def make_frame(t):
    return scene(t).render(width=400, height=300, antialiasing=0.001)

VideoClip(make_frame, duration=6).write_gif("anim.gif",fps=30)

