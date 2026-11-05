"""Convert the four locally exported DXF collections. Requires ezdxf."""
import hashlib
import json
import math
import sys
from pathlib import Path

import ezdxf
from ezdxf.path import make_path
from ezdxf.dynblkhelper import get_dynamic_block_definition

ROOT = Path(__file__).resolve().parent
NAMES = ["Temel bloklar", "Mutfak", "Oturma odası", "Ofis"]


def curves(entities):
    for entity in entities:
        if entity.dxftype() == "INSERT":
            yield from curves(entity.virtual_entities())
        elif entity.dxftype() in {"LINE", "LWPOLYLINE", "POLYLINE", "ARC", "CIRCLE", "SPLINE", "ELLIPSE"}:
            path = make_path(entity)
            points = [(v.x * 100, -v.y * 100) for v in path.flattening(.0005)]
            if len(points) > 1:
                yield points


def collection(file, index):
    doc = ezdxf.readfile(file)
    if doc.units != 6:
        raise ValueError(f"Expected meters: {file}")
    seen = set()
    for ref in doc.modelspace().query("INSERT"):
        name = ref.dxf.name
        if name in seen:
            continue
        seen.add(name)
        lines = list(curves(ref.virtual_entities()))
        if not lines:
            raise ValueError(f"No geometry: {name}")
        points = [p for line in lines for p in line]
        left, top = map(min, zip(*points))
        right, bottom = map(max, zip(*points))
        paths = [[v for x, y in line for v in (round(x-left, 2), round(y-top, 2))] for line in lines]
        size = [round(right-left, 2), round(bottom-top, 2)]
        if not all(math.isfinite(v) and v > 0 for v in size):
            raise ValueError(f"Invalid bounds: {name}")
        view = "Ön" if "front view" in name.lower() else "Yan" if "side view" in name.lower() else "Plan"
        key = hashlib.sha256(name.encode()).hexdigest()[:16]
        definition = get_dynamic_block_definition(ref)
        if definition is not None:
            name = definition.name
            view = "Ön" if "front view" in name.lower() else "Yan" if "side view" in name.lower() else "Plan"
        yield [f"rayon-{index}-{key}", name, NAMES[index], view, size, paths]


files = sorted(Path(sys.argv[1]).glob("*.dxf"))
if len(files) != 4:
    raise ValueError("Expected four collection DXFs")
data = []
for index, file in enumerate(files):
    rows = list(collection(file, index))
    print(file.name, len(rows), flush=True)
    data.extend(rows)
out = ROOT / "rayon-local.js"
temp = out.with_suffix(".tmp")
temp.write_text("globalThis.RayonPlanBlocks="+json.dumps(data, separators=(",", ":"))+";\n", encoding="utf8")
temp.replace(out)
