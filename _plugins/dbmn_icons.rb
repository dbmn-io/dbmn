# frozen_string_literal: true

# DBMN icon tokens — `{icon:paste-endpoint}` → the product's own SVG.
#
# Docs and Puppy School lessons never name an icon; they name the *function*
# the icon performs (a "role"). The roles and their SVGs come from the
# extension — vs-dbmn `src/webviews/shared/icons.js` — exported into
# `_data/dbmn_icons.json` by `npm run docs:icons` (and automatically on every
# release by `scripts/release-publish.js`). When a control's icon changes in
# the product, the next export changes it here too, and every page that says
# "click {icon:paste-endpoint}" shows the new icon without being edited.
#
# Runs after render so it works on pages with `render_with_liquid: false`
# (the docs and lessons, which contain `{{template variables}}`). Tokens
# inside <code>/<pre> are left alone so the syntax itself can be documented.
# Unknown roles are left in place and warned about — never silently dropped.
#
# Syntax check without Jekyll: `ruby -c _plugins/dbmn_icons.rb`
# Behaviour check:            `ruby _plugins/dbmn_icons.rb` (runs self-test)
module DbmnIcons
  TOKEN = /\{icon:([a-z0-9-]+)\}/.freeze
  # Segments the replacer must not touch.
  # <script> too: page data is emitted as JSON in a script tag, and an injected <svg …>
  # (full of double quotes) would corrupt it. <template> is NOT protected — copy in
  # templates is HTML and wants its icons.
  PROTECTED = %r{(<pre\b.*?</pre>|<code\b.*?</code>|<script\b.*?</script>)}mi.freeze

  # @param html  [String] rendered page HTML
  # @param roles [Hash]   `_data/dbmn_icons.json`["roles"]: role => { "icon", "svg" }
  # @return [String, Array<String>] rewritten HTML and the unknown roles met
  def self.render(html, roles)
    unknown = []
    out = html.split(PROTECTED).map do |segment|
      next segment if segment =~ PROTECTED

      segment.gsub(TOKEN) do
        role = Regexp.last_match(1)
        entry = roles[role]
        if entry && entry['svg']
          %(<span class="dbmn-icon" data-icon-role="#{role}" data-icon="#{entry['icon']}" aria-hidden="true">#{entry['svg']}</span>)
        else
          unknown << role
          Regexp.last_match(0)
        end
      end
    end.join
    [out, unknown.uniq]
  end
end

if defined?(Jekyll)
  Jekyll::Hooks.register [:pages, :documents], :post_render do |item|
    next unless item.output_ext == '.html'

    roles = (item.site.data['dbmn_icons'] || {})['roles'] || {}
    next unless item.output.include?('{icon:')

    item.output, unknown = DbmnIcons.render(item.output, roles)
    unknown.each do |role|
      Jekyll.logger.warn 'DBMN icons:', "unknown role {icon:#{role}} in #{item.relative_path} — add it to ICON_ROLES in vs-dbmn icons.js and run npm run docs:icons"
    end
  end
end

# Self-test: `ruby _plugins/dbmn_icons.rb`
if $PROGRAM_NAME == __FILE__
  roles = { 'paste-endpoint' => { 'icon' => 'clipboard', 'svg' => '<svg>P</svg>' } }
  html = '<p>Click {icon:paste-endpoint} then {icon:nope}.</p><code>{icon:paste-endpoint}</code><pre>x {icon:paste-endpoint}</pre>'
  out, unknown = DbmnIcons.render(html, roles)
  raise 'token not replaced' unless out.include?('<span class="dbmn-icon" data-icon-role="paste-endpoint" data-icon="clipboard" aria-hidden="true"><svg>P</svg></span>')
  raise 'unknown role not preserved' unless out.include?('{icon:nope}')
  raise 'code segment was rewritten' unless out.include?('<code>{icon:paste-endpoint}</code>')
  raise 'pre segment was rewritten' unless out.include?('<pre>x {icon:paste-endpoint}</pre>')
  raise 'unknown roles not reported' unless unknown == ['nope']
  puts 'dbmn_icons.rb self-test OK'
end
