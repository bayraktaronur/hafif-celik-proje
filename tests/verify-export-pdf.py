"""Run after node tests/plan-export.cjs. Uses pypdf/Pillow, independently of JS."""
import json
from pathlib import Path
from pypdf import PdfReader

base = Path('artifacts/export')
for name in ['tuna', 'furniture', 'presentation', 'scale']:
    reader = PdfReader(base / f'{name}.pdf', strict=True)
    assert len(reader.pages) == 1
    page = reader.pages[0]
    image = page.images[0].image.convert('RGB')
    assert image.width > 2000 and image.height > 2000
    assert len(reader.pages[0].images) == 1

# Check the actual pixels embedded in the PDF, not just the layout arithmetic.
l = json.loads((base / 'scale-layout.json').read_text())
reader = PdfReader(base / 'scale.pdf', strict=True)
page = reader.pages[0]
assert abs(float(page.mediabox.width) * 25.4 / 72 - 297) < .001
assert abs(float(page.mediabox.height) * 25.4 / 72 - 210) < .001
im = page.images[0].image.convert('RGB')
y = round(l['pan']['y'] / (l['h'] * 96 / 25.4) * im.height)
pixels = [x for x in range(im.width) if all(abs(a-b) < 12 for a, b in zip(im.getpixel((x,y)), (107,116,130)))]
assert pixels, 'Wall missing in rendered PDF'
width_mm = (max(pixels)-min(pixels)+1) / im.width * 297
assert abs(width_mm - 102) < .4, f'500 cm wall + end caps at 1:50 should be 102 mm; got {width_mm}'
print(f'PASS PDF page sizes, embedded images and measured 1:50 wall = {width_mm:.2f} mm')
