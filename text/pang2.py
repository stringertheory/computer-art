import cairo
import pango
import pangocairo

def draw_text(surface, context, text, font="sans 14", position=None,
color=None,
                            box_width=None,
alignment=pango.ALIGN_CENTER,
                            line_spacing=None, letter_spacing=None,
                            extra_kerning=None):
        if color is None:
            color = (0.0, 0.0, 0.0)
        context.set_source_rgb(*color)
        pc = pangocairo.CairoContext(context)
        layout = pc.create_layout()
        layout.set_text(text)
        layout.set_font_description(pango.FontDescription(font))
        if box_width: layout.set_width(box_width)
        layout.set_alignment(alignment)
        if line_spacing: layout.set_spacing(spacing)
        alist = pango.AttrList()
        if letter_spacing:
            alist.insert(pango.AttrLetterSpacing(letter_spacing, 0, len
(text)))
        if extra_kerning:
            for pos, kern in extra_kerning.iteritems():
                alist.insert(pango.AttrLetterSpacing(kern, pos, pos
+1))
        layout.set_attributes(alist)
        if position is None:
            width, height = surface.get_width(), surface.get_height()
            w, h = layout.get_pixel_size()
            position = (width/2.0 - w/2.0, height/2.0 - h/2.0)
        context.move_to(*position)
        pc.show_layout(layout)

surface = cairo.ImageSurface(cairo.FORMAT_ARGB32, width, height)
context = cairo.Context(surface)
draw_text(surface, context, 'Hello world!',
    font="sans 52", color=(.25,.28,.33),
    letter_spacing=-6000,
    extra_kerning={0:-9000, 1:-1000, 6:6000, 7:-15000, 8:5000,
9:-7000})

surface.write_to_png("hello.png")
