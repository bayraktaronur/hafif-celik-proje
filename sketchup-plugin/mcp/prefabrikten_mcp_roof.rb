require 'json'
require 'digest'
module PrefabriktenMCPRoof
  def self.clip(poly,axis,bound,sign)
    out=[]
    poly.each_with_index do |a,i|
      b=poly[(i+1)%poly.length];da=sign*(a[axis]-bound);db=sign*(b[axis]-bound)
      out << a if da>=-0.000001
      if da*db<0
        t=da.to_f/(da-db);out << a.zip(b).map { |u,v| u+t*(v-u) }
      end
    end
    out
  end
  # Nominal 27/200; crest42/valley74 are illustrative, not a manufacturer's die.
  def self.height(u)
    x=u%200
    return 27.0 if x<=21 || x>=179
    return 27.0*(63-x)/42 if x<63
    return 27.0*(x-137)/42 if x>137
    0.0
  end
  def self.validate(p)
    raise 'Invalid roof parameters.' unless p.is_a?(Hash) && (p.keys-%w[request_id patches replace_roof]).empty?
    if p['replace_roof']
      r=p['replace_roof']
      raise 'Invalid replacement identity.' unless r.is_a?(Hash) && r.keys.sort==%w[pid request_id] && r['pid'].is_a?(Integer) && r['pid']>0 && r['request_id'].is_a?(String) && r['request_id'].match?(/\A[0-9a-f-]{36}\z/) && r['request_id']!=p['request_id']
    end
    raise 'Invalid request ID.' unless p['request_id'].is_a?(String) && p['request_id'].match?(/\A[0-9a-f-]{36}\z/)
    patches=p['patches']
    raise '1..20 roof patches required.' unless patches.is_a?(Array) && (1..20).include?(patches.length)
    total=0
    patches.each do |f|
      raise 'Invalid patch.' unless f.is_a?(Hash) && (f.keys-%w[plane cross_axis polygons]).empty?
      plane=f['plane'];axis=f['cross_axis'];polys=f['polygons']
      raise 'Invalid plane/axis.' unless [0,1].include?(axis) && plane.is_a?(Array) && plane.length==4 && plane.all? { |v| v.is_a?(Numeric) && v.finite? }
      nx,ny,nz,d=plane
      raise 'Roof plane must face up and be normalized.' unless nz>0.5 && ((nx*nx+ny*ny+nz*nz)-1).abs<0.00001 && d.abs<1000000 && (axis==0 ? nx.abs : ny.abs)<0.00001
      raise 'Invalid polygons.' unless polys.is_a?(Array) && !polys.empty?
      polys.each do |poly|
        total+=1
        raise 'Too many polygons.' if total>500
        raise 'Invalid polygon.' unless poly.is_a?(Array) && (3..20).include?(poly.length) && poly.all? { |v| v.is_a?(Array) && v.length==2 && v.all? { |x| x.is_a?(Numeric) && x.finite? && x.abs<=1000000 } }
        signs=poly.each_index.map do |i|
          a=poly[i];b=poly[(i+1)%poly.length];c=poly[(i+2)%poly.length]
          (b[0]-a[0])*(c[1]-b[1])-(b[1]-a[1])*(c[0]-b[0])
        end.reject { |v| v.abs<0.001 }
        raise 'Convex nonzero polygons required.' if signs.empty? || (signs.any?(&:positive?) && signs.any?(&:negative?))
      end
      points=polys.flatten(1)
      raise 'Patch extent too large.' if [0,1].any? { |i| points.map { |v| v[i] }.minmax.then { |a,b| b-a>50000 } }
    end
    p
  end
  def self.create(req)
    model=Sketchup.active_model
    raise 'Model changed; refresh sessions.' unless model.guid==req['model_guid']
    raise 'Exit group editing.' if model.active_path
    p=validate(req['roof']);digest=Digest::SHA256.hexdigest(JSON.generate(p))
    prior=model.entities.grep(Sketchup::Group).find { |g| g.get_attribute('PrefabriktenRoof','request_id')==p['request_id'] }
    if prior
      raise 'Request ID reused with different roof.' unless prior.get_attribute('PrefabriktenRoof','digest')==digest
      return JSON.parse(prior.get_attribute('PrefabriktenRoof','result'))
    end
    replacement=nil
    if p['replace_roof']
      r=p['replace_roof']
      replacement=model.entities.grep(Sketchup::Group).find { |g| g.persistent_id==r['pid'] && g.get_attribute('PrefabriktenRoof','request_id')==r['request_id'] }
      raise 'Generated replacement roof not found; source geometry cannot be replaced.' unless replacement
    end
    model.start_operation('MCP: 27-200 trapez yerleşimi',true)
    begin
      root=model.entities.add_group;root.name='TRAPEZ 27-200 — 1000 NET — ÖN YERLEŞİM'
      sheets=0;facets=0
      p['patches'].each_with_index do |f,index|
        axis=f['cross_axis'];n=f['plane'].first(3);d=f['plane'][3]
        points=f['polygons'].flatten(1);lo,hi=points.map { |v| v[axis] }.minmax
        count=((hi-lo)/1000.0-0.0000001).ceil
        count.times do |i|
          sheets+=1;raise 'Too many sheets.' if sheets>200
          sheet=root.entities.add_group;sheet.name=format('T%03d / yüzey %d',sheets,index+1)
          a=lo+i*1000;b=[a+1000,hi].min
          cuts=([a,b]+(0..5).flat_map { |j| [21,63,137,179].map { |v| a+j*200+v } }).select { |x| x>=a && x<=b }.sort.uniq
          cuts.each_cons(2) do |left,right|
            f['polygons'].each do |poly|
              q=clip(clip(poly,axis,left,1),axis,right,-1)
              next if q.length<3
              area=q.each_index.sum { |k| q[k][0]*q[(k+1)%q.length][1]-q[(k+1)%q.length][0]*q[k][1] }.abs/2
              next if area<0.01
              vertices=q.map do |x,y|
                z=(d-n[0]*x-n[1]*y)/n[2];h=height((axis==0 ? x : y)-lo)+2
                Geom::Point3d.new((x+n[0]*h).mm,(y+n[1]*h).mm,(z+n[2]*h).mm)
              end
              face=sheet.entities.add_face(vertices)
              raise 'Trapez face failed.' unless face
              face.reverse! if face.normal.z<0
              facets+=1;raise 'Geometry limit reached.' if facets>20000
            end
          end
          sheet.material=Sketchup::Color.new(*(i.even? ? [211,211,211] : [192,192,192]))
          sheet.set_attribute('PrefabriktenRoof','net_width_mm',b-a)
          sheet.set_attribute('PrefabriktenRoof','profile','27/200 nominal; illustrative crest42 valley74; thickness unspecified')
        end
      end
      result={status:'created',roof_pid:root.persistent_id,sheets:sheets,facets:facets,notice:'Preliminary interpreted roof boundary; illustrative 27/200 surface; no thickness, lap or flashings.'}
      root.set_attribute('PrefabriktenRoof','request_id',p['request_id']);root.set_attribute('PrefabriktenRoof','digest',digest);root.set_attribute('PrefabriktenRoof','result',JSON.generate(result))
      replacement.erase! if replacement
      model.commit_operation
      result
    rescue StandardError
      model.abort_operation
      raise
    end
  end
end
