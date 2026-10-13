require_relative 'frame_core'
require_relative 'opening_core'
require 'digest'
require 'cgi'
module Prefabrikten
  module Karkas
    def self.source_panel(source,kind)
      faces=[]
      walk=lambda do |entities,t,depth|
        raise 'Panel grubu çok karmaşık; tek bir panel seçin.' if depth>8 || entities.length>20000
        entities.each do |e|
          next if e.hidden?
          if e.is_a?(Sketchup::Face)
            points=e.outer_loop.vertices.map { |v| v.position.transform(t) }
            next if points.length<4
            v1=points[1]-points[0]
            n=points.drop(2).map { |p| v1.cross(p-points[0]) }.find { |v| v.length>=0.00001 }
            next unless n
            next if n.length<0.00001
            n.normalize!
            next if kind=='wall' && n.dot(Z_AXIS).abs>0.0001
            faces << [e,t,points,n,e.area(t)]
          elsif e.is_a?(Sketchup::Group) || e.is_a?(Sketchup::ComponentInstance)
            walk.call(e.is_a?(Sketchup::Group) ? e.entities : e.definition.entities,t*e.transformation,depth+1)
          end
        end
      end
      walk.call(source.is_a?(Sketchup::Group) ? source.entities : source.definition.entities,source.transformation,0)
      raise 'Uygun panel yüzü bulunamadı.' if faces.empty?
      face,t,points,n=faces.max_by { |v| v[4] }
      if kind=='wall'
        z=Geom::Vector3d.new(0,0,1);x=z.cross(n);x.normalize!
      else
        x=(points[1]-points[0]);x.normalize!;z=x.cross(n);z.normalize!
      end
      y=z.cross(x);y.normalize!
      anchor=points.first
      project=lambda { |p| v=p-anchor; [v.dot(x).to_mm,v.dot(z).to_mm] }
      rect=lambda do |ps|
        xy=ps.map { |p| project.call(p) };lo=[xy.map(&:first).min,xy.map(&:last).min];hi=[xy.map(&:first).max,xy.map(&:last).max]
        raise 'Yalnız dikdörtgen panel/açıklık destekleniyor; eğik veya L sınırı ayrı panellere ayırın.' unless xy.all? { |a,b| ([a-lo[0],a-hi[0]].map(&:abs).min<0.05)&&([b-lo[1],b-hi[1]].map(&:abs).min<0.05) } && xy.length==4
        [lo,hi]
      end
      detection=nil
      if kind=='wall'
        coplanar=faces.select { |f| f[3].dot(n).abs>0.999999 && f[2].all? { |p| ((p-anchor).dot(n)).to_mm.abs<0.05 } }
        geometry=coplanar.map do |f|
          e,ft=f
          [e.outer_loop,*e.loops.reject(&:outer?)].map { |loop| loop.vertices.map { |v| project.call(v.position.transform(ft)) } }
        end
        detection=OpeningCore.detect(geometry)
        lo,hi=detection.values_at(:lo,:hi)
      else
        lo,hi=rect.call(points)
      end
      origin=anchor.offset(x,lo[0].mm).offset(z,lo[1].mm)
      openings=detection ? detection[:openings] : face.loops.reject(&:outer?).map do |loop|
        a,b=rect.call(loop.vertices.map { |v| v.position.transform(t) })
        {x:a[0]-lo[0],z:a[1]-lo[1],width:b[0]-a[0],height:b[1]-a[1]}
      end
      {width:hi[0]-lo[0],height:hi[1]-lo[1],origin:origin,x:x,y:y,z:z,openings:openings,source_pid:source.persistent_id}
    end
    def self.frame_input(width=1500,height=2500,kind='wall',openings=[])
      s=RULES['section']
      labels=['En (mm)','Yükseklik / panel boyu (mm)','Azami dikme/kiriş aksı (mm)','C gövde (mm)','Sac (mm)','Kaplama','Levha yönü','Çapraz düzeni','Özel levha eni (mm)','Özel levha boyu (mm)','Üst ilave kayıt: tepeden orta kot (mm), 0=yok','Statik projedeki azami aks (boş=bilinmiyor)','Statik proje/hesap referansı','Açıklıklar: x/kot/en/boy; ... (mm)','Yerleştirme: panel düzleminden mesafe (mm)','Parça etiketleri','Yatay kayıt düzeni','Açıklık başlığı','Kafes başlık yüksekliği (mm)','Başlık göz aralığı (mm)']
      defaults=[width.round(3).to_s,height.round(3).to_s,'600','90','1.2','Alçıpan','Dikey','Kenar gözleri','','','0','','',openings.map { |o| o.values_at(:x,:z,:width,:height).map { |v| v.round(3) }.join('/') }.join(';'),'200','Hayır',kind=='wall' ? 'Sürekli' : 'Gözlerde bölünmüş','Tek C','500','600']
      lists=['','','',s['webWidths'].join('|'),s['thicknessOptions'].join('|'),'Alçıpan|OSB|BoardeX|Betopan|Özel','Dikey|Yatay','Yok|Sol göz|Kenar gözleri|Tüm gözler','','','','','','','','Evet|Hayır','Sürekli|Gözlerde bölünmüş','Tek C|Kafes (taslak)','','']
      a=UI.inputbox(labels,defaults,lists,"#{kind=='wall' ? 'Duvar' : kind=='roof' ? 'Çatı' : 'Döşeme'} karkası — statik çözüm yapılmaz")
      return unless a
      coating={'Alçıpan'=>'gypsum','OSB'=>'osb','BoardeX'=>'boardex','Betopan'=>'betopan','Özel'=>'custom'}.fetch(a[5])
      os=a[13].to_s.strip.empty? ? [] : a[13].split(';').map do |line|
        vs=line.strip.split('/')
        raise 'Açıklık biçimi x/kot/en/boy olmalı.' unless vs.length==4
        [:x,:z,:width,:height].zip(vs.map.with_index { |v,i| FrameCore.numeric(v,'Açıklık',i<2) }).to_h
      end
      opts={kind:kind,cladding:coating,orientation:a[6]=='Dikey' ? 'vertical' : 'horizontal',
        bracing:{'Yok'=>'none','Sol göz'=>'left','Kenar gözleri'=>'edges','Tüm gözler'=>'all'}.fetch(a[7]),
        top_record_offset:FrameCore.numeric(a[10],'Üst kayıt',true),structural_reference:a[12].to_s,openings:os,labels:a[15]=='Evet',blocking_mode:a[16]=='Sürekli' ? 'continuous' : 'segmented',header_type:a[17]=='Tek C' ? 'single' : 'lattice'}
      if opts[:header_type]=='lattice'
        opts[:header_depth]=number(a[18]);opts[:header_web_spacing]=number(a[19])
      end
      if coating=='custom'
        opts[:board_width]=number(a[8]);opts[:board_length]=number(a[9])
      end
      opts[:structural_max_spacing]=number(a[11]) unless a[11].to_s.strip.empty?
      {dimensions:a.first(5).map { |v| number(v) },options:opts,offset:FrameCore.numeric(a[14],'Yerleştirme mesafesi',true)}
    end
    def self.build_frame(data,transform,name)
      model=Sketchup.active_model
      panel=model.entities.add_group
      panel.name=name
      id="P#{panel.persistent_id}"
      panel.set_attribute('PrefabriktenKarkas','panel_schema',1)
      data[:panel_id]=id
      data[:parts].each_with_index do |p,i|
        p[:id]=format('%s-%04d',id,i+1)
        group=panel.entities.add_group
        group.name="#{p[:id]} #{p[:role]}"
        sec=p[:section]
        face=group.entities.add_face(outline(sec[:web_mm],sec[:thickness_mm]).map { |x,y| [x.mm,y.mm,0] })
        raise 'Kesit oluşturulamadı.' unless face
        face.reverse! if face.normal.z<0
        face.pushpull(p[:length_mm].mm)
        raise 'Profil katı kontrolü başarısız.' unless group.manifold?
        actual=[group.bounds.width.to_mm,group.bounds.height.to_mm,group.bounds.depth.to_mm]
        expected=[sec[:flange_mm],sec[:web_mm],p[:length_mm]]
        raise 'Profil dış ölçü kontrolü başarısız.' unless actual.zip(expected).all? { |a,b| (a-b).abs<0.01 }
        axes=p[:axes].map { |a| Geom::Vector3d.new(a) }
        group.transform!(Geom::Transformation.axes(Geom::Point3d.new(p[:origin_mm].map(&:mm)),*axes))
        group.material={'dikme'=>'LightSteelBlue','yardimci_dikme'=>'LightSteelBlue','ara_kayit'=>'MediumSeaGreen','capraz'=>'Tomato','baslik_caprazi'=>'Tomato'}.fetch(p[:role],'Goldenrod')
        group.set_attribute('PrefabriktenKarkas','part_json',JSON.generate(p))
        group.set_attribute('PrefabriktenKarkas','geometry_signature',frame_signature(group))
        panel.entities.add_text(p[:id],Geom::Point3d.new(p[:origin_mm].map(&:mm))) if data[:labels]
      end
      panel.transform!(transform)
      panel.set_attribute('PrefabriktenKarkas','expected_part_count',data[:parts].length)
      panel.set_attribute('PrefabriktenKarkas','layout_json',JSON.generate(data.reject { |k,_| k==:parts }))
      panel
    end
    def self.frame_signature(group)
      vertices=group.entities.grep(Sketchup::Edge).map { |e| [e.start.position.to_a,e.end.position.to_a].map { |p| p.map { |v| v.round(8) } }.sort }.sort
      faces=group.entities.grep(Sketchup::Face).map { |f| [f.area.round(8),f.loops.length] }.sort
      Digest::SHA256.hexdigest(JSON.generate([vertices,faces,group.transformation.to_a.map { |v| v.round(8) }]))
    end
    def self.export_frame_sheet
      model=Sketchup.active_model
      raise 'Grup düzenlemesinden çıkın.' if model.active_path
      roots=model.selection.grep(Sketchup::Group).select { |g| g.get_attribute('PrefabriktenKarkas','panel_schema')==1 }
      raise 'Pafta için oluşturulmuş tek karkas grubu seçin.' unless roots.length==1
      root=roots.first;d=JSON.parse(root.get_attribute('PrefabriktenKarkas','layout_json'))
      axes=[root.transformation.xaxis,root.transformation.yaxis,root.transformation.zaxis]
      raise 'Panel ölçeklenmiş/eğilmiş; pafta için yeniden oluşturun.' unless axes.all? { |a| (a.length-1).abs<0.000001 } && axes.combination(2).all? { |a,b| a.dot(b).abs<0.000001 }
      parts=root.entities.grep(Sketchup::Group).filter_map do |g|
        raw=g.get_attribute('PrefabriktenKarkas','part_json');next unless raw
        sig=g.get_attribute('PrefabriktenKarkas','geometry_signature')
        raise 'Karkas elle değiştirilmiş veya eski sürümden; pafta için yeniden oluşturun.' unless sig && sig==frame_signature(g)
        JSON.parse(raw)
      end
      raise 'Parça sayısı değişmiş; pafta için yeniden oluşturun.' unless parts.length==root.get_attribute('PrefabriktenKarkas','expected_part_count') && parts.map { |p| p['id'] }.uniq.length==parts.length
      path=UI.savepanel('Panel paftası (SVG) veya metraj (JSON/CSV)','','karkas-pafta.svg');return unless path
      raise 'Dosya mevcut; yeni bir ad seçin.' if File.exist?(path)
      summary=parts.group_by { |p| [p['role'],p['section']['web_mm'],p['section']['thickness_mm']] }.map do |key,ps|
        {role:key[0],web_mm:key[1],thickness_mm:key[2],quantity:ps.length,total_length_m:ps.sum { |p| p['length_mm'] }/1000.0,nominal_end_faces:ps.length*2,stud_pass_locations:ps.sum { |p| Array(p['pass_through_studs_mm']).length }}
      end
      case File.extname(path).downcase
      when '.json'
        File.write(path,JSON.pretty_generate({status:'draft_not_for_manufacture',panel:d,summary:summary,parts:parts}))
      when '.csv'
        csv=CSV.generate(col_sep:';') do |out|
          out << ['Tür','Gövde mm','Sac mm','Parça / kesim boyu adedi','Toplam boy m','Uç yüzü adedi (makine kesimi değil)','Dikme geçiş yeri adedi','Durum']
          summary.each { |s| out << s.values+['Statik/imalat doğrulanmadı'] }
        end
        File.write(path,"\uFEFF"+csv)
      when '.svg'
        w=d['width_mm'];h=d['height_mm'];margin=[w,h].max*0.12;font=[w,h].max/95.0
        svg=[%(<svg xmlns="http://www.w3.org/2000/svg" viewBox="#{-margin} #{-margin} #{w+2*margin} #{h+3*margin}" width="1000" height="1000">),'<rect x="-100000" y="-100000" width="200000" height="200000" fill="white"/>']
        parts.each do |p|
          a,b=p.fetch('centreline_mm');color=p['role']=='capraz' ? '#c33' : p['role']=='ara_kayit' ? '#287b54' : '#345c85'
          svg << %(<line x1="#{a[0]}" y1="#{h-a[1]}" x2="#{b[0]}" y2="#{h-b[1]}" stroke="#{color}" stroke-width="#{p['section']['flange_mm']}"/> )
          svg << %(<text x="#{(a[0]+b[0])/2}" y="#{h-(a[1]+b[1])/2}" font-size="#{font}" fill="black">#{CGI.escapeHTML(p['id'])}</text>)
        end
        svg << %(<rect x="0" y="0" width="#{w}" height="#{h}" fill="none" stroke="black" stroke-width="2"/>)
        svg << %(<text x="0" y="#{-font}" font-size="#{font}">#{CGI.escapeHTML(root.name)} — #{w.round(2)} × #{h.round(2)} mm</text>)
        svg << %(<text x="0" y="#{h+font*2}" font-size="#{font}">TASLAK — STATİK / İMALAT DOĞRULANMADI — #{parts.length} parça / #{(parts.sum { |p| p['length_mm'] }/1000.0).round(2)} m / #{parts.length*2} uç yüzü (makine kesim adedi değil)</text></svg>)
        File.write(path,svg.join("\n"))
      else
        raise 'Dosya uzantısı svg, json veya csv olmalı.'
      end
      UI.messagebox('Pafta/metraj kaydedildi. Statik veya makine imalat onayı değildir.')
    rescue StandardError=>e
      UI.messagebox("Dışa aktarılamadı: #{e.message}")
    end
    def self.convert_selection(kind='wall')
      model=Sketchup.active_model
      raise 'Grup düzenlemesinden çıkıp kök seviyede panel gruplarını seçin.' if model.active_path
      sources=model.selection.to_a
      raise 'En az bir duvar/çatı/döşeme grubu seçin.' if sources.empty? || sources.any? { |e| !e.is_a?(Sketchup::Group) && !e.is_a?(Sketchup::ComponentInstance) }
      raise 'Bir işlemde en fazla20panel.' if sources.length>20
      descriptors=sources.map { |s| source_panel(s,kind) }
      first=descriptors.first
      if kind=='wall'
        summary=descriptors.each_with_index.map do |d,i|
          lines=d[:openings].map { |o| "#{o[:z]<0.05 ? 'Kapı' : 'Pencere'}: x=#{o[:x].round(1)}, kot=#{o[:z].round(1)}, #{o[:width].round(1)} × #{o[:height].round(1)} mm" }
          "Duvar #{i+1}: #{lines.empty? ? 'açıklık yok' : lines.join('; ')}"
        end
        UI.messagebox("Geometriden algılanan açıklıklar:\n"+summary.join("\n")+"\nİlk duvarın ölçülerini sonraki pencerede düzenleyebilirsiniz.")
      end
      input=frame_input(first[:width],first[:height],kind,first[:openings]);return unless input
      raise 'Dönüşümde kaynak ölçülerini değiştirmeyin; yeni panel komutunu kullanın.' unless (input[:dimensions][0]-first[:width]).abs<0.01 && (input[:dimensions][1]-first[:height]).abs<0.01
      plans=descriptors.map.with_index do |d,i|
        opts=input[:options].merge(openings:i==0 ? input[:options][:openings] : d[:openings])
        data=FrameCore.layout(d[:width],d[:height],*input[:dimensions][2..],RULES,opts)
        data[:source_pid]=d[:source_pid];data[:labels]=opts[:labels]
        origin=d[:origin].offset(d[:y],input[:offset].mm)
        [data,Geom::Transformation.axes(origin,d[:x],d[:y],d[:z])]
      end
      model.start_operation('Seçili panelleri çeliğe dönüştür',true)
      begin
        plans.each { |data,t| build_frame(data,t,"#{kind.upcase} — ÇELİK KARKAS TASLAĞI") }
        model.commit_operation
      rescue StandardError
        model.abort_operation;raise
      end
      UI.messagebox("#{plans.length} karkas oluşturuldu. Orijinaller korundu.\n"+plans.flat_map { |p| p[0][:warnings] }.uniq.join("\n"))
    rescue StandardError => e
      UI.messagebox("Dönüşüm yapılamadı: #{e.message}")
    end
    def self.create_frame
      model=Sketchup.active_model
      raise 'Grup düzenlemesinden çıkın.' if model.active_path
      input=frame_input;return unless input
      data=FrameCore.layout(*input[:dimensions],RULES,input[:options]);data[:labels]=input[:options][:labels]
      model.start_operation('Yeni çelik panel',true)
      begin
        build_frame(data,Geom::Transformation.new,"DUVAR — ÇELİK KARKAS TASLAĞI")
        model.commit_operation
      rescue StandardError
        model.abort_operation;raise
      end
      UI.messagebox("#{data[:parts].length} parça / #{data[:fabrication_summary][:total_length_m].round(2)} m profil.\n"+data[:warnings].join("\n"))
    rescue StandardError=>e
      UI.messagebox("Panel oluşturulamadı: #{e.message}")
    end
    def self.inspect_frames
      roots=Sketchup.active_model.entities.grep(Sketchup::Group).select { |g| g.get_attribute('PrefabriktenKarkas','panel_schema')==1 }
      raise 'Oluşturulmuş karkas bulunamadı.' if roots.empty?
      lines=roots.map do |root|
        d=JSON.parse(root.get_attribute('PrefabriktenKarkas','layout_json'))
        "#{root.name}:\n"+Array(d['warnings']).join("\n")
      end
      UI.messagebox(lines.join("\n\n"))
    rescue StandardError=>e
      UI.messagebox(e.message)
    end
  end
end
