require 'csv'
require_relative 'panel_core'
module Prefabrikten
  module Karkas
    def self.create_panel
      model = Sketchup.active_model
      unless model.entities.length == 0 && model.path.empty? && !model.active_path
        UI.messagebox('Panel denemesi için ayrı boş model açın. Mevcut çizime ekleme yapılmadı.')
        return
      end
      s = RULES['section']
      input = UI.inputbox(['Panel dış eni (mm)','Panel dış yüksekliği (mm)','En fazla dikme aks aralığı (mm)','C gövde / panel derinliği (mm)','Sac kalınlığı (mm)'],
        ['3000','2800','600','90','1.2'],['','','',s['webWidths'].join('|'),s['thicknessOptions'].join('|')], 'Duvar paneli taslağı')
      return unless input
      data = PanelCore.layout(*input.map { |v| number(v) }, RULES)
      model.start_operation('Duvar paneli taslağı',true)
      begin
        panel = model.entities.add_group
        panel.name = 'P01 — DUVAR PANELİ TASLAĞI'
        panel.set_attribute('PrefabriktenKarkas','panel_schema',1)
        panel.set_attribute('PrefabriktenKarkas','layout_json',JSON.generate(data.reject { |k,_| k==:parts }))
        data[:parts].each do |part|
          group = panel.entities.add_group
          group.name = "#{part[:id]} #{part[:role]} — TASLAK"
          sec = part[:section]
          face = group.entities.add_face(outline(sec[:web_mm],sec[:thickness_mm]).map { |x,y| [x.mm,y.mm,0] })
          raise 'Profil yüzeyi oluşturulamadı.' unless face
          face.reverse! if face.normal.z < 0
          face.pushpull(part[:length_mm].mm)
          raise 'Profil kapalı katı değil.' unless group.manifold?
          actual = [group.bounds.width.to_mm,group.bounds.height.to_mm,group.bounds.depth.to_mm]
          expected = [sec[:flange_mm],sec[:web_mm],part[:length_mm]]
          raise 'Profil dış ölçü kontrolü başarısız.' unless actual.zip(expected).all? { |a,b| (a-b).abs < 0.01 }
          axes = part[:axes].map { |a| Geom::Vector3d.new(a) }
          group.transform!(Geom::Transformation.axes(Geom::Point3d.new(part[:origin_mm].map(&:mm)),*axes))
          group.set_attribute('PrefabriktenKarkas','part_json',JSON.generate(part))
          group.material = part[:role]=='dikme' ? 'LightSteelBlue' : 'Goldenrod'
          panel.entities.add_text(part[:id],Geom::Point3d.new(part[:origin_mm].map(&:mm)))
        end
        model.commit_operation
      rescue StandardError
        model.abort_operation
        raise
      end
      model.active_view.zoom_extents
      UI.messagebox("#{data[:parts].length} parça oluşturuldu. Dikme aksı: #{data[:actual_centre_spacing_mm].round(2)} mm.\n"+data[:warnings].join("\n"))
    rescue StandardError => e
      UI.messagebox("Panel oluşturulamadı: #{e.message}")
    end
    def self.panel_parts
      roots = Sketchup.active_model.entities.grep(Sketchup::Group).select { |g| g.get_attribute('PrefabriktenKarkas','panel_schema')==1 }
      raise 'Bu modelde eklentinin oluşturduğu panel yok.' if roots.empty?
      # Geometry may have been edited manually; do not silently export stale dimensions.
      parts = roots.flat_map do |panel|
        panel.entities.grep(Sketchup::Group).filter_map do |group|
          raw = group.get_attribute('PrefabriktenKarkas','part_json')
          next unless raw
          part = JSON.parse(raw)
          part['export_notice']='Kayıtlı taslak ölçüler; elle yapılan geometri değişiklikleri ölçülmedi.'
          part
        end
      end
      raise 'Panel parça kayıtları bulunamadı.' if parts.empty?
      parts
    end
    def self.export_panel
      parts = panel_parts
      path = UI.savepanel('Panel taslak parça listesi — imalat için değildir','','P01-taslak.json')
      return unless path
      if File.extname(path).downcase=='.csv'
        csv = CSV.generate(col_sep:';') do |out|
          out << ['Durum','Parça','Tür','Taslak boy (mm)','Gövde (mm)','Kanat (mm)','Dudak (mm)','Sac (mm)','İşlemler','Uyarı']
          parts.each do |p|
            s=p['section']
            out << [p['status'],p['id'],p['role'],p['length_mm'],s['web_mm'],s['flange_mm'],s['lip_mm'],s['thickness_mm'],JSON.generate(p['operations']),p['export_notice']]
          end
        end
        File.write(path,"\uFEFF"+csv)
      else
        File.write(path,JSON.pretty_generate({schema:1,status:'draft_not_for_manufacture',parts:parts}))
      end
      UI.messagebox('Taslak liste kaydedildi. Bu liste makine dosyası veya doğrulanmış kesim listesi değildir.')
    rescue StandardError => e
      UI.messagebox("Liste kaydedilemedi: #{e.message}")
    end
  end
end
