// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBURPq6gDE-Z_g8Q3AhSlg2Gb1_Q-FunpM",
  authDomain: "lims-7ac2a.firebaseapp.com",
  projectId: "lims-7ac2a",
  storageBucket: "lims-7ac2a.firebasestorage.app",
  messagingSenderId: "280826090936",
  appId: "1:280826090936:web:91dc39a22e0f9ddefeab4d",
  measurementId: "G-HG5R1TQZEN"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// DOM elements
const loginForm = document.getElementById('loginForm');
const loginButton = document.getElementById('loginButton');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');

// Autofill email, password, and role for testing
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('email').value = '';
  document.getElementById('password').value = '';
  document.getElementById('role').value = '';
});

// Show error message
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove('hidden');
  successMessage.classList.add('hidden');
}

// Show success message
function showSuccess(message) {
  successMessage.textContent = message;
  successMessage.classList.remove('hidden');
  errorMessage.classList.add('hidden');
}

// Hide messages
function hideMessages() {
  errorMessage.classList.add('hidden');
  successMessage.classList.add('hidden');
}

// Check if user is already logged in
auth.onAuthStateChanged(user => {
  if (user) {
    // User is signed in, redirect based on role
    redirectBasedOnRole();
  }
});

// Redirect based on role selection
function redirectBasedOnRole() {
  const selectedRole = document.getElementById('role').value;
  
  if (selectedRole === 'lab-incharge') {
    window.location.href = 'lab-incharge-dashboard.html';
  } else if (selectedRole === 'lab-instructor') {
    window.location.href = 'lab-instructor-dashboard.html';
  }
}

// Login form submission
loginForm.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const selectedRole = document.getElementById('role').value;

  if (!email || !password || !selectedRole) {
    showError('Please fill in all fields');
    return;
  }

  // Disable login button and show loading state
  loginButton.disabled = true;
  loginButton.textContent = 'Logging in...';
  hideMessages();

  try {
    // Sign in with Firebase
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    const user = userCredential.user;

    console.log("Logged in user UID:", user.uid);
    
    showSuccess('Login successful! Redirecting...');

    // Redirect based on role after a short delay
    setTimeout(() => {
      redirectBasedOnRole();
    }, 1000);

  } catch (error) {
    console.error('Login error:', error);
    
    // Handle specific Firebase auth errors
    let errorMsg = 'Login failed. Please try again.';
    
    switch (error.code) {
      case 'auth/user-not-found':
        errorMsg = 'No account found with this email address.';
        break;
      case 'auth/wrong-password':
        errorMsg = 'Incorrect password.';
        break;
      case 'auth/invalid-email':
        errorMsg = 'Invalid email address.';
        break;
      case 'auth/invalid-login-credentials':
        errorMsg = 'Invalid email or password. Please check your credentials.';
        break;
      case 'auth/too-many-requests':
        errorMsg = 'Too many failed login attempts. Please try again later.';
        break;
      case 'auth/network-request-failed':
        errorMsg = 'Network error. Please check your connection and try again.';
        break;
      default:
        errorMsg = error.message || 'Login failed. Please try again.';
    }
    
    showError(errorMsg);
  } finally {
    // Re-enable login button
    loginButton.disabled = false;
    loginButton.textContent = 'Login';
  }
});