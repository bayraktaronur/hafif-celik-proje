require 'json'
require 'digest'
module PrefabriktenMCPPanel
  KEYS=%w[request_id width_mm height_mm spacing_mm web_mm thickness_mm cladding orientation bracing top_record_offset_mm origin_mm].freeze
  def self.validate(p)
    raise 'Invalid panel parameters.' unless p.is_a?(Hash) && (p.keys-KEYS).empty?
    raise 'request_id must be a UUID.' unless p['request_id'].is_a?(String) && p['request_id'].match?(/\A[0-9a-f-]{36}\z/)
    %w[width_mm height_mm spacing_mm web_mm thickness_mm].each do |k|
      v=p[k];raise "Invalid #{k}." unless v.is_a?(Numeric) && v.finite? && v>0 && v<=20000
    end
    raise 'Invalid cladding.' unless %w[gypsum osb boardex betopan].include?(p['cladding'])
    raise 'Invalid orientation.' unless %w[vertical horizontal].include?(p['orientation'])
    raise 'Invalid bracing.' unless %w[none left edges all].include?(p['bracing'])
    t=p.fetch('top_record_offset_mm',0)
    raise 'Invalid top record.' unless t.is_a?(Numeric) && t.finite? && t>=0 && t<20000
    o=p['origin_mm']
    raise 'origin_mm must contain three finite coordinates.' unless o.is_a?(Array) && o.length==3 && o.all? { |v| v.is_a?(Numeric) && v.finite? && v.abs<=1000000 }
    p
  end
  def self.create(req)
    model=Sketchup.active_model
    raise 'Model changed; refresh sessions.' unless req['model_guid']==model.guid
    raise 'Exit group editing first.' if model.active_path
    p=validate(req.fetch('panel'))
    digest=Digest::SHA256.hexdigest(JSON.generate(p.sort.to_h))
    previous=model.entities.grep(Sketchup::Group).find { |g| g.get_attribute('PrefabriktenMCP','request_id')==p['request_id'] }
    if previous
      raise 'Request ID reused with different parameters.' unless previous.get_attribute('PrefabriktenMCP','digest')==digest
      return JSON.parse(previous.get_attribute('PrefabriktenMCP','result'))
    end
    package=File.join(__dir__,'prefabrikten_karkas','main.rb')
    package=File.expand_path('../prefabrikten_karkas/main.rb',__dir__) unless File.file?(package)
    require package
    k=Prefabrikten::Karkas
    data=k::FrameCore.layout(p['width_mm'],p['height_mm'],p['spacing_mm'],p['web_mm'],p['thickness_mm'],k::RULES,
      {cladding:p['cladding'],orientation:p['orientation'],bracing:p['bracing'],top_record_offset:p.fetch('top_record_offset_mm',0)})
    model.start_operation('MCP: yeni karkas paneli',true)
    begin
      panel=k.build_frame(data,Geom::Transformation.translation(p['origin_mm'].map(&:mm)),"MCP — #{p['width_mm']} × #{p['height_mm']} mm KARKAS TASLAĞI")
      result={status:'created',panel_pid:panel.persistent_id,request_id:p['request_id'],parts:data[:parts].length,
        model_guid:model.guid,stud_centres_mm:data[:stud_centres_mm],blocking_rows_mm:data[:blocking_rows_mm],warnings:data[:warnings]}
      panel.set_attribute('PrefabriktenMCP','request_id',p['request_id'])
      panel.set_attribute('PrefabriktenMCP','digest',digest)
      panel.set_attribute('PrefabriktenMCP','result',JSON.generate(result))
      model.commit_operation
      result
    rescue StandardError
      model.abort_operation
      raise
    end
  end
end
