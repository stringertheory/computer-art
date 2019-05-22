from flask import Flask, render_template, abort
app = Flask(__name__)

# boxes.js 	entropy.js 	face.json 	fonts/
# ibm.js 	inspiralation.js 	kandinsky.js 	lib/
# logo.pdf 	logo.png 	map.js 	mindstorms.js
# mohr.js 	molnar.js 	nake.js 	nees.js
# nest-transparent.jpg 	nest-transparent.png 	noisetest.js 	noll.js
# perlin.js 	profile.js 	quilt.js 	rand.js
# result.png 	ribbons.js 	save.js 	streya.js
# streya.js~ 	svg_todataurl.js 	texture-1.js 	texture-1.js~
# tree.js 	tree2.js 	utils.js 	webs.js
# wright.js 	wright.js~ 	wright_tile.js 	wright_tile.js~

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
}

@app.route('/')
def index():
    return render_template('index.html', sketches=SKETCHES)

@app.route('/<slug>')
def sketch(slug):
    template = SKETCHES.get(slug)
    if template:
        return render_template(template, slug=slug)
    else:
        abort(404)
        
