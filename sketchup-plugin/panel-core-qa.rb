require 'json'
require 'tmpdir'
base=__dir__+'/'
begin
  Dir[base+'prefabrikten_karkas/*.rb'].each { |p| RubyVM::InstructionSequence.compile_file(p) }
  require_relative 'prefabrikten_karkas/panel_core'
  rules=JSON.parse(File.read(base+'profile-rules.json'))
  cases=0
  ['osb','gypsum','boardex','custom'].each do |coating|
    ['vertical','horizontal'].each do |direction|
      ['none','edges','all'].each do |brace|
        [2140,2500,3000].each do |width|
          panel=Prefabrikten::Karkas::PanelCore.layout(width,2800,600,90,1.2,rules,{cladding:coating,orientation:direction,bracing:brace})
          raise 'spacing' if panel[:actual_centre_spacing_mm]>600.001
          panel[:required_x_mm].each { |x| raise 'unsupported edge/middle' unless panel[:stud_centres_mm].any? { |c| (x-c).abs<=22.5001 } }
          panel[:required_z_mm].each { |z| raise 'unsupported row' unless z<=45 || z>=2755 || panel[:blocking_rows_mm].include?(z) }
          raise 'blocking' unless panel[:parts].any? { |p| p[:role]=='ara_kayit' }
          raise 'bracing' if brace!='none' && !panel[:parts].any? { |p| p[:role]=='capraz' }
          raise 'unexpected bracing' if brace=='none' && panel[:parts].any? { |p| p[:role]=='capraz' }
          raise 'ids' unless panel[:parts].map { |p| p[:id] }.uniq.length==panel[:parts].length
          panel[:parts].each do |p|
            raise 'length' unless p[:length_mm]>0
            p[:axes].each { |a| raise 'axis' unless (a.sum { |v| v*v }-1).abs<1e-8 }
          end
          cases+=1
        end
      end
    end
  end
  File.write(File.join(Dir.tmpdir,'prefabrikten-panel-core-qa.json'),JSON.pretty_generate({status:'passed',cases:cases,geometry:'not_tested'}))
rescue Exception => e
  File.write(File.join(Dir.tmpdir,'prefabrikten-panel-core-qa.json'),JSON.pretty_generate({status:'failed',error:e.message,backtrace:e.backtrace}))
end
