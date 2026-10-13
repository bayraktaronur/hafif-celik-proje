require_relative 'prefabrikten_karkas/frame_core'
require 'json'
c=Prefabrikten::Karkas::FrameCore
r=JSON.parse(File.read(File.join(__dir__,'profile-rules.json')))
opens=[{x:600,z:0,width:900,height:2100},{x:2100,z:800,width:600,height:1000}]
cases=0
%w[osb gypsum boardex betopan].each do |board|
  %w[vertical horizontal].each do |direction|
    %w[continuous segmented].each do |mode|
      %w[single lattice].each do |header|
        d=c.layout(3600,2800,600,80,1,r,{cladding:board,orientation:direction,blocking_mode:mode,header_type:header,header_depth:500,header_web_spacing:400,openings:opens,bracing:'edges'})
        raise 'Unsupported end' unless d[:support_audit][:unsupported_endpoints].empty?
        q=d[:fabrication_summary]
        raise 'Wrong metre total' unless (q[:total_length_m]-d[:parts].sum { |p| p[:length_mm] }/1000.0).abs<1e-9
        raise 'Wrong piece/end count' unless q[:piece_count]==d[:parts].length && q[:nominal_end_faces]==2*d[:parts].length
        webs=d[:parts].select { |p| p[:role]=='baslik_caprazi' }
        raise 'Wrong header type' unless (header=='lattice')==!webs.empty?
        d[:parts].each do |p|
          a,b=p[:centreline_mm]
          41.times do |i|
            t=i/40.0;x=a[0]+t*(b[0]-a[0]);z=a[1]+t*(b[1]-a[1])
            raise 'Opening intrusion' if opens.any? { |o| x>o[:x]+0.01 && x<o[:x]+o[:width]-0.01 && z>o[:z]+0.01 && z<o[:z]+o[:height]-0.01 }
          end
        end
        cases+=1
      end
    end
  end
end
a=c.layout(3600,2800,600,80,1,r,{bracing:'edges',openings:opens,blocking_mode:'segmented'})
b=c.layout(3600,2800,600,80,1,r,{bracing:'edges',openings:opens,blocking_mode:'continuous'})
raise 'No piece reduction' unless b[:parts].length<a[:parts].length
raise 'Continuity not applied' unless b[:parts].any? { |p| p[:role]=='ara_kayit' && p[:length_mm]>1200 && p[:pass_through_studs_mm].length>1 }
raise 'Pass operations lost' unless b[:fabrication_summary][:stud_pass_locations]>0
d=c.layout(3600,2800,600,80,1,r,{header_type:'lattice',header_depth:500,openings:[{x:600,z:0,width:900,height:2300}]})
raise 'Duplicate top chord' if d[:parts].any? { |p| p[:role]=='baslik_ust_kusak' }
begin
  c.layout(3600,2800,600,80,1,r,{header_type:'lattice',header_depth:800,openings:opens})
  raise 'Oversize header accepted'
rescue ArgumentError
end
begin
  c.layout(3600,4000,600,80,1,r,{header_type:'lattice',header_depth:500,openings:[{x:600,z:0,width:900,height:1500},{x:600,z:1750,width:900,height:1000}]})
  raise 'Header crossing stacked opening accepted'
rescue ArgumentError
end
puts JSON.generate({passed:true,cases:cases,segmented:{parts:a[:parts].length,m:a[:fabrication_summary][:total_length_m]},continuous:{parts:b[:parts].length,m:b[:fabrication_summary][:total_length_m]},geometry:'not_executed'})
