require_relative 'prefabrikten_karkas/opening_core'
require_relative 'prefabrikten_karkas/frame_core'
require 'json'
def rect(x,z,w,h);[[x,z],[x+w,z],[x+w,z+h],[x,z+h]];end
c=Prefabrikten::Karkas::OpeningCore
outer=rect(0,0,3600,2800);window=rect(2100,800,600,1000)
door=[[0,0],[600,0],[600,2100],[1500,2100],[1500,0],[3600,0],[3600,2800],[0,2800]]
expected=[{x:600,z:0,width:900,height:2100},{x:2100,z:800,width:600,height:1000}]
raise unless c.detect([[outer]])[:openings].empty?
raise unless c.detect([[door,window]])[:openings]==expected
raise unless c.detect([[door.reverse,window.reverse]])[:openings]==expected
fragmented=[[rect(0,0,600,2800)],[rect(600,2100,900,700)],[rect(1500,0,2100,2800),window]]
raise unless c.detect(fragmented)[:openings]==expected
shifted=fragmented.map { |ls| ls.map { |p| p.map { |x,z| [x-500,z+100] } } }
raise unless c.detect(shifted)[:openings]==expected
bad=[]
bad << [[[[0,0],[100,0],[100,100],[0,80]]]]
bad << [[rect(0,0,600,2800)],[rect(600,0,3000,2100)]]
bad.each do |faces|
  begin
    c.detect(faces)
  rescue RuntimeError
    next
  end
  raise 'Ambiguous boundary accepted'
end
rules=JSON.parse(File.read(File.join(__dir__,'profile-rules.json')))
d=Prefabrikten::Karkas::FrameCore.layout(3600,2800,600,90,1.2,rules,{openings:c.detect([[door,window]])[:openings],bracing:'all'})
d[:parts].each do |p|
  a,b=p[:centreline_mm]
  expected.each do |o|
    21.times do |i|
      t=i/20.0;x=a[0]+(b[0]-a[0])*t;z=a[1]+(b[1]-a[1])*t
      raise 'Member crosses opening' if x>o[:x]+0.01 && x<o[:x]+o[:width]-0.01 && z>o[:z]+0.01 && z<o[:z]+o[:height]-0.01
    end
  end
end
RubyVM::InstructionSequence.compile_file(File.join(__dir__,'prefabrikten_karkas/conversion.rb'))
puts 'PASS: window holes, floor-open doors, fragmented/reversed/translated faces, invalid boundary rejection and framing exclusion.'
