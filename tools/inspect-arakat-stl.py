"""Read-only measurements and orthographic previews of the supplied mezzanine STL examples.

The user confirmed centimetres on 2026-10-25. The source geometry is not resized.
Run from the repository root with the bundled Python (numpy and Pillow).
"""
from pathlib import Path
import hashlib
import json
import struct
from collections import Counter
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
REF = ROOT / 'referanslar/2026-10-25-arakat'
OUT = ROOT / 'analizler'
DTYPE = np.dtype([('normal', '<f4', (3,)), ('v', '<f4', (3, 3)), ('attr', '<u2')])


def read(name):
    path = REF / name
    data = path.read_bytes()
    n = struct.unpack_from('<I', data, 80)[0]
    assert len(data) == 84 + 50 * n, 'Unexpected STL record length'
    tri = np.frombuffer(data, DTYPE, count=n, offset=84)['v'].astype(float)
    assert np.isfinite(tri).all()
    return tri, {'path': str(path.relative_to(ROOT)).replace('\\', '/'),
                 'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest(),
                 'header': data[:80].decode('ascii', errors='replace').strip(),
                 'triangles': n, 'units': 'cm, confirmed by user on 2026-10-25; STL itself has no unit declaration'}


def measure(tri, include_faces=False):
    pts, inv = np.unique(np.round(tri.reshape(-1, 3), 5), axis=0, return_inverse=True)
    faces = inv.reshape(-1, 3)
    parent = np.arange(len(pts))

    def find(i):
        while parent[i] != i:
            parent[i] = parent[parent[i]]
            i = parent[i]
        return i

    for f in faces:
        for j in f[1:]:
            parent[find(j)] = find(f[0])
    labels = np.array([find(i) for i in range(len(pts))])
    components = []
    for label in np.unique(labels):
        subset = pts[labels == label]
        face_mask = labels[faces[:, 0]] == label
        components.append({'vertices': len(subset), 'triangles': int(face_mask.sum()),
                           'min': subset.min(0).tolist(), 'max': subset.max(0).tolist(),
                           'extent': np.ptp(subset, axis=0).tolist(),
                           **({'faceIndices':np.where(face_mask)[0].tolist()} if include_faces else {})})
    edges = np.sort(np.concatenate([faces[:, [0, 1]], faces[:, [1, 2]], faces[:, [2, 0]]]), axis=1)
    _, counts = np.unique(edges, axis=0, return_counts=True)
    raw = tri.reshape(-1, 3)
    return {'min': raw.min(0).tolist(), 'max': raw.max(0).tolist(),
            'extent': np.ptp(raw, axis=0).tolist(), 'uniqueVertices': len(pts),
            'connectedComponentsAt1e5Weld': sorted(components, key=lambda c: (c['min'][1], c['min'][0])),
            'boundaryEdges': int((counts == 1).sum()), 'nonManifoldEdges': int((counts > 2).sum())}


def font(size):
    return ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf', size)


def render(tri, view, size=(1500, 1100)):
    # Orthographic projection of the original mesh, with no geometric alterations.
    if view == 'top':
        u, v = np.array([1., 0, 0]), np.array([0., 1, 0])
    elif view == 'end':
        u, v = np.array([1., 0, 0]), np.array([0., 0, 1])
    elif view == 'side':
        u, v = np.array([0., 1, 0]), np.array([0., 0, 1])
    else:
        u, v = np.array([.82, -.57, 0]), np.array([.30, .43, .85])
        u /= np.linalg.norm(u)
        v -= u * np.dot(u, v)
        v /= np.linalg.norm(v)
    depth = np.cross(u, v)
    xy = np.stack([tri @ u, -(tri @ v)], axis=-1)
    low, high = xy.reshape(-1, 2).min(0), xy.reshape(-1, 2).max(0)
    scale = min((size[0]-110) / (high[0]-low[0]), (size[1]-110)/(high[1]-low[1]))
    xy = (xy-(low+high)/2)*scale + np.array(size)/2
    im = Image.new('RGB', size, '#eef2f4')
    draw = ImageDraw.Draw(im)
    normal = np.cross(tri[:, 1]-tri[:, 0], tri[:, 2]-tri[:, 0])
    lengths = np.linalg.norm(normal, axis=1)
    normal = normal / np.maximum(lengths[:, None], 1e-12)
    light = np.array([.25, -.4, .88]); light /= np.linalg.norm(light)
    for i in np.argsort(tri.mean(1) @ depth):
        shade = .5 + .45*abs(float(np.dot(normal[i], light)))
        fill = tuple(int(x*shade) for x in (142, 167, 184))
        draw.polygon([tuple(p) for p in xy[i]], fill=fill)
    return im


def slice_segments(tri, axis, position):
    segments = []
    other = [i for i in range(3) if i != axis]
    for face in tri:
        hits = []
        for i in range(3):
            p, q = face[i], face[(i+1) % 3]
            if (p[axis]-position)*(q[axis]-position) < 0:
                t = (position-p[axis])/(q[axis]-p[axis])
                hits.append((p+t*(q-p))[other])
        if len(hits) == 2:
            segments.append(hits)
    return np.array(segments)


def draw_section(sheet, segments, box, title):
    draw = ImageDraw.Draw(sheet)
    x, y, width, height = box
    low = segments.reshape(-1, 2).min(0)
    high = segments.reshape(-1, 2).max(0)
    scale = min((width-200)/(high[0]-low[0]), (height-140)/(high[1]-low[1]))
    xy = (segments-(low+high)/2)*np.array([scale,-scale])+[x+width/2,y+height/2]
    draw.rectangle((x,y,x+width,y+height), fill='#eef2f4')
    for seg in xy:
        draw.line([tuple(p) for p in seg], fill='#254d63', width=3)
    draw.text((x+25,y+15), title, font=font(28), fill='#183140')
    draw.text((x+25,y+height-45), 'Kesit kutusu: '+ ' × '.join(f'{v:.4f}' for v in high-low),font=font(24),fill='#577081')


def main():
    single, a = read('arakat.stl')
    assembly, b = read('arakat-montaj.stl')
    a.update(measure(single,include_faces=True)); b.update(measure(assembly))
    single_components=a['connectedComponentsAt1e5Weld']
    single_groups=[c.pop('faceIndices') for c in single_components]
    assert len(assembly) % len(single) == 0
    transforms = []
    base_pts, base_inv = np.unique(single.reshape(-1,3),axis=0,return_inverse=True)
    base_faces = Counter(tuple(sorted(f)) for f in base_inv.reshape(-1,3))
    for i, chunk in enumerate(assembly.reshape(-1, *single.shape)):
        # STL export may reorder faces and vertices. Compare the geometry, not record order.
        offset = chunk.reshape(-1,3).min(0)-single.reshape(-1,3).min(0)
        cloud, inv = np.unique((chunk-offset).reshape(-1,3),axis=0,return_inverse=True)
        distances = np.linalg.norm(cloud[:,None,:]-base_pts[None,:,:],axis=2)
        matches = distances.argmin(1)
        equivalent_faces = Counter(tuple(sorted(f)) for f in matches[inv].reshape(-1,3))
        transforms.append({'index': i, 'translation': offset.tolist(),
                           'bidirectionalVertexDistance': float(max(distances.min(1).max(),distances.min(0).max())),
                           'matchingTriangleCount': sum((equivalent_faces & base_faces).values()),
                           'triangulationEquivalent': equivalent_faces == base_faces})
    result = {'date': '2026-10-25', 'weldTolerance': 1e-5,
              'files': [a, b], 'geometryCopyComparison': transforms,
              'caution': 'Mesh components are not guaranteed to be fabricated parts; observed profile dimensions are not an approved stock specification.'}
    cross_members=[c for c in single_components if abs(c['extent'][2]-8)<.001]
    cross_positions=[(c['min'][1]+c['max'][1])/2 for c in cross_members]
    result['layoutMeasurements']={
        'units':'cm','singleMemberGroups':{'longSides':2,'endMembers':2,'transverseMembers':len(cross_members)},
        'assemblyModules':len(transforms),'moduleStepX':float(np.mean(np.diff([t['translation'][0] for t in transforms]))),
        'transverseCenterY':cross_positions,'transversePitchY':float(np.mean(np.diff(cross_positions))),
        'transverseBoundingExtent':cross_members[0]['extent'],
        'approxLongSideSectionHeightFlangeLip':[20,6,2],
        'approxTransverseSectionHeightFlangeLip':[8,6,2],
        'flatFlangeThicknessObserved':{'longSide':0.12,'transverse':0.30},
        'note':'Section and thickness values are observations from source plane cuts, not approved stock definitions.'}
    result['userRule']={'units':'cm','width':125,'height':20,'length':'according to project length',
                        'placement':'on top of the lower-storey walls',
                        'widthReference':'total outside width, explicitly confirmed by user',
                        'assemblyPitch':'125 cm for flush side-by-side placement; joint gap/allowance has not been specified',
                        'source':'User message 2026-10-25; do not silently resize source STL.'}
    path = OUT / '2026-10-25-arakat-geometri.json'
    path.write_text(json.dumps(result, indent=2, ensure_ascii=False)+'\n', encoding='utf-8')
    for name, tri in [('tek', single), ('montaj', assembly)]:
        sheet = Image.new('RGB', (2200, 1800), '#ffffff')
        draw = ImageDraw.Draw(sheet)
        title = 'TEK ARA KAT ŞASESİ' if name == 'tek' else 'YAN YANA MONTAJ ÖRNEĞİ'
        draw.text((40, 25), title, font=font(38), fill='#183140')
        draw.text((40, 83), 'STL geometrisinden doğrudan görünüş · birim: cm (kullanıcı teyitli)', font=font(23), fill='#577081')
        sheet.paste(render(tri, 'iso', (1500, 1100)), (20, 140))
        sheet.paste(render(tri, 'top', (650, 1100)), (1530, 140))
        sheet.paste(render(tri, 'side', (1450, 330)), (20, 1310))
        sheet.paste(render(tri, 'end', (680, 330)), (1500, 1310))
        draw.text((45, 1245), 'İzometrik', font=font(26), fill='#183140')
        draw.text((1550, 1245), 'Üst', font=font(26), fill='#183140')
        draw.text((45, 1670), 'Uzun kenar', font=font(26), fill='#183140')
        draw.text((1530, 1670), 'Kısa kenar', font=font(26), fill='#183140')
        draw.text((40, 1730), 'Örneğin dış kutusu (X × Y × Z), cm: '+ ' × '.join(f'{x:.4f}' for x in np.ptp(tri.reshape(-1,3),axis=0)), font=font(25), fill='#577081')
        sheet.save(OUT / f'2026-10-25-arakat-{name}-gorunus.png')
    # Isolate a long side and one interior transverse member for true mesh plane cuts.
    left = single[single_groups[next(i for i,c in enumerate(single_components) if c['extent'][1]>600 and c['min'][0]<0)]]
    transverse = single[single_groups[next(i for i,c in enumerate(single_components) if abs(c['extent'][2]-8)<.001)]]
    sections = Image.new('RGB',(1600,1100),'white')
    d=ImageDraw.Draw(sections)
    d.text((35,25),'STL KESİT İNCELEMESİ',font=font(34),fill='#183140')
    d.text((35,80),'Ölçüler cm. Profil ve sac kalınlıkları örnek geometriden okunmuştur; stok standardı değildir.',font=font(22),fill='#577081')
    side_cut=slice_segments(left,1,350)
    cross_cut=slice_segments(transverse,0,60)
    draw_section(sections,side_cut,(20,140,750,880),'Uzun kenar · Y=350 kesiti')
    draw_section(sections,cross_cut,(790,140,790,880),'Ara kayıt · X=60 kesiti')
    sections.save(OUT/'2026-10-25-arakat-kesitler.png')
    result['sections']={'longSide':side_cut.tolist(),'crossMember':cross_cut.tolist()}
    path.write_text(json.dumps(result,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
    assert len(transforms)==len(assembly)//len(single) and len(cross_members)==13
    assert all(t['triangulationEquivalent'] and t['bidirectionalVertexDistance']<.0001 for t in transforms)
    print(json.dumps({'singleExtent': a['extent'], 'assemblyExtent': b['extent'],
                      'components': [len(a['connectedComponentsAt1e5Weld']), len(b['connectedComponentsAt1e5Weld'])],
                      'copies': transforms}, ensure_ascii=False))


if __name__ == '__main__':
    main()
