/**
 * Puppy School — client for _layouts/puppy_school.html.
 *
 * Lessons are public and readable signed out. Signing in adds the interactive parts: the
 * progress rail, "Check My Homework", the two paste widgets, graduation and the certificate.
 *
 * THE SERVER DECIDES EVERYTHING. This page never writes progress, never knows an answer and
 * never stores what a learner pastes:
 *   progress + badges     rpc get_my_badges
 *   a lesson checkpoint   rpc check_lesson_completion   (records the pass itself)
 *   paste-it-back         POST playground /course/verify/lesson_4    { paste }
 *   share-it-back         POST playground /course/review/lesson_5    { share_text }
 *   certificate           rpc issue_my_certificate      (graduates only, private)
 *
 * Helpers from /account/shared.js: initSupabase, getCurrentUser, getCurrentSession,
 * takeEmailHint, SUPABASE_ANON_KEY, FUNCTIONS_URL.
 */
(function() {
    'use strict';

    var meta = JSON.parse(document.getElementById('ps-meta').textContent);
    var state = { user: null, progress: null, badges: [], emailHint: '' };

    // ------------------------------------------------------------------ small helpers
    function el(tag, className, text) {
        var node = document.createElement(tag);
        if (className) { node.className = className; }
        if (text !== undefined && text !== null) { node.textContent = text; }
        return node;
    }

    /** Copy written by us (front matter / _data), rendered to HTML at build time. */
    function copyHtml(key) {
        var tpl = document.getElementById('ps-copy-' + key);
        return tpl ? tpl.innerHTML.trim() : '';
    }

    function copyText(key) {
        var holder = el('div');
        holder.innerHTML = copyHtml(key);
        return holder.textContent.trim();
    }

    function loginUrl() {
        var url = '/account/login.html?return=' + encodeURIComponent(window.location.pathname);
        return state.emailHint ? url + '&email=' + encodeURIComponent(state.emailHint) : url;
    }

    function lessonById(id) {
        return meta.lessons.filter(function(l) { return l.id === id; })[0] || null;
    }

    // ------------------------------------------------------------------ auth + progress
    function applyAuth() {
        var signedIn = !!state.user;
        document.body.setAttribute('data-auth', signedIn ? 'signed-in' : 'signed-out');
        document.querySelectorAll('[data-when]').forEach(function(node) {
            node.hidden = node.getAttribute('data-when') !== (signedIn ? 'signed-in' : 'signed-out');
        });
        document.querySelectorAll('[data-login-link]').forEach(function(a) { a.href = loginUrl(); });
        document.querySelectorAll('.ps-widget-signin').forEach(renderSignInPrompt);
    }

    function renderSignInPrompt(holder) {
        holder.textContent = '';
        holder.appendChild(el('p', 'ps-signin-body', copyText('sign_in-body')));
        var bar = el('div', 'ps-action-bar');
        var signIn = el('a', 'btn btn-primary', 'Sign in');
        signIn.href = loginUrl();
        var register = el('a', 'btn btn-secondary', 'Create a free account');
        register.href = '/account/register.html';
        bar.appendChild(signIn);
        bar.appendChild(register);
        holder.appendChild(bar);
    }

    async function loadProgress() {
        if (!state.user) { return; }
        var result = await dbmnSupabase.rpc('get_my_badges');
        if (result.error || !result.data) { return; }
        state.progress = result.data.puppySchool;
        state.badges = result.data.badges || [];
    }

    function renderRail() {
        var done = state.progress ? state.progress.completed : [];
        var next = state.progress ? state.progress.nextLesson : null;
        document.querySelectorAll('.ps-rail-item').forEach(function(item) {
            var id = item.getAttribute('data-lesson');
            var complete = id === 'graduation' ? !!(state.progress && state.progress.graduatedAt) : done.indexOf(id) !== -1;
            item.classList.toggle('is-complete', complete);
            item.classList.toggle('is-next', !!state.user && id === next);
            item.title = complete ? 'Passed' : '';
        });
    }

    // ------------------------------------------------------------------ lesson body
    /** h2 + what follows → a step or a Bonus Credit section. An <hr> ends the step. */
    function enhanceBody() {
        var content = document.getElementById('ps-content');
        if (!content) { return; }

        var nodes = Array.prototype.slice.call(content.childNodes);
        var current = null;
        nodes.forEach(function(node) {
            if (node.nodeType === 1 && node.tagName === 'H2') {
                var title = node.textContent.trim();
                var step = /^Step\s+(\d+)\s+[—-]\s+(.*)$/.exec(title);
                var bonus = /^Bonus Credit\s+[—-]\s+(.*)$/.exec(title);
                current = el('section', bonus ? 'ps-step ps-bonus' : 'ps-step');
                content.insertBefore(current, node);
                if (step || bonus) {
                    current.appendChild(el('div', 'ps-step-label', step ? 'Step ' + step[1] : 'Bonus Credit'));
                    var heading = el('h3', null, step ? step[2] : bonus[1]);
                    if (node.id) { heading.id = node.id; }
                    current.appendChild(heading);
                    content.removeChild(node);
                } else {
                    current.appendChild(node);
                }
                return;
            }
            if (node.nodeType === 1 && node.tagName === 'HR') { current = null; return; }
            if (current) { current.appendChild(node); }
        });

        // Callouts: > **🐾 Dobermann Philosophy** / > **🦴 Dig Deeper** / > **A note …**
        content.querySelectorAll('blockquote').forEach(function(quote) {
            var lead = quote.querySelector('p:first-child > strong:first-child');
            quote.classList.add('ps-callout');
            if (lead) {
                var titleEl = el('div', 'ps-callout-title', lead.textContent.trim());
                var firstPara = lead.parentNode;
                firstPara.removeChild(lead);
                if (!firstPara.textContent.trim()) { quote.removeChild(firstPara); }
                quote.insertBefore(titleEl, quote.firstChild);
            }
        });

        content.querySelectorAll('table').forEach(function(table) {
            table.classList.add('ps-config-table');
            var wrap = el('div', 'ps-table-wrap');
            table.parentNode.insertBefore(wrap, table);
            wrap.appendChild(table);
        });

        content.querySelectorAll('pre').forEach(function(pre) {
            if (pre.closest('.ps-code-wrapper')) { return; }
            var host = pre.closest('div.highlighter-rouge') || pre;
            var wrapper = el('div', 'ps-code-wrapper');
            host.parentNode.insertBefore(wrapper, host);
            wrapper.appendChild(host);
            pre.classList.add('ps-code');
            var button = el('button', 'ps-copy-btn', 'Copy');
            button.type = 'button';
            button.addEventListener('click', function() {
                navigator.clipboard.writeText(pre.textContent.replace(/\n$/, '')).then(function() {
                    button.textContent = 'Copied';
                    button.classList.add('copied');
                    setTimeout(function() { button.textContent = 'Copy'; button.classList.remove('copied'); }, 1600);
                });
            });
            wrapper.appendChild(button);
        });

        document.querySelectorAll('[data-copy]').forEach(function(node) {
            node.innerHTML = copyHtml(node.getAttribute('data-copy'));
        });
        document.querySelectorAll('[data-copy-label]').forEach(function(node) {
            var label = copyText(node.getAttribute('data-copy-label'));
            if (label) { node.textContent = label; }
        });
    }

    function renderPager() {
        var pager = document.getElementById('ps-pager');
        if (!pager) { return; }
        var index = meta.lessons.map(function(l) { return l.id; }).indexOf(meta.lessonId);
        var prev = meta.lessons[index - 1];
        var next = meta.lessons[index + 1];
        if (prev) {
            var back = el('a', 'ps-pager-link', '← Lesson ' + prev.number + ': ' + prev.title);
            back.href = prev.url;
            pager.appendChild(back);
        } else { pager.appendChild(el('span')); }
        var forward = el('a', 'ps-pager-link ps-pager-next', next ? 'Lesson ' + next.number + ': ' + next.title + ' →' : 'Graduation →');
        forward.href = next ? next.url : '/puppy-school/graduation/';
        pager.appendChild(forward);
    }

    // ------------------------------------------------------------------ checkpoint
    function showCheckpoint(kind, headingKey, bodyHtml, items) {
        var box = document.getElementById('ps-checkpoint-result');
        box.hidden = false;
        box.className = 'ps-checkpoint-result is-' + kind;
        box.textContent = '';
        box.appendChild(el('h3', null, copyText(headingKey)));
        var body = el('div', 'ps-checkpoint-body');
        body.innerHTML = bodyHtml;          // our own copy, rendered at build time
        box.appendChild(body);
        if (items && items.length) {
            var list = el('ul', 'ps-incomplete-list');
            items.forEach(function(text) { list.appendChild(el('li', null, text)); });   // server text → textContent
            box.appendChild(list);
        }
        if (kind === 'fail') {
            var support = el('div', 'ps-support-link');
            support.innerHTML = copyHtml('checkpoint-fail_support');
            box.appendChild(support);
        }
        box.setAttribute('data-result', kind);
    }

    async function runCheckpoint() {
        var button = document.getElementById('ps-check-btn');
        if (!state.user) { window.location.href = loginUrl(); return; }

        button.disabled = true;
        showCheckpoint('loading', 'checkpoint-loading', copyHtml('checkpoint-loading_sub'));
        try {
            var result = await dbmnSupabase.rpc('check_lesson_completion', { p_user_id: state.user.id, p_lesson_id: meta.lessonId });
            if (result.error || !result.data) { throw new Error(result.error ? result.error.message : 'no data'); }
            if (result.data.passed) {
                showCheckpoint('pass', 'checkpoint-pass_heading', copyHtml('checkpoint-pass'));
                var index = meta.lessons.map(function(l) { return l.id; }).indexOf(meta.lessonId);
                var next = meta.lessons[index + 1];
                var onward = el('a', 'btn btn-primary ps-onward', next ? 'On to Lesson ' + next.number : 'Graduate');
                onward.href = next ? next.url : '/puppy-school/graduation/';
                document.getElementById('ps-checkpoint-result').appendChild(onward);
                await loadProgress();
                renderRail();
            } else {
                showCheckpoint('fail', 'checkpoint-fail_heading', copyHtml('checkpoint-fail'), result.data.incomplete || []);
            }
        } catch (e) {
            showCheckpoint('error', 'checkpoint-error_heading', copyHtml('checkpoint-error_body'));
        } finally {
            button.disabled = false;
        }
    }

    // ------------------------------------------------------------------ paste-it-back / share-it-back
    var WIDGETS = {
        verify: { path: function() { return meta.verifyEndpoint; }, field: 'paste' },
        review: { path: function() { return '/course/review/' + meta.lessonId; }, field: 'share_text' }
    };

    function renderFindings(box, kind, passed, findings) {
        box.hidden = false;
        box.textContent = '';
        box.className = 'ps-widget-result ' + (passed ? 'is-pass' : 'is-fail');
        box.setAttribute('data-result', passed ? 'pass' : 'fail');
        var lead = el('div', 'ps-widget-lead');
        lead.innerHTML = copyHtml(kind + (passed ? '-pass' : '-fail'));
        box.appendChild(lead);

        var order = ['error', 'warn', 'tip'];
        var titles = { error: 'Fix these', warn: 'Worth a look', tip: 'Tips' };
        order.forEach(function(level) {
            var group = (findings || []).filter(function(f) { return (f.level || 'error') === level; });
            if (!group.length) { return; }
            box.appendChild(el('h4', 'ps-findings-title ps-findings-' + level, titles[level]));
            var list = el('ul', 'ps-findings ps-findings-' + level);
            group.forEach(function(f) {
                var item = el('li');
                item.appendChild(el('span', 'ps-finding-message', f.message));    // server text → textContent
                if (f.hint) { item.appendChild(el('span', 'ps-finding-hint', f.hint)); }
                list.appendChild(item);
            });
            box.appendChild(list);
        });
    }

    function renderWidgetNotice(box, key) {
        box.hidden = false;
        box.textContent = '';
        box.className = 'ps-widget-result is-notice';
        box.setAttribute('data-result', 'notice');
        box.appendChild(el('p', null, copyText(key)));
    }

    function wireWidget(section) {
        var kind = section.getAttribute('data-widget');
        var config = WIDGETS[kind];
        var input = section.querySelector('.ps-widget-input');
        var button = section.querySelector('.ps-widget-submit');
        var box = section.querySelector('.ps-widget-result');
        if (!config || !input || !button) { return; }

        button.addEventListener('click', async function() {
            var text = input.value;
            if (!text.trim()) { input.focus(); return; }
            var session = await getCurrentSession();
            if (!session) { window.location.href = loginUrl(); return; }

            button.disabled = true;
            try {
                var body = {};
                body[config.field] = text;
                var response = await fetch(FUNCTIONS_URL + '/playground' + config.path(), {
                    method: 'POST',
                    headers: { 'Authorization': 'Bearer ' + session.access_token, 'apikey': SUPABASE_ANON_KEY, 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                });
                var data = await response.json().catch(function() { return null; });
                if (response.status === 200 || response.status === 422) {
                    renderFindings(box, kind, response.status === 200, data && data.findings);
                    if (response.status === 200) { input.value = ''; }      // nothing pasted lingers
                } else if (response.status === 429) { renderWidgetNotice(box, 'widgets-rate_limited'); }
                else if (response.status === 413) { renderWidgetNotice(box, 'widgets-too_large'); }
                else if (response.status === 401) { window.location.href = loginUrl(); }
                else if (response.status === 400) { renderWidgetNotice(box, 'widgets-bad_request'); }
                else { renderWidgetNotice(box, 'widgets-error'); }
            } catch (e) {
                renderWidgetNotice(box, 'widgets-error');
            } finally {
                button.disabled = false;
            }
        });
    }

    // ------------------------------------------------------------------ landing
    function renderLandingCta() {
        var mount = document.getElementById('ps-course-cta');
        if (!mount) { return; }
        mount.textContent = '';
        var bar = el('div', 'ps-action-bar');
        if (!state.user) {
            var signIn = el('a', 'btn btn-primary', 'Sign in to start');
            signIn.href = loginUrl();
            var register = el('a', 'btn btn-secondary', 'Create a free account');
            register.href = '/account/register.html';
            var read = el('a', 'ps-pager-link', 'or just start reading →');
            read.href = meta.lessons[0].url;
            bar.appendChild(signIn); bar.appendChild(register);
            mount.appendChild(bar);
            mount.appendChild(read);
            return;
        }
        var done = state.progress ? state.progress.completed.length : 0;
        var next = state.progress && state.progress.nextLesson ? lessonById(state.progress.nextLesson) : null;
        var primary = el('a', 'btn btn-primary');
        if (state.progress && state.progress.graduatedAt) {
            primary.textContent = 'Your certificate';
            primary.href = '/puppy-school/graduation/';
        } else if (done === 0 || !next) {
            primary.textContent = 'Begin Puppy School';
            primary.href = meta.lessons[0].url;
        } else {
            primary.textContent = 'Resume Lesson ' + next.number;
            primary.href = next.url;
        }
        bar.appendChild(primary);
        mount.appendChild(bar);
        if (done > 0) { mount.appendChild(el('p', 'ps-cta-progress', done + ' of ' + meta.lessons.length + ' lessons passed')); }
    }

    // ------------------------------------------------------------------ badges
    var badgeArtPromise = null;
    function loadBadgeArt() {
        if (!badgeArtPromise) {
            badgeArtPromise = fetch('/account/badges.json').then(function(r) { return r.json(); }).catch(function() { return null; });
        }
        return badgeArtPromise;
    }

    function badgeSvg(art, id) {
        if (!art) { return ''; }
        return (art.badges && art.badges[id] && art.badges[id].svg) || art.placeholder || '';
    }

    async function renderBadgeGrid(mount) {
        var art = await loadBadgeArt();
        mount.textContent = '';
        state.badges.forEach(function(badge) {
            var earned = !!badge.earnedAt;
            var item = el('div', 'dbmn-badge' + (earned ? '' : ' dbmn-badge-locked'));
            item.title = earned ? badge.name + ' — earned ' + new Date(badge.earnedAt).toLocaleDateString() : badge.name + ' — ' + badge.description;
            var picture = el('div', 'dbmn-badge-art');
            picture.innerHTML = badgeSvg(art, badge.id);     // our own exported artwork, keyed by id
            item.appendChild(picture);
            item.appendChild(el('div', 'dbmn-badge-name', badge.name));
            mount.appendChild(item);
        });
    }

    // ------------------------------------------------------------------ graduation + certificate
    function xml(text) {
        return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    /** Self-contained SVG: system fonts only, so it draws identically on a canvas. */
    function certificateSvg(cert, badge) {
        var date = new Date(cert.issuedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
        var name = xml(cert.name);
        var size = cert.name.length > 34 ? 56 : cert.name.length > 24 ? 70 : 86;
        var inner = badge.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1130" width="1600" height="1130" role="img" aria-label="Puppy School certificate">' +
            '<defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1a1a2e"/><stop offset="1" stop-color="#16213e"/></linearGradient></defs>' +
            '<rect width="1600" height="1130" fill="url(#bg)"/>' +
            '<rect x="40" y="40" width="1520" height="1050" fill="none" stroke="#f2b632" stroke-width="4"/>' +
            '<rect x="58" y="58" width="1484" height="1014" fill="none" stroke="#f2b632" stroke-opacity="0.45" stroke-width="1.5"/>' +
            '<g font-family="Georgia, \'Times New Roman\', serif" text-anchor="middle" fill="#ffffff">' +
            '<text x="800" y="190" font-size="34" letter-spacing="10" fill="#f2b632">DBMN · PUPPY SCHOOL</text>' +
            '<text x="800" y="290" font-size="64">Certificate of Graduation</text>' +
            '<text x="800" y="390" font-size="30" fill="#a0a0b0" font-style="italic">This certifies that</text>' +
            '<text x="800" y="' + (440 + size) + '" font-size="' + size + '" font-weight="bold">' + name + '</text>' +
            '<line x1="400" y1="560" x2="1200" y2="560" stroke="#f2b632" stroke-width="2"/>' +
            '<text x="800" y="625" font-size="30" fill="#d0d0e0">completed all five lessons of Puppy School, the hands-on Dobermann course:</text>' +
            '<text x="800" y="675" font-size="27" fill="#a0a0b0">connecting to a live API · loading at scale · handling errors · reporting · building a nested data load</text>' +
            '</g>' +
            '<svg x="720" y="720" width="160" height="160" viewBox="0 0 64 64">' + inner + '</svg>' +
            '<g font-family="Georgia, \'Times New Roman\', serif" fill="#d0d0e0">' +
            '<text x="130" y="960" font-size="28">' + xml(date) + '</text>' +
            '<text x="130" y="1000" font-size="20" fill="#a0a0b0">Date of graduation</text>' +
            '<text x="1470" y="960" font-size="28" text-anchor="end">dbmn.io/puppy-school</text>' +
            '<text x="1470" y="1000" font-size="20" fill="#a0a0b0" text-anchor="end">Certificate ID ' + xml(cert.certificateId) + '</text>' +
            '</g></svg>';
    }

    function downloadPng(svgText, filename) {
        return new Promise(function(resolve, reject) {
            var url = URL.createObjectURL(new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' }));
            var image = new Image();
            image.onload = function() {
                var canvas = document.createElement('canvas');
                canvas.width = 1600; canvas.height = 1130;
                canvas.getContext('2d').drawImage(image, 0, 0, 1600, 1130);
                URL.revokeObjectURL(url);
                canvas.toBlob(function(blob) {
                    if (!blob) { reject(new Error('no image')); return; }
                    var link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = filename;
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                    setTimeout(function() { URL.revokeObjectURL(link.href); }, 4000);
                    resolve();
                }, 'image/png');
            };
            image.onerror = function() { URL.revokeObjectURL(url); reject(new Error('could not draw the certificate')); };
            image.src = url;
        });
    }

    function linkedInUrl(cert) {
        var issued = new Date(cert.issuedAt);
        var params = new URLSearchParams({
            startTask: 'CERTIFICATION_NAME',
            name: 'Puppy School Graduate — Dobermann (DBMN)',
            organizationName: 'DBMN',
            issueYear: String(issued.getFullYear()),
            issueMonth: String(issued.getMonth() + 1),
            certId: cert.certificateId
        });
        return 'https://www.linkedin.com/profile/add?' + params.toString();
    }

    async function showCertificate(mount, cert) {
        var art = await loadBadgeArt();
        var svg = certificateSvg(cert, badgeSvg(art, 'ps_graduate'));
        mount.textContent = '';
        var frame = el('div', 'ps-certificate');
        frame.id = 'ps-certificate-svg';
        frame.innerHTML = svg;                  // built above from XML-escaped values
        mount.appendChild(frame);

        var bar = el('div', 'ps-action-bar ps-no-print');
        var download = el('button', 'btn btn-primary', 'Download (PNG)');
        download.type = 'button';
        download.id = 'ps-cert-download';
        download.addEventListener('click', function() {
            download.disabled = true;
            downloadPng(svg, 'puppy-school-certificate.png').catch(function() { window.print(); }).then(function() { download.disabled = false; });
        });
        var print = el('button', 'btn btn-secondary', 'Print or save as PDF');
        print.type = 'button';
        print.addEventListener('click', function() { window.print(); });
        var share = el('a', 'btn btn-secondary', 'Add to LinkedIn');
        share.href = linkedInUrl(cert);
        share.target = '_blank';
        share.rel = 'noopener';
        bar.appendChild(download); bar.appendChild(print); bar.appendChild(share);
        mount.appendChild(bar);

        var rename = el('button', 'ps-link-button ps-no-print', 'Change the name on it');
        rename.type = 'button';
        rename.addEventListener('click', function() { showNameForm(mount, cert.name); });
        mount.appendChild(rename);
    }

    function showNameForm(mount, suggested) {
        mount.textContent = '';
        var form = el('form', 'ps-name-form');
        form.appendChild(el('label', 'ps-widget-label', 'The name to print on your certificate'));
        var input = el('input', 'ps-name-input');
        input.type = 'text'; input.maxLength = 80; input.required = true; input.id = 'ps-cert-name';
        input.value = suggested || '';
        input.autocomplete = 'name';
        form.appendChild(input);
        var bar = el('div', 'ps-action-bar');
        var submit = el('button', 'btn btn-primary', 'Create my certificate');
        submit.type = 'submit';
        bar.appendChild(submit);
        form.appendChild(bar);
        var error = el('p', 'ps-form-error');
        error.hidden = true;
        form.appendChild(error);
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            submit.disabled = true;
            error.hidden = true;
            var result = await dbmnSupabase.rpc('issue_my_certificate', { p_name: input.value });
            submit.disabled = false;
            if (result.error || !result.data) {
                var message = result.error ? result.error.message : '';
                error.textContent = message === 'NAME_TOO_LONG' ? 'That name is too long — 80 characters at most.'
                    : message === 'NAME_REQUIRED' ? 'Please enter the name to print.'
                    : 'We could not create your certificate. Please try again.';
                error.hidden = false;
                return;
            }
            showCertificate(mount, result.data);
        });
        mount.appendChild(form);
        input.focus();
    }

    async function renderGraduation() {
        var gate = document.getElementById('ps-graduation-gate');
        var content = document.getElementById('ps-content');
        if (!gate || !content) { return; }
        var graduated = !!(state.progress && state.progress.graduatedAt);
        content.hidden = !graduated;
        gate.hidden = graduated;
        if (!graduated) {
            gate.textContent = '';
            gate.setAttribute('data-state', state.user ? 'not-yet' : 'signed-out');
            if (!state.user) {
                gate.appendChild(el('h1', 'ps-lesson-title', 'Graduation'));
                renderSignInPrompt(gate.appendChild(el('div')));
                return;
            }
            var done = state.progress ? state.progress.completed.length : 0;
            var next = state.progress && state.progress.nextLesson ? lessonById(state.progress.nextLesson) : meta.lessons[0];
            gate.appendChild(el('h1', 'ps-lesson-title', 'Not yet.'));
            gate.appendChild(el('p', 'ps-lesson-goal', done + ' of ' + meta.lessons.length + ' lessons passed. Graduation opens when all five are done.'));
            var go = el('a', 'btn btn-primary', 'Go to Lesson ' + next.number + ': ' + next.title);
            go.href = next.url;
            gate.appendChild(go);
            return;
        }

        var certMount = document.getElementById('ps-certificate');
        if (certMount) {
            var badgeRow = el('div', 'dbmn-badge-grid ps-no-print');
            badgeRow.id = 'ps-badges';
            certMount.parentNode.insertBefore(badgeRow, certMount);
            renderBadgeGrid(badgeRow);

            var existing = await dbmnSupabase.from('puppy_school_certificates').select('id, name_on_certificate, issued_at').maybeSingle();
            if (existing.data) {
                showCertificate(certMount, { certificateId: existing.data.id, name: existing.data.name_on_certificate, issuedAt: existing.data.issued_at });
            } else {
                var profile = await dbmnSupabase.from('user_profiles').select('display_name').eq('id', state.user.id).maybeSingle();
                showNameForm(certMount, profile.data && profile.data.display_name);
            }
        }
    }

    // ------------------------------------------------------------------ boot
    document.addEventListener('DOMContentLoaded', async function() {
        state.emailHint = takeEmailHint();      // #email=… from the extension: read, then stripped
        enhanceBody();
        renderPager();
        initSupabase();

        state.user = await getCurrentUser();
        applyAuth();
        await loadProgress();
        renderRail();
        renderLandingCta();
        if (meta.kind === 'graduation') { await renderGraduation(); }

        var check = document.getElementById('ps-check-btn');
        if (check) { check.addEventListener('click', runCheckpoint); }
        document.querySelectorAll('.ps-widget').forEach(wireWidget);
        document.body.setAttribute('data-ready', 'true');
    });
})();
