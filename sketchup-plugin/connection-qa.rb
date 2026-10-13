require_relative 'prefabrikten_karkas/frame_core'
require 'json'
core=Prefabrikten::Karkas::FrameCore
r=JSON.parse(File.read(File.join(__dir__,'profile-rules.json')))
opens=[{x:900,z:800,width:600,height:1000},{x:2100,z:0,width:900,height:2100}]
def contact?(point,p,f)
  a,b=p[:centreline_mm];dx=b[0]-a[0];dz=b[1]-a[1];len=p[:length_mm]
  u=((point[0]-a[0])*dx+(point[1]-a[1])*dz)/len
  v=((point[0]-a[0])*dz-(point[1]-a[1])*dx).abs/len
  u>=-0.01 && u<=len+0.01 && v<=f/2.0+0.01
end
%w[none left edges all].each do |brace|
  d=core.layout(3600,2800,600,80,1,r,{cladding:'gypsum',bracing:brace,openings:opens})
  structural=d[:parts].reject { |p| p[:role]=='capraz' }
  d[:parts].select { |p| %w[ara_kayit capraz].include?(p[:role]) }.each do |p|
    p[:centreline_mm].each do |point|
      raise 'Unsupported endpoint' unless structural.any? { |q| !q.equal?(p) && contact?(point,q,45) }
    end
  end
  raise unless d[:support_audit][:unsupported_endpoints].empty?
  raise unless d[:parts].all? { |p| p[:placement_reason] }
  d[:required_x_mm].each do |x|
    201.times do |i|
      z=1+2798*i/200.0
      next if opens.any? { |o| x>o[:x]+0.001 && x<o[:x]+o[:width]-0.001 && z>o[:z] && z<o[:z]+o[:height] }
      raise "Board support missing at #{x}/#{z}" unless structural.any? { |p| contact?([x,z],p,45) }
    end
  end
  # Former floating end at the terminated window jack axis must no longer exist.
  raise if d[:parts].select { |p| p[:role]=='ara_kayit' }.any? { |p| p[:centreline_mm].include?([900.0,2500.0]) }
  raise if structural.select { |p| %w[dikme yardimci_dikme].include?(p[:role]) }.any? { |p| contact?([900,2500],p,45) }
  braces=d[:parts].select { |p| p[:role]=='capraz' }
  if brace!='none'
    raise 'Top connection remains detached' unless braces.any? { |p| p[:centreline_mm].any? { |v| v[1]>2755 } }
  end
end
puts 'PASS: real-height supports, no ghost-jack splits, brace-to-rail contact, every blocking/brace endpoint and placement reasons.'
