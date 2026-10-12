require 'json'
require 'tmpdir'
base = __dir__ + '/'
output = File.join(Dir.tmpdir, 'prefabrikten-panel-core-qa.json')
begin
  Dir[base+'**/*.rb'].each { |file| RubyVM::InstructionSequence.compile_file(file) }
  require base+'prefabrikten_karkas/panel_core'
  rules = JSON.parse(File.read(base+'profile-rules.json'))
  core = Prefabrikten::Karkas::PanelCore
  results = []
  rules['section']['webWidths'].each do |web|
    rules['section']['thicknessOptions'].each do |t|
      panel=core.layout(3000,2800,600,web,t,rules)
      raise 'wrong count' unless panel[:parts].length==8
      raise 'spacing' unless panel[:actual_centre_spacing_mm]<=600
      raise 'length' unless panel[:parts].last[:length_mm]==2800-2*t
      raise 'last stud' unless panel[:parts].last[:origin_mm][0]==3000
      raise 'ids' unless panel[:parts].map { |p| p[:id] }.uniq.length==8
      raise 'operation count' unless panel[:parts].last[:operations].length==4
      results << [web,t]
    end
  end
  [[89,2800,600,90,1.2],[3000,80,600,90,1.2],[3000,2800,44,90,1.2],[3000,2800,600,91,1.2],[3000,2800,600,90,0.9]].each do |args|
    rejected=false
    begin
      core.layout(*args,rules)
    rescue ArgumentError
      rejected=true
    end
    raise 'invalid accepted' unless rejected
  end
  edge=core.layout(90,100,45,90,1,rules)
  raise 'minimum panel' unless edge[:parts].length==4
  File.write(output,JSON.pretty_generate({status:'passed',ruby:RUBY_VERSION,syntax:'all_rb',panels:results.length,invalid_cases:5,min_panel:true,geometry:'not_tested'}))
rescue Exception => e
  File.write(output,JSON.pretty_generate({status:'failed',error:e.message,backtrace:e.backtrace}))
end
