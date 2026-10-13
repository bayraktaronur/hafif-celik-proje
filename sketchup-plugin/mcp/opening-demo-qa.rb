require_relative 'prefabrikten_mcp_opening_demo'
module Sketchup
  class Group;end
  class ComponentInstance;end
  def self.active_model;@model;end
  def self.active_model=(m);@model=m;end
  def self.find_support_file(*);'C:/installed/Templates';end
end
class DemoTestModel
  attr_accessor :active_path,:path,:entities
  def initialize;@path='C:/customer/model.skp';@entities=[];end
  def guid;'test';end
end
m=DemoTestModel.new;Sketchup.active_model=m
r={'model_guid'=>'test','request_id'=>'11111111-1111-1111-1111-111111111111'}
def fails(req,part)
  begin
    PrefabriktenMCPOpeningDemo.create(req)
  rescue RuntimeError=>e
    raise unless e.message.include?(part)
    return
  end
  raise 'Guard failed'
end
fails(r.merge('model_guid'=>'other'),'changed')
fails(r.merge('request_id'=>'../invalid'),'Invalid request')
fails(r,'Demo requires')
m.path='';m.entities=[Object.new];fails(r,'Demo requires')
m.active_path=[1];fails(r,'editing')
puts 'PASS: model GUID, UUID, existing/customer model, nonempty new model and edit context guards.'
