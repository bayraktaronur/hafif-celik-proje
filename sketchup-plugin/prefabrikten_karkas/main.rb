require 'json'
require_relative 'panel'
module Prefabrikten
  module Karkas
    RULES = JSON.parse(File.read(File.join(__dir__, 'profile-rules.json'))) unless const_defined?(:RULES)
    def self.number(value)
      n = Float(value.to_s.strip.tr(',', '.'))
      raise ArgumentError, 'Pozitif sonlu bir ölçü girin.' unless n.finite? && n > 0
      n
    end
    def self.parameters
      s = RULES.fetch('section')
      values = UI.inputbox(['Gövde dış ölçüsü (mm)', 'Profil sacı (mm)', 'Boy (mm)', 'Dışta kalan profil sacı (mm)'],
        ['90', '1.2', '1000', '1.2'],
        [s['webWidths'].join('|'), s['thicknessOptions'].join('|'), '', s['thicknessOptions'].join('|')], 'C profil — deneme')
      return unless values
      w, t, length, receiving = values.map { |v| number(v) }
      raise ArgumentError, 'Listeden kesit ve sac kalınlığı seçin.' unless s['webWidths'].include?(w) && s['thicknessOptions'].include?(t) && s['thicknessOptions'].include?(receiving)
      [w, t, length, receiving]
    end
    # Sharp-corner prototype: exterior dimensions remain fixed at every thickness.
    def self.outline(w, t)
      f = RULES['section']['flange']; l = RULES['section']['lip']
      [[0,0],[f,0],[f,l],[f-t,l],[f-t,t],[t,t],[t,w-t],
       [f-t,w-t],[f-t,w-l],[f,w-l],[f,w],[0,w]]
    end
    def self.create_profile
      model = Sketchup.active_model
      unless model.entities.length == 0 && model.path.empty? && !model.active_path
        UI.messagebox('Profil denemesi için ayrı, boş ve kaydedilmemiş bir model açın. Mevcut projeye ekleme yapılmadı.')
        return
      end
      p = parameters
      return unless p
      w,t,length,receiving = p
      model.start_operation('C profil denemesi', true)
      begin
        group = model.entities.add_group
        group.name = "C #{w}x45x12.5 t#{t} L#{length} — DENEME"
        points = outline(w,t).map { |x,y| [x.mm,y.mm,0] }
        face = group.entities.add_face(points)
        raise 'Kesit yüzeyi oluşturulamadı.' unless face
        face.reverse! if face.normal.z < 0
        face.pushpull(length.mm)
        target = w - 2 * receiving - RULES['nesting']['totalClearance']
        {'web_mm'=>w,'flange_mm'=>45,'lip_mm'=>12.5,'thickness_mm'=>t,
         'length_mm'=>length,'receiving_thickness_mm'=>receiving,
         'target_end_width_mm'=>target,'status'=>'prototype_unformed'}.each do |key,val|
          group.set_attribute('PrefabriktenKarkas',key,val)
        end
        model.commit_operation
        model.active_view.zoom_extents
        UI.messagebox("Düz C profil oluşturuldu.\nGeçme hedefi: #{target.round(3)} mm\nEzme ve dudak kesimi geometriye henüz uygulanmadı. Büküm yarıçapları modellenmedi.")
      rescue StandardError
        model.abort_operation
        raise
      end
    rescue StandardError => e
      UI.messagebox("Profil oluşturulamadı: #{e.message}")
    end
    def self.inspect_model
      model = Sketchup.active_model
      counts = Hash.new(0)
      model.entities.each { |e| counts[e.typename] += 1 }
      selected = model.selection.map do |e|
        {type:e.typename, name:(e.respond_to?(:name) ? e.name : nil),
         local_bounds_mm: [e.bounds.width,e.bounds.height,e.bounds.depth].map { |v| v.to_mm.round(3) }}
      end
      report = {schema:1, title:model.title, path:model.path, modified:model.modified?,
        scope:'top_level_only', counts:counts, definitions:model.definitions.count,
        selection:selected, note:'Bounding box is not profile section or fabrication length.'}
      path = UI.savepanel('Salt okunur inceleme raporu', '', 'karkas-inceleme.json')
      return unless path
      File.write(path, JSON.pretty_generate(report))
      UI.messagebox('Rapor kaydedildi. Model geometrisi değiştirilmedi.')
    rescue StandardError => e
      UI.messagebox("Rapor oluşturulamadı: #{e.message}")
    end
    unless file_loaded?(__FILE__)
      menu = UI.menu('Extensions').add_submenu('Prefabrikten Karkas 0.3.0')
      menu.add_item('Boş modelde duvar paneli taslağı') { create_panel }
      menu.add_item('Panel taslak listesini kaydet (JSON/CSV)') { export_panel }
      menu.add_item('Boş modelde C profil denemesi') { create_profile }
      menu.add_item('Model inceleme raporu (salt okunur)') { inspect_model }
      file_loaded(__FILE__)
    end
  end
end
