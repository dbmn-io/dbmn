/*
 * dbmn.io's theme: the app's themes (assets/js/dbmn-themes.js, exported from the app), worn on
 * the page before it paints, and the theme picker on the palette button.
 *
 * The pick is shared with the web app (app.dbmn.io) through the `dbmn_theme` cookie on
 * `.dbmn.io`: { theme, light, dark }. `theme` is a theme's id or "system" (Follow system, which
 * wears `light` or `dark` with the computer's setting). Nothing picked yet: Retro 82.
 *
 * Load it in <head>, after dbmn-themes.js and before anything paints, with theme-picker.js
 * deferred. A page puts the button where it wants it:
 *
 *   <span class="theme-picker-anchor"><button type="button" class="site-theme-btn" data-site-theme hidden></button></span>
 */
(function () {
    'use strict';

    var THEMES = window.DBMN_THEMES;
    if (!THEMES) return;
    var COOKIE = 'dbmn_theme';
    var HINT_KEY = 'dbmn.theme.hintDone';
    var systemDark = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
    var applied = [];
    var picker = null;

    function known(id) {
        return !!(id && THEMES.previews[id]);
    }

    /** The pick as last left here or in the app; null when nothing was ever picked. */
    function readPick() {
        try {
            var parts = document.cookie ? document.cookie.split('; ') : [];
            for (var i = 0; i < parts.length; i++) {
                if (parts[i].indexOf(COOKIE + '=') !== 0) continue;
                var value = JSON.parse(decodeURIComponent(parts[i].slice(COOKIE.length + 1)));
                return value && typeof value === 'object' ? value : null;
            }
        } catch (e) { /* a broken cookie is no pick */ }
        return null;
    }

    function writePick(pick) {
        try {
            var host = location.hostname;
            var domain = host === 'dbmn.io' || /\.dbmn\.io$/.test(host) ? '; Domain=.dbmn.io' : '';
            var secure = location.protocol === 'https:' ? '; Secure' : '';
            document.cookie = COOKIE + '=' + encodeURIComponent(JSON.stringify(pick)) + '; Path=/; Max-Age=' + (400 * 86400) + '; SameSite=Lax' + domain + secure;
        } catch (e) { /* cookies refused: this page still wears it */ }
    }

    /** What is picked, with anything unknown put right: Follow system's light and dark always set. */
    function current() {
        var pick = readPick() || {};
        var theme = pick.theme === THEMES.system.id || known(pick.theme) ? pick.theme : THEMES.defaultTheme;
        return {
            theme: theme,
            light: known(pick.light) ? pick.light : THEMES.system.light,
            dark: known(pick.dark) ? pick.dark : THEMES.system.dark,
            picked: !!readPick()
        };
    }

    /** The theme a pick comes to now. */
    function worn(pick) {
        if (pick.theme !== THEMES.system.id) return pick.theme;
        return systemDark && !systemDark.matches ? pick.light : pick.dark;
    }

    function paint() {
        var id = worn(current());
        var root = document.documentElement;
        for (var i = 0; i < applied.length; i++) root.style.removeProperty(applied[i]);
        applied = [];
        var tokens = THEMES.site[id] || {};
        for (var name in tokens) {
            if (Object.prototype.hasOwnProperty.call(tokens, name)) {
                root.style.setProperty(name, tokens[name]);
                applied.push(name);
            }
        }
        var preview = THEMES.previews[id];
        root.setAttribute('data-theme-mode', preview ? preview.mode : 'dark');
        root.style.colorScheme = preview ? preview.mode : 'dark';
        offer();
    }

    function hintDone() {
        try { return !!localStorage.getItem(HINT_KEY); } catch (e) { return true; }
    }
    function endHint() {
        try { localStorage.setItem(HINT_KEY, '1'); } catch (e) { /* storage refused */ }
    }

    /** The menu, as the app's theme-choice.ts makes it. */
    function menu() {
        var pick = current();
        var previews = {};
        for (var id in THEMES.previews) {
            if (Object.prototype.hasOwnProperty.call(THEMES.previews, id)) previews[id] = THEMES.previews[id];
        }
        previews[THEMES.system.id] = THEMES.previews[worn({ theme: THEMES.system.id, light: pick.light, dark: pick.dark })];
        return {
            options: [{ id: THEMES.system.id, label: THEMES.system.label }],
            groups: THEMES.groups,
            current: pick.theme,
            previews: previews
        };
    }

    function offer() {
        if (picker) picker.update(menu(), { hint: !hintDone() && !current().picked });
    }

    function pickTheme(id) {
        var pick = current();
        writePick({ theme: id, light: pick.light, dark: pick.dark });
        endHint();
        paint();
    }

    function start() {
        var button = document.querySelector('[data-site-theme]');
        if (!button || !window.ThemePicker) return;
        if (THEMES.icons.palette) button.innerHTML = THEMES.icons.palette;
        button.setAttribute('aria-label', 'Change the theme');
        button.title = 'Change the theme';
        picker = window.ThemePicker.create({
            button: button,
            onPick: pickTheme,
            onHintDone: endHint,
            icons: THEMES.icons,
            logo: '/images/dbmn-mark.svg'
        });
        offer();
    }

    paint();
    if (systemDark && systemDark.addEventListener) systemDark.addEventListener('change', paint);
    // Back from the app, perhaps with another theme picked there
    document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'visible') paint();
    });
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
    else start();
})();
