require 'json'
require_relative 'prefabrikten_karkas/frame_core'
core=Prefabrikten::Karkas::FrameCore
rules=JSON.parse(File.read(File.join(__dir__,'profile-rules.json')))
def check(value,label)
  raise label unless value
end
def rejects(label)
  begin
    yield
  rescue ArgumentError,KeyError
    return
  end
  raise "Expected rejection: #{label}"
end
cases=0
%w[osb gypsum boardex custom betopan].each do |coating|
  %w[vertical horizontal].each do |direction|
    %w[none left edges all].each do |brace|
      [1500,1800,3000].each do |width|
        options={cladding:coating,orientation:direction,bracing:brace,board_width:1200,board_length:2400,top_record_offset:140}
        d=core.layout(width,2500,600,90,1.2,rules,options)
        check(d[:actual_centre_spacing_mm]<=600.001,'spacing')
        check(d[:support_audit][:missing_x_mm].empty?,'support')
        check(d[:blocking_rows_mm].include?(2360),'top record')
        check(d[:parts].map { |p| p[:id] }.uniq.length==d[:parts].length,'ids')
        d[:parts].each do |p|
          check(p[:length_mm]>0,'length')
          a,b,c=p[:axes]
          check((a.sum { |v| v*v }-1).abs<1e-8,'unit axis')
          check((a[0]*(b[1]*c[2]-b[2]*c[1])-a[1]*(b[0]*c[2]-b[2]*c[0])+a[2]*(b[0]*c[1]-b[1]*c[0])-1).abs<1e-8,'handedness')
        end
        check(d[:parts].none? { |p| p[:role]=='capraz' },'no brace') if brace=='none'
        cases+=1
      end
    end
  end
end
d=core.layout(1800,2500,600,90,1.2,rules,{bracing:'left'})
braces=d[:parts].select { |p| p[:role]=='capraz' }
check(braces.length==2,'two braces')
check(braces[0][:axes][2][2]*braces[1][:axes][2][2]<0,'alternating diagonal')
openings=[{x:600,z:0,width:900,height:2100},{x:2100,z:800,width:600,height:1000}]
d=core.layout(3600,2800,600,90,1.2,rules,{openings:openings,bracing:'all',structural_max_spacing:400,structural_reference:'test-reference'})
check(d[:actual_centre_spacing_mm]<=400.001,'structural cap')
check(d[:structural][:status]=='input_limit_applied_not_calculated','no false structural claim')
check(d[:parts].count { |p| p[:role]=='aciklik_basligi' }==2,'headers')
check(d[:parts].count { |p| p[:role]=='denizlik' }==1,'sill')
check(d[:parts].count { |p| p[:role]=='yardimci_dikme' }==4,'jack studs')
d[:parts].select { |p| %w[dikme yardimci_dikme alt_kayit ara_kayit].include?(p[:role]) }.each do |p|
  a,b=p[:centreline_mm]
  openings.each do |o|
    if (a[0]-b[0]).abs<0.001
      check(!(a[0]>o[:x] && a[0]<o[:x]+o[:width] && [a[1],b[1]].min<o[:z]+o[:height] && [a[1],b[1]].max>o[:z]),'stud crosses opening')
    else
      check(!(a[1]>o[:z] && a[1]<o[:z]+o[:height] && [a[0],b[0]].min<o[:x]+o[:width] && [a[0],b[0]].max>o[:x]),'horizontal crosses opening')
    end
  end
end
b=core.layout(1500,2500,600,90,1.2,rules,{cladding:'betopan'})
check(b[:board_mm]==[1250,2500] && b[:cladding_thickness_mm]==10,'confirmed betopan')
rejects('unreferenced limit') { core.layout(1500,2500,600,90,1.2,rules,{structural_max_spacing:400}) }
rejects('opening outside') { core.layout(1500,2500,600,90,1.2,rules,{openings:[{x:0,z:0,width:900,height:2100}]}) }
rejects('overlapping openings') { core.layout(3600,2800,600,90,1.2,rules,{openings:[openings[0],openings[0]]}) }
rejects('roof opening') { core.layout(3600,2800,600,90,1.2,rules,{kind:'roof',openings:openings}) }
%w[roof floor].each { |kind| check(core.layout(1500,2500,600,90,1.2,rules,{kind:kind})[:kind]==kind,'panel kind') }
Dir[File.join(__dir__,'prefabrikten_karkas','*.rb')].each { |p| RubyVM::InstructionSequence.compile_file(p) }
puts JSON.generate({status:'passed',layout_cases:cases,openings_and_regressions:true,ruby:RUBY_VERSION,sketchup_geometry:'not_executed'})
