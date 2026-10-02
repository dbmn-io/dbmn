# frozen_string_literal: true

# Docs vocabulary guard — the public docs may only describe the product as it is.
#
# Dobermann's UI has moved on more than once (tree views → the Hub, folders → tags,
# Reps → Rows per request, Share → Copy to Share…), and each time the docs quietly kept
# the old words. This plugin makes that a build failure instead of a reader's problem:
# every rendered page under docs/ is checked against RETIRED, a list of phrases that no
# longer exist in the product, and the build FAILS naming the page and the phrase.
#
# Code spans and blocks are ignored, so the syntax itself can still be documented.
# docs/changelog.md is skipped: it is immutable history and is generated from vs-dbmn.
#
# When the product retires a label, add the old phrase here (with the replacement, so the
# message tells the writer what to say instead) and the next build finds every page that
# still uses it. The current vocabulary lives in CLAUDE.md → "UI vocabulary".
#
# Self-test:  ruby _plugins/docs_terms_guard.rb
module DocsTermsGuard
  # [pattern, what to write instead]
  RETIRED = [
    [/Manhattan/i, 'never name a customer platform in public copy (CLAUDE.md branding rule)'],
    [/\btree view\b|\bsidebar tree\b|\bEndpoints tree\b|\bEnvironments tree\b/i, 'the Hub: rail → list panel → tabs'],
    [/\bsidebar\b(?! closes)/i, 'the Hub rail or list panel (the VS Code sidebar closes when the Hub opens)'],
    [/right-click (an |the |your )?(environment|endpoint|folder|run)\b/i, 'there are no context menus on Hub lists; name the button'],
    [/\bAlt\+D\b|Quick Access/, 'removed; the only VS Code keybinding is Ctrl+W in the Hub'],
    [/\.active8\/(results|batches)/, 'files are saved under {workspace}/{environment}/{endpoint}/ (see your-data)'],
    [/Dobermann: (Export|Import) Workspace|Import Endpoint\b|Export Endpoint\b|Export Folder\b/, 'Hub → Import / Export, one .dbmn.zip'],
    [/Configure Pagination|\bFetch All\b(?! pages)|Get Next X Pages/, 'the Console footer button is "Pagination"; the options are "Fetch all pages" and "Get next N pages"'],
    [/Maximum Error Count|Percentage-Based|Continue on All Errors|Stop on First Error/, 'Error Handling is "Stop on first error" or "Continue processing" (default)'],
    [/\bstatus bar\b/i, 'there is no DBMN status bar item; sign in under Hub → Account, switch environments in the header'],
    [/\bRead Data\b/, 'the Load Data button is "Import Data"'],
    [/\bReps\b|Maximum Repetitions|maxRepetitions/, 'the Step 4 setting is "Rows per request"'],
    [/Review JSON\b/, 'Step 4 is "Review & Configure"'],
    [/Share button|clicks? \*\*Share\*\*|the \*\*Share\*\*/, 'the footer button is "Copy to Share"'],
    [/More Actions/, 'footer buttons; "More" only holds the overflow'],
    [/\bExecutions sidebar\b|\bhistory sidebar\b|Executions in the sidebar/i, '{icon:nav-history} History on the Hub rail'],
    [/Set as Active\*\* from (a |the )?(context )?menu|Select \*\*Set as Active\*\*/i, 'the header environment selector, or Set as Active in the environment editor footer'],
    [/View Logs|\bRendered\b(?= view)/, 'the Raw tab buttons are "Logs" and "Raw / Render / Text"'],
    [/Copy Batch\b/, 'the Console footer button is "Copy"'],
    [/`View: /, 'the view button is named after the active view, with no "View:" prefix'],
  ].freeze

  PROTECTED = %r{(<pre\b.*?</pre>|<code\b.*?</code>)}mi.freeze

  # @return [Array<Array(String, String)>] [matched text, replacement hint] for each hit
  def self.scan(html)
    hits = []
    html.split(PROTECTED).each do |segment|
      next if segment =~ PROTECTED

      text = segment.gsub(/<[^>]+>/, ' ')
      RETIRED.each do |pattern, hint|
        text.scan(pattern) { hits << [Regexp.last_match(0), hint] }
      end
    end
    hits.uniq
  end
end

if defined?(Jekyll)
  Jekyll::Hooks.register :pages, :post_render do |page|
    next unless page.output_ext == '.html'
    next unless page.relative_path.start_with?('docs/')
    next if page.relative_path == 'docs/changelog.md'

    hits = DocsTermsGuard.scan(page.output.to_s)
    next if hits.empty?

    lines = hits.map { |text, hint| "  \"#{text}\" — #{hint}" }
    raise "docs_terms_guard: #{page.relative_path} uses retired vocabulary:\n#{lines.join("\n")}"
  end
end

if $PROGRAM_NAME == __FILE__
  bad = '<p>Right-click the environment and set <b>Reps</b>.</p><code>Reps</code><pre>Alt+D E</pre>'
  hits = DocsTermsGuard.scan(bad)
  raise 'missed right-click' unless hits.any? { |t, _| t =~ /Right-click/ }
  raise 'missed Reps' unless hits.any? { |t, _| t == 'Reps' }
  raise 'code span not protected' if hits.size != 2
  raise 'false positive' unless DocsTermsGuard.scan('<p>Click <b>Rows per request</b>, then Copy to Share. The sidebar closes.</p>').empty?
  puts 'docs_terms_guard.rb self-test OK'
end
