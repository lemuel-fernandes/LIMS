// ===========================================
// PAGE PROTECTION SYSTEM
// Add this script to EVERY protected page
// ===========================================

// Immediately hide page content to prevent flash of unauthorized content
document.addEventListener('DOMContentLoaded', function() {
    // Hide body content immediately
    document.body.style.display = 'none';

    // Show loading indicator
    showLoadingScreen();

    // Perform authentication check
    performAuthenticationCheck();
});
// Define page access requirements
const pageAccess = {
  'lab-incharge-dashboard.html': ['lab-incharge'],
  'lab-instructor-dashboard.html': ['lab-instructor'],
  'manage-samples.html': ['lab-incharge'],
  'staff-management.html': ['lab-incharge'],
  'analytics.html': ['lab-incharge'],
  'system-settings.html': ['lab-incharge'],
  // Add more pages and their required roles here
};

// Show loading screen while checking authentication
function showLoadingScreen() {
    const loadingHTML = `
        <div id="authLoadingScreen" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: #f5f5f5;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        ">
            <div style="text-align: center;">
                <div style="
                    width: 50px;
                    height: 50px;
                    border: 4px solid #e5e7eb;
                    border-top: 4px solid #3b82f6;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 20px;
                "></div>
                <p style="color: #374151; font-size: 18px; margin: 0;">
                    Verifying authentication...
                </p>
            </div>
        </div>
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;

    document.body.insertAdjacentHTML('beforeend', loadingHTML);
}

// Remove loading screen
function removeLoadingScreen() {
    const loadingScreen = document.getElementById('authLoadingScreen');
    if (loadingScreen) {
        loadingScreen.remove();
    }
}

// Main authentication check function
async function performAuthenticationCheck() {
    try {
        // Get current page filename
        const currentPage = window.location.pathname.split('/').pop();

        // Define page access requirements
        const pageAccess = {
            'lab-incharge-dashboard.html': ['lab-incharge'],
            'lab-instructor-dashboard.html': ['lab-instructor'],
            'admin-panel.html': ['lab-incharge'], // Only lab-incharge can access admin
            // Add more pages and their required roles here
        };

        // Check if current page requires authentication
        const requiredRoles = pageAccess[currentPage];
        if (!requiredRoles) {
            // Page doesn't require special authentication, show content
            showPageContent();
            return;
        }

        // Perform authentication check
        const authResult = await checkUserAuthentication();

        if (!authResult.authenticated) {
            // User is not authenticated
            redirectToLogin('You must be logged in to access this page.');
            return;
        }

        // Check if user has required role
        if (!requiredRoles.includes(authResult.user.role)) {
            // User doesn't have required role
            redirectToLogin(`Access denied. This page requires ${requiredRoles.join(' or ')} role.`);
            return;
        }

        // User is authenticated and has correct role
        console.log(`Access granted to ${currentPage} for user:`, authResult.user);
        showPageContent();

        // Set up session monitoring
        startSessionMonitoring();

    } catch (error) {
        console.error('Authentication check failed:', error);
        redirectToLogin('Authentication error. Please try logging in again.');
    }
}

// Check user authentication (works with both Firebase and offline)
function checkUserAuthentication() {
    return new Promise((resolve) => {
        // First check offline session
        const offlineSession = checkOfflineSession();
        if (offlineSession) {
            resolve({
                authenticated: true,
                user: offlineSession.user,
                mode: 'offline',
                session: offlineSession
            });
            return;
        }

        // Check Firebase authentication
        if (typeof firebase !== 'undefined' && firebase.auth) {
            const unsubscribe = firebase.auth().onAuthStateChanged(user => {
                unsubscribe(); // Unsubscribe immediately

                if (user) {
                    // Get role from URL parameters or local storage
                    const role = getUserRole();
                    resolve({
                        authenticated: true,
                        user: {
                            email: user.email,
                            uid: user.uid,
                            name: user.displayName || 'Firebase User',
                            role: role
                        },
                        mode: 'online'
                    });
                } else {
                    resolve({
                        authenticated: false,
                        user: null,
                        mode: null
                    });
                }
            });
        } else {
            // Firebase not available, user not authenticated
            resolve({
                authenticated: false,
                user: null,
                mode: null
            });
        }
    });
}

// Check offline session validity
function checkOfflineSession() {
    try {
        const SESSION_KEY = 'lims_session';
        const session = localStorage.getItem(SESSION_KEY);
        if (!session) return null;

        const sessionData = JSON.parse(session);
        const now = Date.now();

        if (now > sessionData.expiryTime) {
            // Session expired, clear it
            localStorage.removeItem(SESSION_KEY);
            return null;
        }

        return sessionData;
    } catch (error) {
        console.error('Error checking offline session:', error);
        return null;
    }
}

// Get user role (you might need to modify this based on how you store roles)
function getUserRole() {
    // Try to get role from URL parameters first
    const urlParams = new URLSearchParams(window.location.search);
    const roleFromUrl = urlParams.get('role');
    if (roleFromUrl) return roleFromUrl;

    // Try to get role from local storage
    const roleFromStorage = localStorage.getItem('lims_user_role');
    if (roleFromStorage) return roleFromStorage;

    // Try to determine role from current page
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage.includes('lab-incharge')) return 'lab-incharge';
    if (currentPage.includes('lab-instructor')) return 'lab-instructor';

    return null;
}

// Show page content after successful authentication
function showPageContent() {
    removeLoadingScreen();
    document.body.style.display = 'block';

    // Add authentication status indicator
    addAuthStatusIndicator();
}

// Redirect to login page with error message
function redirectToLogin(message = 'Please log in to continue.') {
    // Store error message for login page
    sessionStorage.setItem('lims_auth_error', message);

    // Clear any existing sessions
    localStorage.removeItem('lims_session');
    localStorage.removeItem('lims_user_role');

    // Redirect to login
    window.location.href = 'login.html';
}

// Add authentication status indicator to page
function addAuthStatusIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'authStatusIndicator';
    indicator.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: #10b981;
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        z-index: 1000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    indicator.innerHTML = '🔒 Authenticated';
    document.body.appendChild(indicator);

    // Add logout button
    const logoutBtn = document.createElement('button');
    logoutBtn.innerHTML = 'Logout';
    logoutBtn.style.cssText = `
        position: fixed;
        top: 10px;
        right: 130px;
        background: #ef4444;
        color: white;
        border: none;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        cursor: pointer;
        z-index: 1000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    logoutBtn.onclick = performLogout;
    document.body.appendChild(logoutBtn);
}

// Start session monitoring (check every 30 seconds)
function startSessionMonitoring() {
    setInterval(async () => {
        const authResult = await checkUserAuthentication();
        if (!authResult.authenticated) {
            redirectToLogin('Your session has expired. Please log in again.');
        }
    }, 30000); // Check every 30 seconds
}

// Perform logout
function performLogout() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear Firebase session
        if (typeof firebase !== 'undefined' && firebase.auth) {
            firebase.auth().signOut().catch(console.error);
        }

        // Clear offline session
        localStorage.removeItem('lims_session');
        localStorage.removeItem('lims_user_role');

        // Redirect to login
        window.location.href = 'login.html';
    }
}

// Prevent back button after logout
window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        // Page was loaded from cache (back button), re-check authentication
        performAuthenticationCheck();
    }
});

// Prevent browser back button bypass
window.addEventListener('popstate', function(event) {
    performAuthenticationCheck();
});

console.log('Page Protection System Loaded - Checking authentication...');
