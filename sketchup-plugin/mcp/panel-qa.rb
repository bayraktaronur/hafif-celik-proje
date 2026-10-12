require_relative 'prefabrikten_mcp_panel'
p={'request_id'=>'12345678-1234-1234-1234-123456789abc','width_mm'=>1500,'height_mm'=>2500,'spacing_mm'=>600,'web_mm'=>90,'thickness_mm'=>1.2,'cladding'=>'gypsum','orientation'=>'vertical','bracing'=>'left','origin_mm'=>[3000,0,0]}
raise unless PrefabriktenMCPPanel.validate(p)==p
[p.merge('code'=>'eval'),p.merge('origin_mm'=>[Float::INFINITY,0,0]),p.merge('width_mm'=>-1),p.merge('request_id'=>'../x'),p.merge('cladding'=>'unknown')].each do |bad|
  begin
    PrefabriktenMCPPanel.validate(bad)
  rescue StandardError
    next
  end
  raise 'Invalid input accepted'
end
Dir[File.join(__dir__,'*.rb')].each { |file| RubyVM::InstructionSequence.compile_file(file) }
class Numeric
  def mm;self;end
end
module Geom
  class Transformation
    def self.translation(v);v;end
  end
end
module Sketchup
  class Group
    def initialize;@attrs={};end
    def persistent_id;55;end
    def set_attribute(d,k,v);@attrs[[d,k]]=v;end
    def get_attribute(d,k);@attrs[[d,k]];end
  end
  def self.active_model;@model;end
  def self.active_model=(v);@model=v;end
end
class TestModel
  attr_accessor :active_path
  attr_reader :entities,:commits,:aborts
  def initialize;@entities=[];@commits=0;@aborts=0;end
  def guid;'model-a';end
  def start_operation(*);@before=@entities.dup;end
  def commit_operation;@commits+=1;end
  def abort_operation;@entities=@before;@aborts+=1;end
end
module Prefabrikten
  module Karkas
    RULES={}
    module FrameCore
      def self.layout(*);{parts:[{}],stud_centres_mm:[22.5,600],blocking_rows_mm:[1250],warnings:['draft']};end
    end
    def self.build_frame(*)
      g=Sketchup::Group.new;Sketchup.active_model.entities << g
      raise 'test geometry failure' if @fail
      g
    end
    def self.fail=(v);@fail=v;end
  end
end
$LOADED_FEATURES << File.expand_path('../prefabrikten_karkas/main.rb',__dir__)
model=TestModel.new;Sketchup.active_model=model
req={'model_guid'=>'model-a','panel'=>p}
first=PrefabriktenMCPPanel.create(req)
raise unless first[:panel_pid]==55 && model.commits==1
PrefabriktenMCPPanel.create(req)
raise 'Retry duplicated panel' unless model.entities.length==1 && model.commits==1
begin
  PrefabriktenMCPPanel.create(req.merge('panel'=>p.merge('width_mm'=>1600)))
  raise 'Digest guard failed'
rescue RuntimeError=>e
  raise unless e.message.include?('reused')
end
Prefabrikten::Karkas.fail=true
begin
  PrefabriktenMCPPanel.create(req.merge('panel'=>p.merge('request_id'=>'22345678-1234-1234-1234-123456789abc')))
rescue RuntimeError=>e
  raise unless e.message=='test geometry failure'
end
raise 'Atomic rollback failed' unless model.aborts==1 && model.entities.length==1
puts 'PASS: Ruby input guards, idempotent retry, parameter mismatch and transaction rollback (mock geometry). Live SketchUp not executed.'
