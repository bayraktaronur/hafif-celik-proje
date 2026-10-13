require 'sketchup.rb'
require 'extensions.rb'
unless file_loaded?(__FILE__)
  ext = SketchupExtension.new('Prefabrikten Karkas', 'prefabrikten_karkas/main')
  ext.description = 'C profil prototipi ve salt okunur model inceleme'
  ext.version = '0.5.0'
  ext.creator = 'Prefabrikten'
  Sketchup.register_extension(ext, true)
  file_loaded(__FILE__)
end
