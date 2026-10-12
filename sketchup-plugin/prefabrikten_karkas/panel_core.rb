require 'json'
module Prefabrikten
  module Karkas
    module PanelCore
      def self.layout(width, height, spacing, web, thickness, rules)
        values = [width,height,spacing,web,thickness]
        raise ArgumentError, 'Ölçüler pozitif ve sonlu olmalı.' unless values.all? { |v| v.is_a?(Numeric) && v.finite? && v > 0 }
        section = rules.fetch('section'); f = section.fetch('flange')
        raise ArgumentError, 'Desteklenmeyen kesit veya sac.' unless section['webWidths'].include?(web) && section['thicknessOptions'].include?(thickness)
        raise ArgumentError, 'Panel genişliği en az 2 kanat, yüksekliği 2 kanattan büyük olmalı.' unless width >= 2*f && height > 2*f
        raise ArgumentError, 'Dikme aralığı kanat genişliğinden küçük olamaz.' if spacing < f
        span = width - f
        bays = (span / spacing).ceil
        raise ArgumentError, 'Prototip en fazla 200 aralık destekler.' if bays > 200
        # Equal centre spacing, no greater than requested maximum; endpoint envelopes are fixed.
        pitch = span / bays
        parts = [
          {id:'P01-A01',role:'alt_kayit',length_mm:width,origin_mm:[width,0,0],axes:[[0,0,1],[0,1,0],[-1,0,0]]},
          {id:'P01-U01',role:'ust_kayit',length_mm:width,origin_mm:[0,0,height],axes:[[0,0,-1],[0,1,0],[1,0,0]]}
        ]
        (0..bays).each do |i|
          last = i == bays
          parts << {id:format('P01-D%03d',i+1),role:'dikme',length_mm:height-2*thickness,
            origin_mm:[last ? width : i*pitch,last ? web : 0,thickness],
            axes:last ? [[-1,0,0],[0,-1,0],[0,0,1]] : [[1,0,0],[0,1,0],[0,0,1]]}
        end
        parts.each do |part|
          part[:section] = {web_mm:web,flange_mm:f,lip_mm:section['lip'],thickness_mm:thickness,dimension_basis:'outside',lip_angle_status:'deferred',bend_radius_status:'unknown'}
          part[:operations] = []
          if part[:role] == 'dikme'
            [0,part[:length_mm]].each do |pos|
              part[:operations] << {type:'swage',position_mm:pos,reference:'part_start',target_outside_width_mm:web-2*thickness-rules['nesting']['totalClearance'],tool_depth_mm:nil,status:'unverified_not_applied'}
              part[:operations] << {type:'lip_cut',position_mm:pos,reference:'part_start',start_from_end_mm:web==90 ? 50 : nil,angle_degrees:web==90 ? 45 : nil,status:'geometry_unresolved_not_applied'}
            end
          end
          part[:status] = 'draft_not_for_manufacture'
        end
        {schema:1,panel_id:'P01',width_mm:width,height_mm:height,web_mm:web,thickness_mm:thickness,
         requested_max_spacing_mm:spacing,actual_centre_spacing_mm:pitch,parts:parts,
         status:'draft_not_for_manufacture',warnings:['Birleşimlerde kesme/ezme uygulanmadı; kesişen yüzeyler olabilir.','Boylar yerleşim taslağıdır; imalat boyu değildir.','Dudak açısı ve büküm yarıçapları doğrulanmadı.']}
      end
    end
  end
end
