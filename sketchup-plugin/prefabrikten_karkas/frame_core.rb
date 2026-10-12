require_relative 'panel_core'
module Prefabrikten
  module Karkas
    module FrameCore
      def self.numeric(value, label, zero=false)
        v=Float(value.to_s.tr(',', '.'))
        raise ArgumentError, "#{label}: geçersiz ölçü." unless v.finite? && (zero ? v>=0 : v>0)
        v
      end
      def self.subtract(a,b,cuts)
        cuts.sort_by(&:first).reduce([[a,b]]) do |ranges,(lo,hi)|
          ranges.flat_map { |x,y| hi<=x || lo>=y ? [[x,y]] : [[x,[lo,y].min],[[hi,x].max,y]].select { |u,v| v-u>0.01 } }
        end
      end
      def self.layout(width,height,spacing,web,thickness,rules,options={})
        kind=options.fetch(:kind,'wall')
        raise ArgumentError,'Panel türü geçersiz.' unless %w[wall roof floor].include?(kind)
        limit=options[:structural_max_spacing]
        if limit
          limit=numeric(limit,'Statik azami aks')
          raise ArgumentError,'Statik sınır için proje/hesap referansı girin.' if options.fetch(:structural_reference,'').strip.empty?
          spacing=[spacing,limit].min
        end
        openings=options.fetch(:openings,[]).map do |o|
          h=o.transform_keys(&:to_sym)
          {x:numeric(h.fetch(:x),'Açıklık x',true),z:numeric(h.fetch(:z),'Açıklık kotu',true),
            width:numeric(h.fetch(:width),'Açıklık eni'),height:numeric(h.fetch(:height),'Açıklık yüksekliği')}
        end
        raise ArgumentError,'Çatı/döşeme açıklıkları ayrı mühendislik detayı gerektiriyor.' if kind!='wall' && !openings.empty?
        f=rules['section']['flange'].to_f
        openings.each do |o|
          raise ArgumentError,'Açıklık çevresinde dikme/başlık için yeterli alan yok.' unless o[:x]>=2*f && o[:x]+o[:width]<=width-2*f && o[:z]+o[:height]<=height-2*f
        end
        openings.combination(2).each do |a,b|
          if a[:x]<b[:x]+b[:width]+2*f && a[:x]+a[:width]+2*f>b[:x] && a[:z]<b[:z]+b[:height]+2*f && a[:z]+a[:height]+2*f>b[:z]
            raise ArgumentError,'Yakın/çakışan açıklıklar birleşik detay gerektiriyor.'
          end
        end
        engine=options.dup
        data=PanelCore.layout(width,height,spacing,web,thickness,rules,engine.merge(bracing:'none'))
        centres=data[:stud_centres_mm]
        jambs=openings.flat_map { |o| [o[:x]-1.5*f,o[:x]-f/2,o[:x]+o[:width]+f/2,o[:x]+o[:width]+1.5*f] }.uniq
        # Existing support lines can move only if their whole target remains on a flange.
        centres=centres.reject { |x| jambs.any? { |j| (x-j).abs<f-0.001 } }+jambs
        centres=centres.sort.uniq
        extra=[]
        centres.each_cons(2) do |a,b|
          count=((b-a)/spacing).ceil
          (1...count).each { |i| extra << a+(b-a)*i/count }
        end
        centres=(centres+extra).sort.uniq
        rows=data[:blocking_rows_mm]
        top=options.fetch(:top_record_offset,0).to_f
        raise ArgumentError,'Üst kayıt mesafesi sonlu ve sıfır veya pozitif olmalı.' unless top.finite? && top>=0
        if top>0
          raise ArgumentError,'Üst ilave kayıt panel dışında.' unless top>f && top<height-f
          rows=(rows+[height-top]).sort.uniq
        end
        parts=[]
        add=lambda do |role,a,b|
          dx=b[0]-a[0];dz=b[1]-a[1];len=Math.sqrt(dx*dx+dz*dz)
          next if len<=0.01
          ux=dx/len;uz=dz/len
          parts << {role:role,length_mm:len,origin_mm:[a[0]-uz*f/2,0,a[1]+ux*f/2],
            axes:[[uz,0,-ux],[0,1,0],[ux,0,uz]],centreline_mm:[a,b]}
        end
        doors=openings.select { |o| o[:z]<0.01 }.map { |o| [o[:x],o[:x]+o[:width]] }
        subtract(0,width,doors).each { |a,b| add.call('alt_kayit',[b,f/2],[a,f/2]) }
        add.call('ust_kayit',[0,height-f/2],[width,height-f/2])
        centres.each do |x|
          cuts=openings.select { |o| x+f/2>o[:x]+0.001 && x-f/2<o[:x]+o[:width]-0.001 }.map { |o| [[o[:z]-f,0].max,o[:z]+o[:height]+f] }
          # Jack studs stop beneath the header. King studs continue to the top rail.
          jack=openings.find { |o| (x-(o[:x]-f/2)).abs<0.01 || (x-(o[:x]+o[:width]+f/2)).abs<0.01 }
          finish=jack ? jack[:z]+jack[:height] : height-thickness
          subtract(thickness,finish,cuts).each { |lo,hi| add.call(jack ? 'yardimci_dikme' : 'dikme',[x,lo],[x,hi]) }
        end
        rows.each do |z|
          centres.each_cons(2) do |a,b|
            cuts=openings.select { |o| z+f/2>o[:z] && z-f/2<o[:z]+o[:height] }.map { |o| [o[:x],o[:x]+o[:width]] }
            subtract(a+f/2,b-f/2,cuts).each { |lo,hi| add.call('ara_kayit',[hi,z],[lo,z]) } if b-a>f
          end
        end
        openings.each do |o|
          add.call('aciklik_basligi',[o[:x]+o[:width]+f,o[:z]+o[:height]+f/2],[o[:x]-f,o[:z]+o[:height]+f/2])
          add.call('denizlik',[o[:x]+o[:width],o[:z]-f/2],[o[:x],o[:z]-f/2]) if o[:z]>f
        end
        brace=options.fetch(:bracing,'edges')
        raise ArgumentError,'Çapraz düzeni geçersiz.' unless %w[none left edges all].include?(brace)
        levels=([f]+rows+[height-f]).sort.uniq
        centres.each_cons(2).with_index do |(a,b),i|
          next if brace=='none' || (brace=='left' && i!=0) || (brace=='edges' && i!=0 && i!=centres.length-2) || b-a<3*f
          levels.each_cons(2).with_index do |(lo,hi),j|
            next if hi-lo<3*f
            next if openings.any? { |o| a<b && a<o[:x]+o[:width]+f && b>o[:x]-f && lo<o[:z]+o[:height]+f && hi>o[:z]-f }
            l=a+f/2;r=b-f/2;low=lo+f/2;high=hi-f/2
            a1,b1=(i+j).even? ? [[l,low],[r,high]] : [[l,high],[r,low]]
            add.call('capraz',a1,b1)
          end
        end
        raise ArgumentError,'En fazla2000parça oluşturulabilir.' if parts.length>2000
        parts.each_with_index do |p,i|
          p.merge!(id:format('P01-%04d',i+1),status:'draft_not_for_manufacture',operations:[],
            section:{web_mm:web,flange_mm:f,lip_mm:rules['section']['lip'],thickness_mm:thickness,dimension_basis:'outside'})
        end
        missing_x=data[:required_x_mm].reject { |x| centres.any? { |c| (c-x).abs<=f/2+0.001 } }
        warnings=['Statik çözüm yapılmadı; profil ve taşıyıcı yeterlilik doğrulanmadı.','Kesme/ezme ertelendi. Boylar yerleşim taslağıdır.','Derz/vida aralıkları ürün belgesinden ayrıca doğrulanmalı.']
        warnings << 'Açıklık başlığı tek C taslağıdır; mühendislik boyutlandırması gerekli.' unless openings.empty?
        warnings << 'Çatı/döşeme: panel düzleminde kiriş ızgarası; otomatik makas çözümü değildir.' if kind!='wall'
        warnings << "Desteksiz levha hatları: #{missing_x.join(', ')} mm" unless missing_x.empty?
        warnings << 'Yakın dikmelerde çakışma var.' if centres.each_cons(2).any? { |a,b| b-a<f-0.001 }
        data.merge(schema:3,kind:kind,cladding:options.fetch(:cladding,'gypsum'),parts:parts,openings:openings,
          stud_centres_mm:centres,blocking_rows_mm:rows,bracing:brace,warnings:warnings,
          actual_centre_spacing_mm:centres.each_cons(2).map { |a,b| b-a }.max,
          structural:{status:limit ? 'input_limit_applied_not_calculated' : 'not_calculated',max_spacing_mm:limit,reference:options[:structural_reference]},
          support_audit:{missing_x_mm:missing_x},top_record_offset_mm:top,
          cladding_thickness_mm:options[:cladding]=='betopan' ? 10 : nil)
      end
    end
  end
end
