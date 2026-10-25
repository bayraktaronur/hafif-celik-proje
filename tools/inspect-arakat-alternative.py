"""Inspect the three layouts in the user-supplied mezzanine alternative STL.

Uses the previous reader, topology inspection and orthographic renderer.
The source geometry and application are never modified. Units: cm (user convention).
"""
import importlib.util
import sys
from pathlib import Path
import json
from collections import Counter
import numpy as np
from PIL import Image, ImageDraw

ROOT=Path(__file__).resolve().parents[1]
sys.dont_write_bytecode=True
spec=importlib.util.spec_from_file_location('arakat',ROOT/'tools/inspect-arakat-stl.py')
base=importlib.util.module_from_spec(spec)
spec.loader.exec_module(base)
OUT=ROOT/'analizler'


def compare(tri, reference):
    p, pi=np.unique(reference.reshape(-1,3),axis=0,return_inverse=True)
    offset=tri.reshape(-1,3).min(0)-p.min(0)
    q, qi=np.unique((tri-offset).reshape(-1,3),axis=0,return_inverse=True)
    d=np.linalg.norm(q[:,None,:]-p[None,:,:],axis=2)
    match=d.argmin(1)
    a=Counter(tuple(sorted(f)) for f in pi.reshape(-1,3))
    b=Counter(tuple(sorted(f)) for f in match[qi].reshape(-1,3))
    error=float(max(d.min(0).max(),d.min(1).max()))
    return {'translation':offset.tolist(),'maxPointDistanceCm':error,
            'matchedTriangles':sum((a&b).values()),
            'sameGeometryWithin0_001cm':error<.001 and a==b}


def main():
    tri,meta=base.read('arakat-montaj-alternatif-1.stl')
    reference,refmeta=base.read('arakat.stl')
    stats=base.measure(tri,include_faces=True)
    components=stats['connectedComponentsAt1e5Weld']
    face_groups=[c.pop('faceIndices') for c in components]
    intervals=sorted((c['min'][0],c['max'][0]) for c in components)
    islands=[]
    for a,b in intervals:
        if not islands or a>islands[-1][1]+.1:islands.append([a,b])
        else:islands[-1][1]=max(islands[-1][1],b)
    names=['Düz yerleşim','Ortası uzatılmış yerleşim','Ortası kaydırılmış yerleşim']
    result={'date':'2026-10-25','units':'cm, using the user-confirmed convention for this STL series',
            'source':meta,'referenceSingle':refmeta,'geometry':stats,'xIslands':islands,'layouts':[]}
    contact=Image.new('RGB',(2100,1040),'white')
    d=ImageDraw.Draw(contact)
    d.text((35,20),'ARA KAT ŞASESİ · ÜÇ YERLEŞİM ÖRNEĞİ',font=base.font(36),fill='#183140')
    d.text((35,75),'Verilen STL geometrisi · birim cm · aradaki boşluklar dosyadaki sunum yerleşimidir',font=base.font(23),fill='#577081')
    for number,(a,b) in enumerate(islands,1):
        ids=[i for i,c in enumerate(components) if c['min'][0]>=a-.01 and c['max'][0]<=b+.01]
        long_ids=sorted([i for i in ids if components[i]['extent'][1]>200 and components[i]['extent'][2]>19],key=lambda i:components[i]['min'][0])
        assert len(long_ids)==16
        pairs=[long_ids[j:j+2] for j in range(0,len(long_ids),2)]
        centers=[(components[x]['min'][0]+components[y]['max'][0])/2 for x,y in pairs]
        modules=[]
        for j,pair in enumerate(pairs):
            # Keep paired boundary profiles with their own module. At the narrow
            # edge module, a shared-looking boundary is nearer the next centre.
            owned=pair+[i for i in ids if i not in long_ids and np.argmin(np.abs(np.array(centers)-(components[i]['min'][0]+components[i]['max'][0])/2))==j]
            indices=np.concatenate([face_groups[i] for i in owned])
            mesh=tri[indices];v=mesh.reshape(-1,3)
            transverse=[i for i in owned if abs(components[i]['extent'][2]-8)<.001]
            ys=sorted((components[i]['min'][1]+components[i]['max'][1])/2 for i in transverse)
            modules.append({'number':j+1,'memberGroups':len(owned),'min':v.min(0).tolist(),'max':v.max(0).tolist(),
                            'extent':np.ptp(v,axis=0).tolist(),'longSides':2,'endMembers':len(owned)-len(transverse)-2,
                            'transverseCount':len(transverse),'transverseCenterY':ys,
                            'transversePitchY':np.diff(ys).tolist(),'referenceComparison':compare(mesh,reference)})
        all_indices=np.concatenate([face_groups[i] for i in ids]);mesh=tri[all_indices];v=mesh.reshape(-1,3)
        item={'number':number,'name':names[number-1],'triangles':len(mesh),'memberGroups':len(ids),
              'min':v.min(0).tolist(),'max':v.max(0).tolist(),'extent':np.ptp(v,axis=0).tolist(),'modules':modules}
        result['layouts'].append(item)
        base.render(mesh,'iso',(1400,1000)).save(OUT/f'2026-10-25-arakat-alternatif-grup-{number}.png')
        contact.paste(base.render(mesh,'top',(680,700)),(10+(number-1)*700,135))
        x=30+(number-1)*700
        d.text((x,855),f'{number}. '+item['name'],font=base.font(26),fill='#183140')
        caption=['7 standart + 1 dar kenar şasesi','4. ve 5. şase yaklaşık 100 cm daha uzun','4. ve 5. şase aynı boyda, 250 cm kaydırılmış'][number-1]
        d.text((x,900),caption,font=base.font(21),fill='#577081')
        d.text((x,945),f'Dış kutu: {item["extent"][0]:.2f} × {item["extent"][1]:.2f} cm',font=base.font(21),fill='#577081')
        assert len(modules)==8 and sum(m['memberGroups'] for m in modules)==len(ids)
    contact.save(OUT/'2026-10-25-arakat-alternatif-genel.png')
    assert len(islands)==3 and sum(x['triangles'] for x in result['layouts'])==len(tri)
    for layout in result['layouts']:
        assert [m['longSides'] for m in layout['modules']]==[2]*8
        assert [m['endMembers'] for m in layout['modules']]==[2]*8
    assert [m['transverseCount'] for m in result['layouts'][0]['modules']]==[13]*8
    assert [m['transverseCount'] for m in result['layouts'][1]['modules']]==[13,13,13,15,15,13,13,13]
    assert [m['transverseCount'] for m in result['layouts'][2]['modules']]==[13]*8
    assert [m['referenceComparison']['sameGeometryWithin0_001cm'] for m in result['layouts'][0]['modules']]==[True]*7+[False]
    assert [m['referenceComparison']['sameGeometryWithin0_001cm'] for m in result['layouts'][1]['modules']]==[True,True,True,False,False,True,True,False]
    assert [m['referenceComparison']['sameGeometryWithin0_001cm'] for m in result['layouts'][2]['modules']]==[True]*7+[False]
    (OUT/'2026-10-25-arakat-alternatif-geometri.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
    print(json.dumps([{'layout':x['number'],'extent':x['extent'],'modules':[{'id':m['number'],'extent':m['extent'],'y':m['min'][1],
        'cross':m['transverseCount'],'sameAsReference':m['referenceComparison']['sameGeometryWithin0_001cm']} for m in x['modules']]} for x in result['layouts']],ensure_ascii=False))


if __name__=='__main__':main()
