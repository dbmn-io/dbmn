/**
 * DBMN Account Pages - Shared Supabase Client (GitHub Issue #208)
 *
 * Initializes Supabase client and provides helper functions
 * used across all account pages (register, login, questionnaire, dashboard).
 */

// Supabase configuration — set after project creation
const SUPABASE_URL = 'https://api.dbmn.io';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4cmZscXBraWhleXJxcGlrZmxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5ODg3MzgsImV4cCI6MjA4NzU2NDczOH0.-qC5CregIAJwZvR_NsR1Sa6h-DuPICOO3gt55fgbycU';

// VS Code extension URI for auth callback
const VSCODE_CALLBACK_URI = 'vscode://FlexionTech.active8/dbmn-auth-callback';

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
