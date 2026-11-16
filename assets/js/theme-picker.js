/**
 * The theme picker: the palette button opens a stage of themes, one at a time. The theme in the
 * middle is a DBMN screen in its colours (the Hub with a Console open, as a Run API leaves it);
 * its neighbours sit either side, turned away. The arrow buttons or keys, a click on a
 * neighbour, or a swipe move along; "Use <theme>" (or Enter) wears it and closes. Closing (the
 * close button, a click on the dark, Esc) changes nothing.
 *
 * One file for the web and desktop apps' Hub and for dbmn.io (`npm run docs:themes` copies it),
 * so the site and the app pick themes the same way. Nothing here knows where a theme is kept:
 * the page gives the menu (the theme list, what is current, each theme's preview colours) and
 * is told the pick. VS Code never gives a menu, so there the button stays hidden.
 *
 * A first visit gets a hint beside the button, once; closing it or following it ends it.
 *
 *   const picker = ThemePicker.create({ button, onPick(id), onHintDone(), icons: { close, prev, next, palette }, logo });
 *   picker.update(menu, { hint: true });
 *
 * `menu` is theme-choice.ts's ThemeMenu: { options, groups: [{ label, options }], current, previews }.
 */
(function (root) {
    'use strict';

    /** The mock screen is drawn at this size and scaled to the card. */
    const SCREEN_WIDTH = 1000;
    /** How many neighbours show each side. */
    const REACH = 2;
    const PIXELS = 46;

    function el(tag, className, text) {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined) node.textContent = text;
        return node;
    }

    /** An icon from a trusted SVG string (the page's own icon set), or a fallback character. */
    function icon(svg, className, fallback) {
        const span = el('span', className);
        span.setAttribute('aria-hidden', 'true');
        if (svg) span.innerHTML = svg;
        else if (fallback) span.textContent = fallback;
        return span;
    }

    function setColours(node, preview) {
        if (!preview) return;
        const set = (name, value) => { if (value) node.style.setProperty(name, value); };
        set('--tm-bg', preview.background);
        set('--tm-side', preview.sidebar);
        set('--tm-text', preview.text);
        set('--tm-muted', preview.muted);
        set('--tm-border', preview.border);
        set('--tm-accent', preview.accent);
        set('--tm-button', preview.button);
        set('--tm-button-text', preview.buttonText);
        const methods = preview.methods || {};
        set('--tm-get', methods.get);
        set('--tm-post', methods.post);
        set('--tm-put', methods.put);
        set('--tm-patch', methods.patch);
        set('--tm-delete', methods.delete);
    }

    // ── The mock screen: the Hub with a Console open ─────────────────────
    // The Console as a Run API leaves it on the Training Ground: Completed, the carriers in the
    // table, Re-run below. Simplified (no icons, fewer columns), laid out as the real one is.

    const CARRIERS = [
        ['BARK', 'BarkPost Express', 'Golden Retriever', 'Every package gets a tail wag', '98.5'],
        ['PAWZ', 'PawPrint Logistics', 'Border Collie', 'Herding your freight on time', '97.2'],
        ['WOOF', 'WoofWay Freight', 'Siberian Husky', 'Pulling heavy loads since forever', '96.8'],
        ['FETC', 'Fetch & Deliver Co', 'Labrador Retriever', 'We always bring it back', '99.1'],
        ['SNIF', 'SniffRoute Express', 'Bloodhound', 'We can find any address', '95.5'],
        ['HOWL', 'Howling Moon Transport', 'German Shepherd', 'Guarding your cargo 24/7', '97.8']
    ];

    function screen(logo) {
        const s = el('div', 'tm-screen');

        const header = el('div', 'tm-header');
        const brand = el('span', 'tm-brand');
        if (logo) {
            const img = el('img', 'tm-logo');
            img.src = logo;
            img.alt = '';
            brand.append(img);
        }
        brand.append(el('b', '', 'DBMN'));
        const env = el('span', 'tm-env', 'DBMN Puppy School');
        env.append(el('i', 'tm-caret'));
        const right = el('span', 'tm-header-right');
        const chip = el('span', 'tm-chip');
        chip.append(el('i', 'tm-dot'), document.createTextNode('Idle'));
        right.append(chip, el('i', 'tm-glyph'), el('i', 'tm-glyph'));
        header.append(brand, env, right);

        const rail = el('div', 'tm-rail');
        ['', '', ' is-active', '', ''].forEach(state => rail.append(el('i', 'tm-rail-item' + state)));
        rail.append(el('span', 'tm-rail-gap'), el('i', 'tm-rail-item'), el('i', 'tm-rail-item'));

        const tabs = el('div', 'tm-tabs');
        tabs.append(el('span', 'tm-tab', 'Training Ground'), el('span', 'tm-tab', 'Get Carriers'));
        const active = el('span', 'tm-tab is-active');
        active.append(el('i', 'tm-play'), document.createTextNode('Get Carriers'), el('span', 'tm-tab-count', '1/1'));
        tabs.append(active);

        const consoleView = el('div', 'tm-console');
        const title = el('div', 'tm-console-title');
        title.append(el('span', 'tm-console-name', 'DBMN Puppy School: Get Carriers'), el('span', 'tm-badge is-done', 'COMPLETED'));
        const views = el('div', 'tm-views');
        const view = (label, count, kind, current) => {
            const item = el('span', 'tm-view' + (current ? ' is-active' : ''), label);
            if (count) item.append(el('span', 'tm-count is-' + kind, count));
            return item;
        };
        views.append(view('Raw', '1', 'raw'), view('Completed', '1', 'done', true), view('Settings'));
        const toolbar = el('div', 'tm-toolbar');
        const preset = el('span', 'tm-control', 'DEFAULT');
        preset.append(el('i', 'tm-caret'));
        toolbar.append(preset, el('span', 'tm-control tm-search', 'Search rows'), el('span', 'tm-control', 'Copy'), el('span', 'tm-control', 'Export'), el('span', 'tm-control', 'Chain'));
        const table = el('div', 'tm-table');
        const head = el('div', 'tm-tr is-head');
        ['scac', 'name', 'breed', 'motto', 'reliabilityScore'].forEach(text => head.append(el('span', '', text)));
        table.append(head);
        for (const row of CARRIERS) {
            const tr = el('div', 'tm-tr');
            row.forEach(text => tr.append(el('span', '', text)));
            table.append(tr);
        }
        const status = el('div', 'tm-table-status');
        status.append(el('span', '', '6 rows \u2022 7 columns'), el('span', '', 'Loaded in 0ms'));
        consoleView.append(title, views, toolbar, table, status);

        const footer = el('div', 'tm-footer');
        const actions = el('div', 'tm-footer-actions');
        actions.append(el('span', 'tm-btn is-danger', 'Delete'), el('span', 'tm-btn', 'Re-run'), el('span', 'tm-btn is-secondary', 'Pagination'));
        const done = el('div', 'tm-footer-progress');
        const doneHead = el('div', 'tm-footer-head');
        doneHead.append(el('b', '', 'Execution Complete'), el('span', '', '1/1'));
        const bar = el('div', 'tm-progress');
        bar.append(el('i', 'tm-progress-fill'));
        done.append(doneHead, bar);
        footer.append(actions, done);

        const main = el('div', 'tm-main');
        main.append(tabs, consoleView, footer);
        const body = el('div', 'tm-body');
        body.append(rail, main);
        s.append(header, body);
        return s;
    }

    // ── The picker ───────────────────────────────────────────────────────

    function create(config) {
        const button = config.button;
        if (!button) return { update() { /* no button, no picker */ } };
        const icons = config.icons || {};
        let menu = null;
        let hint = null;
        /** The themes in order (Follow system, then Light, then Dark), and which is in the middle. */
        let slides = [];
        let index = 0;

        const dialog = el('dialog', 'theme-picker');
        dialog.setAttribute('aria-labelledby', 'themePickerName');
        dialog.setAttribute('aria-roledescription', 'theme picker');
        dialog.tabIndex = -1;

        const pixels = el('div', 'theme-picker-pixels');
        pixels.setAttribute('aria-hidden', 'true');
        for (let i = 0; i < PIXELS; i++) {
            const pixel = el('i', 'theme-picker-pixel');
            // Placed once, at random, round the edges more than the middle
            const edge = Math.random() < 0.5;
            pixel.style.setProperty('left', (edge ? (Math.random() < 0.5 ? Math.random() * 18 : 82 + Math.random() * 18) : Math.random() * 100).toFixed(1) + '%');
            pixel.style.setProperty('top', (Math.random() * 100).toFixed(1) + '%');
            pixel.style.setProperty('--px-size', (8 + Math.round(Math.random() * 3) * 6) + 'px');
            pixel.style.setProperty('--px-delay', (Math.random() * 6).toFixed(2) + 's');
            pixel.style.setProperty('--px-strength', (0.12 + Math.random() * 0.4).toFixed(2));
            pixels.append(pixel);
        }

        const close = el('button', 'theme-picker-close');
        close.type = 'button';
        close.setAttribute('aria-label', 'Close');
        close.title = 'Close';
        close.append(icon(icons.close, 'theme-picker-icon', '×'));

        const stage = el('div', 'theme-picker-stage');
        const track = el('div', 'theme-picker-track');
        const prev = el('button', 'theme-picker-step is-prev');
        prev.type = 'button';
        prev.setAttribute('aria-label', 'Previous theme');
        prev.title = 'Previous theme';
        prev.append(icon(icons.prev, 'theme-picker-icon', '‹'));
        const next = el('button', 'theme-picker-step is-next');
        next.type = 'button';
        next.setAttribute('aria-label', 'Next theme');
        next.title = 'Next theme';
        next.append(icon(icons.next, 'theme-picker-icon', '›'));
        stage.append(prev, track, next);

        const caption = el('div', 'theme-picker-caption');
        const name = el('h2', 'theme-picker-name');
        name.id = 'themePickerName';
        const kind = el('p', 'theme-picker-kind');
        kind.setAttribute('aria-live', 'polite');
        const use = el('button', 'theme-picker-use');
        use.type = 'button';
        caption.append(name, kind, use);

        dialog.append(pixels, close, stage, caption);
        document.body.append(dialog);

        function card(slide, at) {
            const node = el('button', 'theme-slide');
            node.type = 'button';
            node.dataset.themeId = slide.id;
            node.dataset.index = String(at);
            node.setAttribute('aria-label', slide.label);
            setColours(node, slide.preview);
            const frame = el('span', 'theme-slide-frame');
            frame.append(screen(config.logo));
            node.append(frame);
            if (slide.id === menu.current) node.append(el('span', 'theme-slide-badge', 'In use'));
            return node;
        }

        function build() {
            slides = [];
            for (const option of menu.options || []) slides.push({ id: option.id, label: option.label, kind: 'Light or dark, with your computer' });
            for (const group of menu.groups || []) {
                for (const option of group.options) slides.push({ id: option.id, label: option.label, kind: group.label + ' theme' });
            }
            for (const slide of slides) slide.preview = menu.previews ? menu.previews[slide.id] : undefined;
            track.replaceChildren(...slides.map(card));
        }

        /** Each card's place: the middle one flat and near, the others turned away and fading. */
        function place() {
            const cards = track.children;
            for (let i = 0; i < cards.length; i++) {
                const offset = i - index;
                const card = cards[i];
                card.dataset.offset = String(Math.max(-REACH - 1, Math.min(REACH + 1, offset)));
                card.tabIndex = offset === 0 ? -1 : (Math.abs(offset) <= REACH ? 0 : -1);
                card.setAttribute('aria-hidden', String(Math.abs(offset) > REACH));
            }
            const slide = slides[index];
            if (!slide) return;
            name.textContent = slide.label;
            kind.textContent = slide.kind;
            const inUse = slide.id === menu.current;
            use.textContent = inUse ? 'In use' : 'Use ' + slide.label;
            use.disabled = inUse;
            setColours(dialog, slide.preview);
            prev.disabled = index === 0;
            next.disabled = index === slides.length - 1;
        }

        function go(to) {
            index = Math.max(0, Math.min(slides.length - 1, to));
            place();
        }

        /** The mock screens are drawn at one size and scaled to the card's. */
        function scale() {
            const first = track.querySelector('.theme-slide-frame');
            if (first) dialog.style.setProperty('--tm-scale', String(first.clientWidth / SCREEN_WIDTH));
        }
        if (typeof ResizeObserver === 'function') new ResizeObserver(scale).observe(track);

        function endHint() {
            if (!hint) return;
            hint.remove();
            hint = null;
            if (config.onHintDone) config.onHintDone();
        }

        function showHint() {
            if (hint) return;
            hint = el('div', 'theme-hint');
            hint.setAttribute('role', 'status');
            const open = el('button', 'theme-hint-open');
            open.type = 'button';
            open.append(icon(icons.palette, 'theme-hint-icon'));
            const words = el('span', 'theme-hint-words');
            words.append(el('strong', 'theme-hint-title', 'Change the theme'), el('span', 'theme-hint-text', 'Tap here to pick how DBMN looks.'));
            open.append(words);
            const dismiss = el('button', 'theme-hint-close');
            dismiss.type = 'button';
            dismiss.setAttribute('aria-label', 'Close');
            dismiss.title = 'Close';
            dismiss.append(icon(icons.close, 'theme-picker-icon', '×'));
            open.addEventListener('click', () => { endHint(); openPicker(); });
            dismiss.addEventListener('click', endHint);
            hint.append(open, dismiss);
            button.insertAdjacentElement('afterend', hint);
        }

        function openPicker() {
            if (!menu) return;
            endHint();
            build();
            index = Math.max(0, slides.findIndex(slide => slide.id === menu.current));
            place();
            if (!dialog.open) dialog.showModal();
            scale();
            // Use when it can be pressed; else the stage itself, so Enter after the arrow keys
            // uses the theme they reach (on the close button it would close)
            if (use.disabled) dialog.focus();
            else use.focus();
        }

        // The arrow keys move along; Enter uses the theme in the middle (on the close button or an
        // arrow, Enter does what that button does)
        dialog.addEventListener('keydown', event => {
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                event.preventDefault();
                go(index + (event.key === 'ArrowLeft' ? -1 : 1));
            } else if (event.key === 'Enter' && event.target !== close && event.target !== prev && event.target !== next) {
                event.preventDefault();
                use.click();
            }
        });

        button.addEventListener('click', openPicker);
        close.addEventListener('click', () => dialog.close());
        prev.addEventListener('click', () => go(index - 1));
        next.addEventListener('click', () => go(index + 1));
        // A neighbour comes to the middle when clicked
        track.addEventListener('click', event => {
            const target = event.target instanceof Element ? event.target.closest('.theme-slide') : null;
            if (target) go(Number(target.dataset.index));
        });
        // A click on the dark round the stage closes, as on any dialog
        dialog.addEventListener('click', event => {
            if (event.target === dialog || event.target === pixels) dialog.close();
        });
        use.addEventListener('click', () => {
            const slide = slides[index];
            if (!slide || slide.id === menu.current) return;
            menu.current = slide.id;
            config.onPick(slide.id);
            dialog.close();
        });
        // A swipe across the stage moves one theme along
        let swipeFrom = null;
        stage.addEventListener('pointerdown', event => { swipeFrom = event.pointerType === 'mouse' ? null : event.clientX; });
        stage.addEventListener('pointerup', event => {
            if (swipeFrom === null) return;
            const dx = event.clientX - swipeFrom;
            swipeFrom = null;
            if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
        });

        return {
            /** The themes on offer (none: the picker stays hidden), and whether to show the hint. */
            update(nextMenu, state) {
                const offered = !!nextMenu && ((nextMenu.options || []).length + (nextMenu.groups || []).length) > 0;
                menu = offered ? nextMenu : null;
                button.hidden = !offered;
                if (!offered) {
                    if (dialog.open) dialog.close();
                    if (hint) { hint.remove(); hint = null; }
                    return;
                }
                if (dialog.open) {
                    // The computer's theme moved, say: keep the same theme in the middle
                    const id = slides[index] && slides[index].id;
                    build();
                    index = Math.max(0, slides.findIndex(slide => slide.id === id));
                    place();
                    scale();
                }
                if (state && state.hint && !dialog.open) showHint();
            }
        };
    }

    const api = { create };
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    if (root) root.ThemePicker = api;
})(typeof window !== 'undefined' ? window : undefined);
