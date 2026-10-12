module Prefabrikten
  module Karkas
    module OpeningCore
      TOL=0.05
      def self.inside?(p,poly)
        x,y=p;hit=false
        poly.each_with_index do |a,i|
          b=poly[(i+1)%poly.length]
          hit=!hit if (a[1]>y)!=(b[1]>y) && x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0]
        end
        hit
      end
      def self.coordinates(values)
        values.sort.each_with_object([]) { |v,out| out << v if out.empty? || v-out.last>TOL }
      end
      # Union of coplanar wall faces, including inner loops and floor-open doors.
      def self.detect(faces)
        raise 'Duvar yüzü bulunamadı.' if faces.empty?
        loops=faces.flatten(1)
        loops.each do |poly|
          raise 'Geçersiz duvar sınırı.' unless poly.length>=4 && poly.all? { |p| p.length==2 && p.all? { |v| v.is_a?(Numeric) && v.finite? } }
          poly.each_with_index do |a,i|
            b=poly[(i+1)%poly.length]
            raise 'Eğik/kemerli açıklık desteklenmiyor; dikdörtgen açıklık kullanın.' if (a[0]-b[0]).abs>TOL && (a[1]-b[1]).abs>TOL
          end
        end
        xs=coordinates(loops.flatten(1).map(&:first));zs=coordinates(loops.flatten(1).map(&:last))
        nx=xs.length-1;nz=zs.length-1
        raise 'Duvar açıklık geometrisi çok karmaşık.' if nx*nz>10000 || nx<1 || nz<1 || nx*nz*loops.sum(&:length)>5000000
        empty={}
        nx.times do |i|
          nz.times do |j|
            p=[(xs[i]+xs[i+1])/2.0,(zs[j]+zs[j+1])/2.0]
            covered=faces.any? { |ls| inside?(p,ls.first) && ls.drop(1).none? { |hole| inside?(p,hole) } }
            empty[[i,j]]=true unless covered
          end
        end
        openings=[]
        until empty.empty?
          seed=empty.keys.first;empty.delete(seed);cells=[seed];queue=[seed]
          until queue.empty?
            i,j=queue.pop
            [[i-1,j],[i+1,j],[i,j-1],[i,j+1]].each do |q|
              next unless empty.delete(q)
              queue << q;cells << q
            end
          end
          a,b=cells.map(&:first).minmax;c,d=cells.map(&:last).minmax
          raise 'Duvar dış sınırı dikdörtgen olmalı; yan/üst kenara açık girinti ayrı panel gerektirir.' if a==0 || b==nx-1 || d==nz-1
          raise 'Birleşik veya dikdörtgen olmayan açıklık algılandı; ayrı açıklıklar kullanın.' unless cells.length==(b-a+1)*(d-c+1)
          openings << {x:xs[a]-xs.first,z:zs[c]-zs.first,width:xs[b+1]-xs[a],height:zs[d+1]-zs[c]}
        end
        {lo:[xs.first,zs.first],hi:[xs.last,zs.last],openings:openings.sort_by { |o| [o[:x],o[:z]] }}
      end
    end
  end
end
