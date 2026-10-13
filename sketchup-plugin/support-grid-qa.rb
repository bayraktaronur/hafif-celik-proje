require_relative 'prefabrikten_karkas/frame_core'
require 'json'
p=Prefabrikten::Karkas::PanelCore
f=Prefabrikten::Karkas::FrameCore
r=JSON.parse(File.read(File.join(__dir__,'profile-rules.json')))
raise unless p.supports(1500,1200)==[0.0,600.0,1200.0,1500.0]
raise unless p.supports(3000,2500)==[0.0,1250.0,2500.0,3000.0]
# A longer remainder still receives the continued half-sheet support.
raise unless p.supports(2200,1200)==[0.0,600.0,1200.0,1800.0,2200.0]
%w[osb gypsum boardex betopan].each do |c|
  %w[vertical horizontal].each do |direction|
    d=f.layout(1500,3000,600,80,1,r,{cladding:c,orientation:direction,bracing:'left'})
    raise 'Spacing lost' unless d[:actual_centre_spacing_mm]<=600.001
    raise 'Joint support lost' unless d[:support_audit][:missing_x_mm].empty?
    x,z=d[:board_mm]
    [1500,3000].zip([x,z]).each do |total,sheet|
      lines=p.supports(total,sheet)
      raise 'Unsupported gap' if lines.each_cons(2).any? { |a,b| b-a>sheet/2.0+0.001 }
      (1...(total/sheet.to_f).ceil).each { |i| raise 'Joint lost' unless lines.include?(i*sheet.to_f) }
    end
  end
end
d=f.layout(1500,3000,600,80,1,r,{cladding:'gypsum',bracing:'left',blocking_mode:'segmented'})
raise unless d[:stud_centres_mm]==[22.5,600.0,1200.0,1477.5]
raise unless d[:blocking_rows_mm]==[1250.0,2500.0]
raise unless d[:parts].length==15
d=f.layout(1500,3000,600,80,1,r,{cladding:'gypsum',bracing:'left',blocking_mode:'segmented',top_record_offset:140})
raise unless d[:blocking_rows_mm]==[1250.0,2500.0,2860.0]
raise unless d[:parts].length==18
puts 'PASS: cut remainder, longer remainder, all claddings/orientations, joints, maximum gaps and explicit top record.'
