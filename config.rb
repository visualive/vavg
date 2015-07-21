Encoding.default_external = "utf-8"
# Require any additional compass plugins here.
# add_import_path "bower_components/foundation/scss/"

# Set this to the root of your project when deployed:
# http_path = "../"
# css_dir = "assets/css"
# sass_dir = "scss"
# images_dir = "assets/img"
# generated_images_dir = "assets/img/sprite"
# http_images_path = "assets/img"
# http_generated_images_dir = "assets/img/sprite"
# javascripts_dir = "assets/js"

# You can select your preferred output style here (can be overridden via the command line):
# output_style = :expanded or :nested or :compact or :compressed
output_style = :expanded

# To enable relative paths to assets via compass helper functions. Uncomment:
# relative_assets = true

# To disable debugging comments that display the original location of your selectors. Uncomment:
line_comments = false

cache = true
asset_cache_buster :none
sass_options = { :debug_info => false }

# If you prefer the indented syntax, you might want to regenerate this
# project again passing --syntax sass, or you can uncomment this:
# preferred_syntax = :sass
# and then run:
# sass-convert -R --from scss --to sass sass scss && rm -rf sass && mv scss sass


# キャッシュバスターをタイムスタンプからMD5ハッシュ(10文字)に変更する
asset_cache_buster do |path, file|
  if File.file?(file.path)
    Digest::MD5.hexdigest(File.read(file.path))[0, 10]
  else
    $stderr.puts "WARNING: '#{File.basename(path)}' was not found (or cannot be read) in #{File.dirname(file.path)}"
  end
end

# スプライト画像生成時に生成されたファイル名に自動的に付けられるハッシュ文字列を削除する
on_sprite_saved do |filename|
  if File.file?(filename)
    FileUtils.mv filename, filename.gsub(%r{-s[0-9a-f]{10}(\.\w+)}, '\1')
  end
end

# スプライト画像生成時に生成されたファイル名に自動的に付けられるハッシュ文字列を削除し、
# キャッシュバスターとして利用する
# device-pixel-ratioの分数内に挿入される半角スペースを削除
on_stylesheet_saved do |filename|
  if File.file?(filename)
    css = File.read(filename)
    File.open(filename, 'w+') do |f|
      # f << css.gsub(%r{-s([0-9a-f]{10})(\.\w+)}, '\2?\1').gsub(%r{(device-aspect-ratio:\s*)(\d+)\s*(/)\s*(\d+)}, '\1\2\3\4')
      f << css.gsub(%r{-s([0-9a-f]{10})(\.\w+)}, '\2').gsub(%r{(device-aspect-ratio:\s*)(\d+)\s*(/)\s*(\d+)}, '\1\2\3\4')
    end
  end
end
