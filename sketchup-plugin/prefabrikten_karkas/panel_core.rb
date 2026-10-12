require 'json'
module Prefabrikten
  module Karkas
    module PanelCore
      CLADDING = JSON.parse(File.read(File.join(__dir__, 'cladding-rules.json')))
      def self.supports(total, sheet)
        edges=[0.0]; pos=sheet.to_f
        while pos < total-0.001
          edges << pos
          pos += sheet
          raise ArgumentError, 'Levha sayısı çok fazla.' if edges.length>200
        end
        edges << total.to_f
        (edges+edges.each_cons(2).map { |a,b| (a+b)/2.0 }).sort.uniq
      end
      def self.layout(width, height, spacing, web, thickness, rules, options={})
        raise ArgumentError, 'Ölçüler pozitif ve sonlu olmalı.' unless [width,height,spacing,web,thickness].all? { |v| v.is_a?(Numeric) && v.finite? && v>0 }
        s=rules.fetch('section'); f=s.fetch('flange')
        raise ArgumentError, 'Desteklenmeyen kesit veya sac.' unless s['webWidths'].include?(web) && s['thicknessOptions'].include?(thickness)
        raise ArgumentError, 'Panel eni en az 2 kanat, yüksekliği 2 kanattan büyük olmalı.' unless width>=2*f && height>2*f
        raise ArgumentError, 'Azami dikme aralığı en az 2 kanat olmalı.' if spacing<2*f
        coating=options.fetch(:cladding,'gypsum'); orientation=options.fetch(:orientation,'vertical')
        raise ArgumentError, 'Döşeme yönü geçersiz.' unless ['vertical','horizontal'].include?(orientation)
        board = if coating=='custom'
          { 'width'=>options.fetch(:board_width,1200), 'length'=>options.fetch(:board_length,2500) }
        else
          CLADDING.fetch('boards').fetch(coating) { raise ArgumentError,'Kaplama seçimi geçersiz.' }
        end
        raise ArgumentError, 'Levha ölçüleri en az 90 mm olmalı.' unless board.values.all? { |v| v.is_a?(Numeric) && v.finite? && v>=90 }
        bx,bz=board.values_at('width','length'); bx,bz=bz,bx if orientation=='horizontal'
        required_x=supports(width,bx); required_z=supports(height,bz)
        centres=required_x.map { |x| [[x,f/2.0].max,width-f/2.0].min }.uniq.sort
        # Close board joints retain their support; overlapping draft studs are flagged below.
        extra=[]
        centres.each_cons(2) do |a,b|
          divisions=((b-a)/spacing).ceil
          (1...divisions).each { |i| extra << a+(b-a)*i/divisions }
        end
        centres=(centres+extra).sort
        close_supports=centres.each_cons(2).any? { |a,b| b-a<f-0.001 }
        raise ArgumentError, 'Prototip en fazla 200 dikme destekler.' if centres.length>200
        rows=required_z.select { |z| z>f && z<height-f }
        parts=[{id:'P01-A01',role:'alt_kayit',length_mm:width,origin_mm:[width,0,0],axes:[[0,0,1],[0,1,0],[-1,0,0]]},
               {id:'P01-U01',role:'ust_kayit',length_mm:width,origin_mm:[0,0,height],axes:[[0,0,-1],[0,1,0],[1,0,0]]}]
        centres.each_with_index do |x,i|
          last=i==centres.length-1
          parts << {id:format('P01-D%03d',i+1),role:'dikme',length_mm:height-2*thickness,
            origin_mm:[last ? width : x-f/2.0,last ? web : 0,thickness],
            axes:last ? [[-1,0,0],[0,-1,0],[0,0,1]] : [[1,0,0],[0,1,0],[0,0,1]]}
        end
        rows.each do |z|
          centres.each_cons(2) do |a,b|
            gap=b-a-f
            next if gap<=0.01
            parts << {id:format('P01-Y%03d',parts.count { |p| p[:role]=='ara_kayit' }+1),role:'ara_kayit',length_mm:gap,
              origin_mm:[b-f/2.0,0,z-f/2.0],axes:[[0,0,1],[0,1,0],[-1,0,0]]}
          end
        end
        bracing=options.fetch(:bracing,'edges')
        raise ArgumentError, 'Çapraz seçimi geçersiz.' unless ['none','edges','all'].include?(bracing)
        levels=[f]+rows.map { |z| z+f/2.0 }+[height-f]
        # Each brace is segmented at blocking rows. End/tool details remain unresolved.
        centres.each_cons(2).with_index do |(a,b),i|
          next if bracing=='none' || (bracing=='edges' && i!=0 && i!=centres.length-2)
          left=a+f; right=b-f
          next if right-left<=f
          levels.each_cons(2).with_index do |(low,high),j|
            high-=f if j<rows.length
            low+=f/2.0; high-=f/2.0
            next if high-low<=f
            p1,p2 = i.even? ? [[left,low],[right,high]] : [[left,high],[right,low]]
            dx=p2[0]-p1[0]; dz=p2[1]-p1[1]; len=Math.sqrt(dx*dx+dz*dz)
            ux=dx/len; uz=dz/len
            parts << {id:format('P01-C%03d',parts.count { |p| p[:role]=='capraz' }+1),role:'capraz',length_mm:len,
              origin_mm:[p1[0]-uz*f/2.0,0,p1[1]+ux*f/2.0],axes:[[uz,0,-ux],[0,1,0],[ux,0,uz]],
              connection_status:'end_connection_geometry_unresolved'}
          end
        end
        raise ArgumentError, 'Prototip en fazla 2000 parça destekler.' if parts.length>2000
        parts.each do |p|
          p[:section]={web_mm:web,flange_mm:f,lip_mm:s['lip'],thickness_mm:thickness,dimension_basis:'outside',lip_angle_status:'deferred',bend_radius_status:'unknown'}
          p[:operations]=[]
          unless ['alt_kayit','ust_kayit'].include?(p[:role])
            [0,p[:length_mm]].each do |pos|
              p[:operations] << {type:'swage',position_mm:pos,target_outside_width_mm:web-2*thickness-rules['nesting']['totalClearance'],tool_depth_mm:nil,status:'unverified_not_applied'}
              p[:operations] << {type:'lip_cut',position_mm:pos,start_from_end_mm:web==90 ? 50 : nil,angle_degrees:web==90 ? 45 : nil,status:'geometry_unresolved_not_applied'}
            end
          end
          p[:status]='draft_not_for_manufacture'
        end
        warnings=['Kesme/ezme ve çapraz uç bağlantıları henüz uygulanmadı.','Levhalar başlangıçtan şaşırtmasız ve derz boşluksuz yerleştirildi.','Boylar taslaktır; imalat için doğrulanmalıdır.']
        warnings << 'Yakın levha hatlarında dikmeler kesişiyor; birleşim detayı gerekli.' if close_supports
        {schema:2,panel_id:'P01',width_mm:width,height_mm:height,web_mm:web,thickness_mm:thickness,cladding:coating,orientation:orientation,
          board_mm:[bx,bz],required_x_mm:required_x,required_z_mm:required_z,stud_centres_mm:centres,blocking_rows_mm:rows,bracing:bracing,
          requested_max_spacing_mm:spacing,actual_centre_spacing_mm:centres.each_cons(2).map { |a,b| b-a }.max,parts:parts,
          status:'draft_not_for_manufacture',warnings:warnings}
      end
    end
  end
end
