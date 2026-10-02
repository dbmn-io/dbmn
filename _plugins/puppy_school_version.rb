# frozen_string_literal: true

# Puppy School — the Dobermann version the course needs.
#
# The lessons depend on extension behaviour that older releases don't have (the grouping rule
# for nested batches, `|opt` in nested templates, Ctrl+D block delete, Run API row paste…).
# The minimum version lives in ONE place, `_config.yml` → `puppy_school.min_dobermann`, and
# pages say `{dobermann-min-version}` wherever they need it. Raise it in _config.yml when a
# lesson starts to depend on something newer, and every page follows.
#
# Runs after render (lessons have `render_with_liquid: false`), on course documents only.
# A missing setting FAILS the build rather than printing a blank version.
#
# Self-test: ruby _plugins/puppy_school_version.rb
module PuppySchoolVersion
  TOKEN = '{dobermann-min-version}'

  def self.render(html, version)
    raise 'Puppy School: set puppy_school.min_dobermann in _config.yml' if version.to_s.strip.empty?

    html.gsub(TOKEN, version.to_s)
  end
end

if defined?(Jekyll)
  Jekyll::Hooks.register :documents, :post_render do |doc|
    next unless doc.collection.label == 'puppy_school'
    next unless doc.output.include?(PuppySchoolVersion::TOKEN)

    doc.output = PuppySchoolVersion.render(doc.output, (doc.site.config['puppy_school'] || {})['min_dobermann'])
  end
end

if $PROGRAM_NAME == __FILE__
  out = PuppySchoolVersion.render('<p>Dobermann {dobermann-min-version} or later</p>', '0.3.0')
  raise 'token not replaced' unless out == '<p>Dobermann 0.3.0 or later</p>'
  begin
    PuppySchoolVersion.render('x', nil)
    raise 'missing version did not fail'
  rescue RuntimeError => e
    raise e unless e.message.include?('min_dobermann')
  end
  puts 'puppy_school_version.rb self-test OK'
end
