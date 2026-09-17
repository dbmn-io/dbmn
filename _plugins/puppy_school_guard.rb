# frozen_string_literal: true

# Puppy School lessons carry a `note_to_reviewer` in their front matter: the reasoning behind
# each lesson, and in places the ANSWERS (which rows, which counts). It must never reach a
# page. The layout only emits an explicit allow-list of front matter, and this plugin is the
# second lock on the door:
#
#   1. before render, the note is removed from every course document, so no layout, include
#      or future `jsonify` can emit it by accident;
#   2. after render, the build FAILS if the phrase appears in any course page.
#
# Self-test:  ruby _plugins/puppy_school_guard.rb
module PuppySchoolGuard
  FORBIDDEN_KEYS = %w[note_to_reviewer].freeze

  def self.strip!(data)
    FORBIDDEN_KEYS.each { |key| data.delete(key) }
    data
  end

  def self.leak?(html)
    FORBIDDEN_KEYS.any? { |key| html.include?(key) }
  end
end

if defined?(Jekyll)
  Jekyll::Hooks.register :documents, :pre_render do |doc|
    PuppySchoolGuard.strip!(doc.data) if doc.collection.label == 'puppy_school'
  end

  Jekyll::Hooks.register :documents, :post_render do |doc|
    next unless doc.collection.label == 'puppy_school'
    raise "puppy_school_guard: reviewer notes leaked into #{doc.relative_path}" if PuppySchoolGuard.leak?(doc.output.to_s)
  end
end

if $PROGRAM_NAME == __FILE__
  data = { 'title' => 'x', 'note_to_reviewer' => 'the answer is 924' }
  raise 'strip! failed' if PuppySchoolGuard.strip!(data).key?('note_to_reviewer')
  raise 'leak? missed it' unless PuppySchoolGuard.leak?('<p>note_to_reviewer: …</p>')
  raise 'leak? false positive' if PuppySchoolGuard.leak?('<p>Lesson 4</p>')
  puts 'puppy_school_guard.rb self-test OK'
end
