"""Extract member meshes from the confirmed 125 cm STL for the isolated draft."""
import sys, importlib.util, json
from pathlib import Path
import numpy as np
sys.dont_write_bytecode=True
root=Path(__file__).resolve().parents[2]
spec=importlib.util.spec_from_file_location('reader',root/'tools/inspect-arakat-stl.py')
reader=importlib.util.module_from_spec(spec);spec.loader.exec_module(reader)
tri,meta=reader.read('arakat.stl')
groups=reader.measure(tri,include_faces=True)['connectedComponentsAt1e5Weld']
members={}
for name,index,axis in [('left',1,1),('right',2,1),('head',0,0),('tail',16,0),('cross',3,0)]:
    c=groups[index];mesh=tri[c['faceIndices']];lo=mesh.reshape(-1,3).min(0);extent=np.ptp(mesh.reshape(-1,3),axis=0)
    # Preserve the section in the other axes; only the extrusion axis will vary.
    mesh=mesh-lo
    members[name]={'vertices':np.round(mesh,6).reshape(-1).tolist(),'extent':extent.tolist(),'axis':axis,
                   'z':11.92171 if name=='cross' else 0}
out={'source':meta,'members':members,'width':125,'height':20,'referencePitch':49.2687379}
(Path(__file__).parent/'frame-reference.js').write_text('const FRAME_REFERENCE = '+json.dumps(out,separators=(',',':'))+';\n',encoding='utf8')
print('Extracted five member meshes; source unchanged')
