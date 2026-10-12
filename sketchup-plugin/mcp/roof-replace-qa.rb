require_relative 'prefabrikten_mcp_roof'
class Numeric
  def mm; self; end
end
module Geom
  class Point3d
    def initialize(*); end
  end
end
module Sketchup
  class Color
    def initialize(*); end
  end
  class Group
    attr_accessor :name,:material,:erased
    attr_reader :entities,:persistent_id
    def initialize(id); @persistent_id=id; @attrs={}; @entities=Entities.new; end
    def get_attribute(d,k); @attrs[[d,k]]; end
    def set_attribute(d,k,v); @attrs[[d,k]]=v; end
    def erase!; @erased=true; end
  end
  def self.active_model; @model; end
  def self.active_model=(m); @model=m; end
end
class Entities < Array
  def add_text(code,point); self << code; end
  def add_group; g=Sketchup::Group.new(100+length); self << g; g; end
  def add_face(*)
    raise 'geometry failed' if Sketchup.active_model.fail
    Struct.new(:normal).new(Struct.new(:z).new(1))
  end
end
class Model
  attr_accessor :fail
  attr_reader :entities,:commits,:aborts
  def initialize; @entities=Entities.new; @commits=0; @aborts=0; end
  def guid; 'test'; end
  def active_path; nil; end
  def start_operation(*); @before=@entities.dup; end
  def commit_operation; @commits+=1; end
  def abort_operation; @entities.replace(@before); @aborts+=1; end
end
m=Model.new; Sketchup.active_model=m
old=m.entities.add_group; old.set_attribute('PrefabriktenRoof','request_id','11111111-1111-1111-1111-111111111111')
source=m.entities.add_group
p={'request_id'=>'22222222-2222-2222-2222-222222222222','replace_roof'=>{'pid'=>old.persistent_id,'request_id'=>'11111111-1111-1111-1111-111111111111'},'patches'=>[{'plane'=>[0,0,1,3000],'cross_axis'=>0,'polygons'=>[[[0,0],[1000,0],[1000,3000],[0,3000]]]}]}
req={'model_guid'=>'test','roof'=>p}
begin
  PrefabriktenMCPRoof.create(req.merge('roof'=>p.merge('replace_roof'=>p['replace_roof'].merge('pid'=>source.persistent_id))))
  raise 'Source was replaceable'
rescue RuntimeError=>e
  raise unless e.message.include?('not found')
end
raise unless m.commits==0 && !old.erased && !source.erased
m.fail=true
begin
  PrefabriktenMCPRoof.create(req)
rescue RuntimeError=>e
  raise unless e.message=='geometry failed'
end
raise unless m.aborts==1 && m.entities.length==2 && !old.erased
m.fail=false
PrefabriktenMCPRoof.create(req)
raise unless old.erased && !source.erased && m.commits==1
raise unless m.entities.last.entities.first.entities.grep(String)==['T001']
PrefabriktenMCPRoof.create(req)
raise unless m.commits==1 && m.entities.length==3
puts 'PASS: source protection, failed geometry preserves old roof, atomic replacement and idempotent retry.'
