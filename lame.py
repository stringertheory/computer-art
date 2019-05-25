from flask import Flask, render_template, abort
app = Flask(__name__)

SKETCHES = {
    'boxes': 'boxes.html',
    'ibm': 'ibm.html',
    'mohr': 'mohr.html',
    'tree': 'tree.html',
    'wright': 'wright.html',
    'entropy': 'entropy.html',
    'inspiralation': 'inspiralation.html',
    'molnar': 'molnar.html',
    'profile': 'profile.html',
    'ribbons': 'ribbons.html',
    'tree2': 'tree2.html',
    'kandinsky': 'kandinsky.html',
    'nake': 'nake.html',
    'noisetest': 'noisetest.html',
    'quilt': 'quilt.html',
    'texture-1': 'texture-1.html',
    'wright_tile': 'wright_tile.html',
    'mindstorms': 'mindstorms.html',
    'nees': 'nees.html',
    'noll': 'noll.html',
    'rand': 'rand.html',
    'streya': 'streya.html',
    'webs': 'webs.html',
    'watercolor': 'paper_sketch.html'
}

@app.route('/')
def index():
    return render_template('index.html', sketches=SKETCHES)

@app.route('/<slug>')
def sketch(slug):
    template = SKETCHES.get(slug)
    if template:
        return render_template(template, slug=slug, next='boxes')
    else:
        abort(404)
        
