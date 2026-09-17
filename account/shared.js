/**
 * DBMN Account Pages - Shared Supabase Client (GitHub Issue #208)
 *
 * Initializes Supabase client and provides helper functions
 * used across all account pages (register, login, questionnaire, dashboard).
 */

// Which backend this page talks to.
//
// Served from 127.0.0.1 / localhost (`npm run dev:local` in vs-dbmn, which runs Jekyll on
// :4000) the pages use the LOCAL Supabase stack, and a fixed "LOCAL" ribbon says so on every
// page. On any other hostname — dbmn.io — nothing changes. The hostname decides, so a
// deployed page can never be pointed anywhere else by a query string or stored flag.
//
// The local anon key is the published Supabase demo constant: identical on every
// `supabase start`, useless anywhere else. It is not a secret.
var DBMN_IS_LOCAL = ['127.0.0.1', 'localhost'].indexOf(window.location.hostname) !== -1;

const SUPABASE_URL = DBMN_IS_LOCAL ? 'http://127.0.0.1:54321' : 'https://api.dbmn.io';
const SUPABASE_ANON_KEY = DBMN_IS_LOCAL
    ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
    : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4cmZscXBraWhleXJxcGlrZmxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5ODg3MzgsImV4cCI6MjA4NzU2NDczOH0.-qC5CregIAJwZvR_NsR1Sa6h-DuPICOO3gt55fgbycU';

if (DBMN_IS_LOCAL) {
    document.addEventListener('DOMContentLoaded', function() {
        var ribbon = document.createElement('div');
        ribbon.className = 'dbmn-local-ribbon';
        ribbon.textContent = 'LOCAL';
        ribbon.title = 'Local Supabase stack: ' + SUPABASE_URL;
        document.body.appendChild(ribbon);
    });
}

// VS Code extension URI for auth callback
const VSCODE_CALLBACK_URI = 'vscode://dbmn.dobermann/dbmn-auth-callback';

// Edge function base URL
const FUNCTIONS_URL = SUPABASE_URL + '/functions/v1';

// Initialize Supabase client (loaded from CDN in each page)
// Note: CDN exposes global `supabase` — we use `dbmnSupabase` to avoid collision
var dbmnSupabase;

function initSupabase() {
    if (typeof window.supabase !== 'undefined' && typeof window.supabase.createClient === 'function') {
        dbmnSupabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } else {
        console.error('Supabase JS SDK not loaded');
    }
    return dbmnSupabase;
}

/**
 * Show an alert message in the page.
 * @param {string} id - Alert element ID
 * @param {string} message - Message to display
 * @param {'error'|'success'|'info'} type - Alert type
 */
function showAlert(id, message, type) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = message;
    el.className = 'alert alert-' + type;
    el.style.display = 'block';
}

/**
 * Hide an alert message.
 * @param {string} id - Alert element ID
 */
function hideAlert(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
}

/**
 * Set button loading state.
 * @param {string} id - Button element ID
 * @param {boolean} loading - Whether to show loading state
 * @param {string} [loadingText] - Text to show while loading
 */
function setButtonLoading(id, loading, loadingText) {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.disabled = loading;
    if (loading) {
        btn._originalText = btn.textContent;
        btn.innerHTML = '<span class="spinner"></span>' + (loadingText || 'Loading...');
    } else if (btn._originalText) {
        btn.textContent = btn._originalText;
    }
}

/**
 * Get current user session. Returns null if not logged in.
 */
async function getCurrentSession() {
    if (!dbmnSupabase) return null;
    const { data: { session } } = await dbmnSupabase.auth.getSession();
    return session;
}

/**
 * Get current user. Returns null if not logged in.
 */
async function getCurrentUser() {
    if (!dbmnSupabase) return null;
    const { data: { user } } = await dbmnSupabase.auth.getUser();
    return user;
}

/**
 * Redirect to VS Code with auth tokens (used after login when ?redirect=vscode).
 * @param {object} session - Supabase session object
 */
function redirectToVSCode(session) {
    const params = new URLSearchParams({
        access_token: session.access_token,
        refresh_token: session.refresh_token
    });
    window.location.href = VSCODE_CALLBACK_URI + '?' + params.toString();
}

/**
 * Check if this page was opened from VS Code (has ?redirect=vscode param).
 */
function isVSCodeRedirect() {
    const params = new URLSearchParams(window.location.search);
    return params.get('redirect') === 'vscode';
}

/**
 * Call a Supabase Edge Function with authentication.
 * @param {string} functionName - Name of the Edge Function
 * @param {object} [body] - Request body (for POST)
 * @param {string} [method] - HTTP method (default: POST)
 */
async function callEdgeFunction(functionName, body, method) {
    const session = await getCurrentSession();
    if (!session) throw new Error('Not authenticated');

    const options = {
        method: method || (body ? 'POST' : 'GET'),
        headers: {
            'Authorization': 'Bearer ' + session.access_token,
            'apikey': SUPABASE_ANON_KEY,
            'Content-Type': 'application/json'
        }
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(FUNCTIONS_URL + '/' + functionName, options);
    if (!response.ok) {
        const error = await response.json().catch(function() { return {}; });
        throw new Error(error.error || 'Edge function failed: ' + response.status);
    }
    return response.json();
}

/**
 * A `return` target is only ever a path on THIS site. Anything else — another origin,
 * `//host`, `/\\host`, a scheme — falls back to the account page. (login.html used to
 * follow whatever it was given: an open redirect.)
 * @param {string|null} value
 * @returns {string}
 */
function safeReturnPath(value) {
    var fallback = '/account/index.html';
    if (typeof value !== 'string' || value.length === 0 || value.length > 300) return fallback;
    if (value.charAt(0) !== '/' || value.charAt(1) === '/' || value.charAt(1) === '\\') return fallback;
    if (/[\x00-\x1f]/.test(value)) return fallback;
    try {
        var resolved = new URL(value, window.location.origin);
        if (resolved.origin !== window.location.origin) return fallback;
        return resolved.pathname + resolved.search + resolved.hash;
    } catch (e) {
        return fallback;
    }
}

var DBMN_RETURN_KEY = 'dbmn_return_path';
var DBMN_RETURN_MAX_AGE_MS = 30 * 60 * 1000;

/**
 * Where to go after sign-in: ?return= on this page, else the path remembered when a magic
 * link was requested (see rememberReturnPath), else the account page. Always a same-site path.
 */
function getReturnPath() {
    var fromQuery = new URLSearchParams(window.location.search).get('return');
    if (fromQuery) return safeReturnPath(fromQuery);
    try {
        var stored = JSON.parse(window.localStorage.getItem(DBMN_RETURN_KEY) || 'null');
        window.localStorage.removeItem(DBMN_RETURN_KEY);
        if (stored && Date.now() - stored.at < DBMN_RETURN_MAX_AGE_MS) return safeReturnPath(stored.path);
    } catch (e) { /* storage unavailable: fall through */ }
    return safeReturnPath(null);
}

/**
 * A magic link comes back through auth-callback.html, which used to forget where the
 * learner was going (they always landed on the account page). The path is remembered in
 * THIS browser rather than put in the emailed URL, so the link keeps exactly the redirect
 * URL the auth server already allows. Opened on another device, it lands on the account
 * page as before.
 */
function rememberReturnPath() {
    var back = new URLSearchParams(window.location.search).get('return');
    try {
        if (back && safeReturnPath(back) === back) {
            window.localStorage.setItem(DBMN_RETURN_KEY, JSON.stringify({ path: back, at: Date.now() }));
        } else {
            window.localStorage.removeItem(DBMN_RETURN_KEY);
        }
    } catch (e) { /* storage unavailable: they land on the account page */ }
}

/**
 * Where a magic link lands: this site's own callback page, so it works on dbmn.io and on a
 * local stack alike. Same shape as it has always been (optionally ?redirect=vscode).
 */
function buildAuthCallbackUrl() {
    rememberReturnPath();
    var base = window.location.origin + '/account/auth-callback.html';
    return isVSCodeRedirect() ? (base + '?redirect=vscode') : base;
}

/**
 * The extension opens the site with the learner's email in the URL FRAGMENT (#email=…): a
 * fragment is never sent to a server, so it reaches no log. Read it, strip it from the
 * address bar at once, and hand it back. A ?email= query value is accepted too (links
 * between our own pages).
 * @returns {string} the email, or ''
 */
function takeEmailHint() {
    var email = '';
    var hash = window.location.hash.replace(/^#/, '');
    if (hash.indexOf('email=') !== -1) {
        email = new URLSearchParams(hash).get('email') || '';
        history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    if (!email) email = new URLSearchParams(window.location.search).get('email') || '';
    email = email.trim();
    return /^[^\s@<>"']+@[^\s@<>"']+$/.test(email) && email.length <= 254 ? email : '';
}
