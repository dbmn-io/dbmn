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
# Puppy School lessons (_puppy_school/) are checked too: they describe the same product.
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
    # Endpoints rows and History rows have right-click menus (vs-dbmn #444, #314); other Hub lists don't
    [/right-click (an |the |your )?(environment|folder)\b/i, 'there are no context menus on the Environments list; name the button'],
    # The Hub's search, 2026-11-12 (vs-dbmn #444): one box, the query builder writes it
    [/Search across everything|Search endpoint, path, status, body content/, 'the box is "Search" (see hub#search); the button beside it is "Build a search"'],
    [/\bAlt\+D\b|Quick Access/, 'removed; the only VS Code keybinding is Ctrl+W in the Hub'],
    [/\.active8\/(results|batches)/, 'files are saved under {workspace}/{environment}/{endpoint}/ (see your-data)'],
    [/Dobermann: (Export|Import) Workspace|Import Endpoint\b|Export Endpoint\b|Export Folder\b/, 'Hub → Import / Export, one .dbmn.zip'],
    [/Configure Pagination|\bFetch All\b(?! pages)|Get Next X Pages/, 'the Console footer button is "Pagination"; the options are "Fetch all pages" and "Get next N pages"'],
    [/Maximum Error Count|Percentage-Based|Continue on All Errors|Stop on First Error/, 'Error Handling is "Stop on first error" or "Continue processing" (default)'],
    [/\bstatus bar\b/i, 'there is no DBMN status bar item; sign in under Hub → Account, switch environments in the header'],
    [/\bRead Data\b/, 'the Source step\'s button is "Import Data"'],
    [/\bReps\b|Maximum Repetitions|maxRepetitions/, 'the Review setting is "Rows per request"'],
    [/Review JSON\b/, 'Step 4 is "Review"'],
    # Production's highlight follows the theme (2026-10-14): it is red in only some of them
    [/\b(header|selector)\b[^.]{0,20}\bred\b|\bred\b[^.]{0,20}\b(header|selector)\b|\b(shown|is|are) (in )?red\b/i, 'production is "highlighted as a warning"; the colour comes from the theme'],
    # Run Batch steps, renamed 2026-10-05 (the step bar): Source, Map, Validate, Review. Execute was
    # step 5 until 2026-11-12 (vs-dbmn #435): now Review's button, its settings in Review's Configure
    [/\bLoad Data\b/, 'Run Batch step 1 is "Source" (its button is still "Import Data")'],
    [/Map (&|&amp;|and) Transform/, 'Run Batch step 2 is "Map"'],
    [/Review (&|&amp;|and) Edit Data/, 'Run Batch step 3 is "Validate"'],
    [/Review (&|&amp;|and) Configure/, 'Run Batch step 4 is "Review"'],
    [/Execute Batch\b/, 'Run Batch has four steps; Execute is the Review step\'s button'],
    [/\bExecute step\b|\bthe \*\*Execute\*\* step\b|\bon Execute\b|\bStep 5 — Execute|five steps/, 'Run Batch has four steps (Source, Map, Validate, Review); Name, Error Handling and Processing Mode are in Review\'s Configure, and Execute is its button'],
    [/Enable\s+parallel\s+batch\s+processing/i, 'the checkbox is gone; Max Concurrency alone sets how many requests a batch sends at once (Sequential = 1)'],
    [/\bMock Requests?\b/, 'Enable Mock Requests was removed; the Training Ground does that job (the endpoint editor\'s Mock Response tab is a different thing)'],
    [/Sign in to run/, 'nothing needs a DBMN sign-in to run (0.4.0); an account adds storage, Standard Systems and Weekly Usage'],
    [/Share button|clicks? \*\*Share\*\*|the \*\*Share\*\*/, 'the footer button is "Copy to Share"'],
    [/More Actions/, 'footer buttons; "More" only holds the overflow'],
    [/\bExecutions sidebar\b|\bhistory sidebar\b|Executions in the sidebar/i, '{icon:nav-history} History on the Hub rail'],
    [/Set as Active\*\* from (a |the )?(context )?menu|Select \*\*Set as Active\*\*/i, 'the header environment selector, or Set as Active in the environment editor footer'],
    [/View Logs|\bRendered\b(?= view)/, 'the Raw tab buttons are "Logs" and "Raw / Render / Text"'],
    [/Copy Batch\b/, 'the Console footer button is "Copy"'],
    [/↻/, 'Review rebuilds its requests by itself; there is no Refresh button'],
    [/\bLoad Data\b|Map & Transform|Review & Edit Data|Review & Configure|\bExecute Batch\b/, 'the Run Batch steps are Source, Map, Validate, Review'],
    [/dashed outline/, 'help mode draws a dotted outline'],
    # Compare, 2026-11-13: step 3 is Columns; the picks sit in four slots across the top of every step
    [/Which columns do you want compared/, 'Compare\'s step 3 is "Columns"'],
    [/\bthe tray\b|\bComparing\*\*, on the left/, 'Compare\'s picks are the four slots across the top of every step'],
    [/One BL to many|Many BL to one|\*\*Many to\s+many\*\*/, 'Match\'s rows are Repeated in C1, Repeated in BL, Repeated in both'],
    [/\{icon:nav-compare\}|\bCompare list\b|rail's Compare\b/, 'the rail item is {icon:nav-reporting} Reporting; a compare is one kind of report'],
    [/Set System…/, 'the Endpoints Select footer button is "Update" (System, add tags, remove tags)'],
    # The API Catalogue is Endpoints from 0.4.0: the rail item, the list and Settings → Endpoints
    [/\bAPI Catalogue\b/, 'the rail item and list are {icon:nav-api-catalogue} Endpoints (renamed in 0.4.0); Settings → Endpoints'],
    [/`View: /, 'the view button is named after the active view, with no "View:" prefix'],
    [/\bhelp icons?\b|\(i\) icon|\? icon/i, 'there are no per-control help icons; turn on help mode (help button in the Hub header, or ?)'],
    [/\bPending only\b|\bReprocess Incomplete\b/i, 'Reprocess offers Errors only, Split array errors and All; a paused or cancelled batch is Resumed'],
    # An organisation is an ordinary environment variable (vs-dbmn #424, 2026-10-30)
    [/(organi[sz]ations?|locations?|options|the list)[^.]{0,40}\bfrom (the|your) token\b/i, 'nothing is read from the token: an organisation is an ordinary variable whose Options you type (environments#organization-selection)'],
    [/\(pick \w+\)/, 'the header segment reads `pick <name>`, with no brackets'],
    [/At the foot of the list, \*\*Edit\*\*/, 'each environment in the selector has its own pencil; the foot has only New environment…'],
    # The URL's path can change after creation; an empty header variable is asked for (vs-dbmn #424, 2026-11-06)
    [/URL is fixed once the environment exists|can't be edited after creation/i, "only the host is fixed; the path changes from the heading's pencil (environments#base-url-variables)"],
    [/without options is never asked for/i, 'an empty header variable, or one the Base URL uses, is asked for before a run (environments#variables)'],
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

  # The lessons describe the same product; the same words retire there too.
  Jekyll::Hooks.register :documents, :post_render do |doc|
    next unless doc.collection.label == 'puppy_school'

    hits = DocsTermsGuard.scan(doc.output.to_s)
    next if hits.empty?

    lines = hits.map { |text, hint| "  \"#{text}\" — #{hint}" }
    raise "docs_terms_guard: #{doc.relative_path} uses retired vocabulary:\n#{lines.join("\n")}"
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
