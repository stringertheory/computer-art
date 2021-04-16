from matplotlib.text import TextPath
from matplotlib.font_manager import FontProperties

fp = FontProperties(family="Graphik", style="normal", weight="bold")
text_path = TextPath((0, 0), "B", size=100, prop=fp)
print(text_path)
