require 'sketchup.rb'
require 'json'
require 'fileutils'
require 'time'

# Bounded commands only. No eval, deletion, save or arbitrary file commands.
module PrefabriktenInspect
  ROOT = File.join(ENV.fetch('LOCALAPPDATA'), 'Prefabrikten', 'SketchUpMCP')
  DIR = File.join(ROOT, Process.pid.to_s)
  FileUtils.mkdir_p(DIR)
  def self.write(name, value)
    path = File.join(DIR, name)
    File.write(path + '.tmp', JSON.generate(value))
    File.rename(path + '.tmp', path)
  end
  def self.mm(point)
    point.to_a.map { |v| v.to_mm.round(6) }
  end
  def self.read_model(req)
    model = Sketchup.active_model
    raise 'Model changed; list sessions again.' unless req['model_guid'] == model.guid
    entities = model.entities
    transform = Geom::Transformation.new
    path = req.fetch('path', [])
    raise 'Invalid instance path.' unless path.is_a?(Array) && path.length <= 30
    path.each do |pid|
      entity = entities.find { |e| e.persistent_id == pid }
      raise 'Instance path not found.' unless entity.is_a?(Sketchup::Group) || entity.is_a?(Sketchup::ComponentInstance)
      transform *= entity.transformation
      entities = entity.is_a?(Sketchup::Group) ? entity.entities : entity.definition.entities
    end
    offset = req.fetch('offset', 0)
    limit = req.fetch('limit', 100)
    raise 'Invalid page.' unless offset.is_a?(Integer) && offset >= 0 && limit.is_a?(Integer) && (1..300).include?(limit)
    items = entities.to_a.slice(offset, limit) || []
    result = items.map do |e|
      item = {pid:e.persistent_id, type:e.typename, hidden:e.hidden?, tag:e.layer.name}
      if e.is_a?(Sketchup::Group) || e.is_a?(Sketchup::ComponentInstance)
        t = transform * e.transformation
        children = e.is_a?(Sketchup::Group) ? e.entities : e.definition.entities
        bounds = e.is_a?(Sketchup::Group) ? e.local_bounds : e.definition.bounds
        item.merge!(name:e.name, definition:e.definition.name, path:path+[e.persistent_id], child_count:children.length,
          origin_mm:mm(t.origin), axes:[t.xaxis.to_a,t.yaxis.to_a,t.zaxis.to_a],
          world_bounds_corners_mm:(0..7).map { |i| mm(bounds.corner(i).transform(t)) })
      elsif e.is_a?(Sketchup::Edge)
        a=e.start.position.transform(transform); b=e.end.position.transform(transform)
        item.merge!(start_mm:mm(a), end_mm:mm(b), length_mm:a.distance(b).to_mm.round(6))
        item[:curve_type]=e.curve.class.name if e.curve
      elsif e.is_a?(Sketchup::Face)
        item[:loops_mm]=e.loops.map { |loop| loop.vertices.map { |v| mm(v.position.transform(transform)) } }
      elsif e.is_a?(Sketchup::Text)
        item[:text]=e.text
      end
      item
    end
    {title:model.title, model_guid:model.guid, path:path, coordinates:'world_mm', total:entities.length,
      next_offset:offset+items.length, complete:offset+items.length>=entities.length, entities:result,
      note:'Bounds are not fabrication lengths. Face loops and edge endpoints are actual transformed geometry.'}
  end
  def self.tick
    model=Sketchup.active_model
    write('session.json', {pid:Process.pid, title:model.title, file:model.path, model_guid:model.guid,
      modified:model.modified?, entity_count:model.entities.length, selection_ids:model.selection.map(&:persistent_id),
      active_path:(model.active_path || []).map(&:persistent_id), updated_at:Time.now.utc.iso8601,
      bridge_version:'0.3.2', read_only:false, capabilities:['read_entities','create_panel','create_roof']})
    # Do not glob a Windows ENV path: backslashes are glob escape characters.
    Dir.children(DIR).grep(/\Arequest-[0-9a-f-]{36}\.json\z/).first(1).each do |name|
      file=File.join(DIR, name)
      id=name[8...-5]
      begin
        req=JSON.parse(File.read(file))
        result=case req['command']
        when 'read_entities' then read_model(req)
        when 'create_panel' then PrefabriktenMCPPanel.create(req)
        when 'create_roof' then PrefabriktenMCPRoof.create(req)
        else raise 'Unsupported command.'
        end
        write("response-#{id}.json", {result:result})
      rescue StandardError => e
        write("response-#{id}.json", {error:e.message})
      ensure
        File.delete(file) if File.exist?(file)
      end
    end
  rescue StandardError => e
    warn "Prefabrikten MCP: #{e.message}"
  end
  unless @timer
    @timer=UI.start_timer(1.0, true) { tick }
  end
end

require_relative 'prefabrikten_mcp_panel'
require_relative 'prefabrikten_mcp_roof'
