require_relative 'prefabrikten_mcp_roof'
p={'request_id'=>'12345678-1234-1234-1234-123456789abc','patches'=>[{'plane'=>[0,0,1,3000],'cross_axis'=>0,'polygons'=>[[[0,0],[1500,0],[1500,3000],[0,3000]]]}]}
raise unless PrefabriktenMCPRoof.validate(p)==p
[-400,-200,0,200,1000].each { |x| raise unless PrefabriktenMCPRoof.height(x)==27 }
raise unless PrefabriktenMCPRoof.height(100)==0
q=PrefabriktenMCPRoof.clip(p['patches'][0]['polygons'][0],0,1000,-1)
raise unless q.map(&:first).max==1000
[p.merge('code'=>'eval'),p.merge('patches'=>[]),p.merge('patches'=>[p['patches'][0].merge('plane'=>[0,0,-1,0])]),p.merge('patches'=>[p['patches'][0].merge('cross_axis'=>3)]),p.merge('patches'=>[p['patches'][0].merge('polygons'=>[[[0,0],[1500,0],[400,100],[1500,3000],[0,3000]]])])].each do |bad|
  begin
    PrefabriktenMCPRoof.validate(bad)
  rescue StandardError
    next
  end
  raise 'Invalid roof accepted'
end
RubyVM::InstructionSequence.compile_file(File.join(__dir__,'prefabrikten_inspect.rb'))
puts 'PASS: roof guards, convex clipping, 27 mm height and 200 mm period. Live geometry pending.'
