import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import IconInput from '../../components/common/IconInput/IconInput';
import FormMessage from '../../components/common/FormMessage/FormMessage';
import styles from './Login.module.css';
import { auth } from '../../services/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup, 
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [resetEmail, setResetEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth) return;

    setIsLoading(true);
    setMessage({ type: 'info', text: isLogin ? 'Logging in...' : 'Creating account...' });

    try {
      let userCredential;

      if (isLogin) {
        // Email/password login
        userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      } else {
        // Email/password sign-up
        userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        // Set display name
        if (formData.name) {
          await updateProfile(userCredential.user, { displayName: formData.name });
        }
      }

      const user = userCredential.user;
      console.log(`${isLogin ? 'Logged in' : 'Signed up'} user:`, user);
      setMessage({ type: 'success', text: isLogin ? 'Login successful!' : 'Account created successfully!' });
      
    } catch (error) {
      console.error('Auth error:', error.code, error.message);

      let text = 'Authentication failed. Please try again.';
      if (error.code === 'auth/user-not-found') text = 'User not found.';
      if (error.code === 'auth/wrong-password') text = 'Incorrect password.';
      if (error.code === 'auth/invalid-email') text = 'Invalid email address.';
      if (error.code === 'auth/email-already-in-use') text = 'Email already in use.';
      if (error.code === 'auth/weak-password') text = 'Password should be at least 6 characters.';
      if (error.code === 'auth/invalid-credential') text = 'Invalid email or password.';

      setMessage({ type: 'error', text });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!auth || !resetEmail) return;

    setIsLoading(true);
    setMessage({ type: 'info', text: 'Sending password reset email...' });

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setMessage({ 
        type: 'success', 
        text: 'Password reset email sent! Check your inbox.' 
      });
      
      // Auto switch back to login after 3 seconds
      setTimeout(() => {
        setIsForgotPassword(false);
        setResetEmail('');
        setMessage(null);
      }, 3000);

    } catch (error) {
      console.error('Password reset error:', error.code, error.message);

      let text = 'Failed to send reset email. Please try again.';
      if (error.code === 'auth/user-not-found') text = 'No account found with this email.';
      if (error.code === 'auth/invalid-email') text = 'Invalid email address.';
      if (error.code === 'auth/too-many-requests') text = 'Too many requests. Please try again later.';

      setMessage({ type: 'error', text });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!auth) return;
    setIsLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log('Google signed in user:', user);
      setMessage({ type: 'success', text: 'Google login successful!' });

    } catch (error) {
      console.error('Google Sign-In failed:', error.code, error.message);
      setMessage({ type: 'error', text: 'Google Sign-In failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setIsForgotPassword(false);
    setResetEmail('');
    setMessage(null);
  };

  // Forgot Password View
  if (isForgotPassword) {
    return (
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.card}>
            <button onClick={handleBackToLogin} className={styles.backButton}>
              <ArrowLeft size={20} />
              Back to Login
            </button>

            <div className={styles.logoSection}>
              <h1 className={styles.logo}>FarmSync</h1>
            </div>

            <h2 className={styles.title}>Reset Password</h2>
            <p className={styles.subtitle}>
              Enter your email address and we'll send you a link to reset your password.
            </p>

            <FormMessage message={message} />

            <form onSubmit={handleForgotPassword} className={styles.form}>
              <IconInput
                icon={Mail}
                type="email"
                placeholder="Enter your email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
                disabled={isLoading}
              />

              <button type="submit" className={styles.submitButton} disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Login/Signup View
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.card}>
          <div className={styles.logoSection}>
            <h1 className={styles.logo}>FarmSync</h1>
          </div>

          <h2 className={styles.title}>
            {isLogin ? 'Welcome Back!' : 'Create an Account'}
          </h2>
          <p className={styles.subtitle}>
            {isLogin ? 'Login to continue to your dashboard.' : 'Sign up to manage your farm activities.'}
          </p>

          <FormMessage message={message} />

          <form onSubmit={handleSubmit} className={styles.form}>
            {!isLogin && (
              <IconInput
                icon={User}
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                disabled={isLoading}
              />
            )}

            <IconInput
              icon={Mail}
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              disabled={isLoading}
            />

            <div>
              <IconInput
                icon={Lock}
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                disabled={isLoading}
                endIcon={showPassword ? EyeOff : Eye}
                onEndIconClick={() => setShowPassword(!showPassword)}
              />
              {isLogin && (
                <div className={styles.forgotPassword}>
                  <button 
                    type="button" 
                    onClick={() => setIsForgotPassword(true)}
                    disabled={isLoading}
                  >
                    Forgot Password?
                  </button>
                </div>
              )}
            </div>

            <button type="submit" className={styles.submitButton} disabled={isLoading}>
              {isLoading ? 'Loading...' : (isLogin ? 'Login' : 'Sign Up')}
            </button>
          </form>

          <div className={styles.divider}>
            <div className={styles.dividerLine}></div>
            <span className={styles.dividerText}>OR</span>
            <div className={styles.dividerLine}></div>
          </div>

          <button onClick={handleGoogleSignIn} className={styles.googleButton} disabled={isLoading}>
            <svg className={styles.googleIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path>
              <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path>
              <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"></path>
              <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C39.712 34.61 44 29.613 44 24c0-1.341-.138-2.65-.389-3.917z"></path>
            </svg>
            Sign in with Google
          </button>

          <div className={styles.switchMode}>
            <span>{isLogin ? "Don't have an account?" : "Already have an account?"} </span>
            <button 
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setMessage(null);
              }} 
              disabled={isLoading}
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;