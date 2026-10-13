require 'json'
module PrefabriktenMCPOpeningDemo
  def self.create(req)
    model=Sketchup.active_model
    raise 'Model changed; refresh sessions.' unless model.guid==req['model_guid']
    raise 'Exit group editing.' if model.active_path
    id=req['request_id']
    raise 'Invalid request ID.' unless id.is_a?(String) && id.match?(/\A[0-9a-f-]{36}\z/)
    prior=model.entities.grep(Sketchup::Group).find { |g| g.get_attribute('PrefabriktenOpeningDemo','request_id')==id }
    return JSON.parse(prior.get_attribute('PrefabriktenOpeningDemo','result')) if prior
    template=File.join(Sketchup.find_support_file('Templates'),'Temp01a - Simple.skp').tr('\\','/')
    is_template=model.path.tr('\\','/').casecmp?(template)
    safe_model=(model.path.empty? || is_template) && model.entities.length<=1 && model.entities.all? { |e| e.is_a?(Sketchup::ComponentInstance) }
    raise 'Demo requires an empty new model or the unmodified installed Simple template.' unless safe_model && (!is_template || !model.modified?)
    require File.join(__dir__,'prefabrikten_karkas','main.rb')
    k=Prefabrikten::Karkas
    model.start_operation('MCP: kapı pencere dönüşüm denemesi',true)
    begin
      source=model.entities.add_group;source.name='DENEME — KAPI PENCERELİ DUVAR 3600x2800'
      outline=[[0,0],[600,0],[600,2100],[1500,2100],[1500,0],[3600,0],[3600,2800],[0,2800]]
      wall=source.entities.add_face(outline.map { |x,z| [x.mm,0,z.mm] })
      hole=source.entities.add_face([[2100,800],[2700,800],[2700,1800],[2100,1800]].map { |x,z| [x.mm,0,z.mm] })
      hole.erase!
      wall.pushpull(100.mm)
      d=k.source_panel(source,'wall')
      actual=d[:openings].map { |o| [o[:z],o[:width],o[:height]].map { |v| v.round(1) } }.sort
      raise "Opening detection mismatch: #{actual}" unless actual==[[0.0,900.0,2100.0],[800.0,600.0,1000.0]]
      data=k::FrameCore.layout(d[:width],d[:height],600,80,1,k::RULES,{cladding:'gypsum',orientation:'vertical',bracing:'all',openings:d[:openings]})
      data[:labels]=true;data[:source_pid]=source.persistent_id
      panel=k.build_frame(data,Geom::Transformation.axes(d[:origin].offset(d[:y],300.mm),d[:x],d[:y],d[:z]),'DENEME — OTOMATİK BOŞLUKLU ÇELİK KARKAS')
      result={status:'created',source_pid:source.persistent_id,panel_pid:panel.persistent_id,openings:d[:openings],parts:data[:parts].length,roles:data[:parts].group_by { |p| p[:role] }.transform_values(&:length),notice:'Real source geometry detected; source preserved; framing draft, not structural approval.'}
      panel.set_attribute('PrefabriktenOpeningDemo','request_id',id)
      panel.set_attribute('PrefabriktenOpeningDemo','result',JSON.generate(result))
      model.commit_operation
      model.active_view.zoom_extents
      result
    rescue StandardError
      model.abort_operation
      raise
    end
  end
end
