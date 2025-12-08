import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import demoVideo from "../../assets/intro.mp4";
import heroImage from "../../assets/file.svg";
import styles from './Landing.module.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const showModal = (message) => {
    setModalMessage(message);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleCollapsible = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  useEffect(() => {
    const handleSmoothScroll = (e) => {
      const target = e.target.closest('a[href^="#"]');
      if (!target) return;
      
      const href = target.getAttribute('href');
      if (href === '#') return;

      const targetElement = document.querySelector(href);
      if (targetElement) {
        e.preventDefault();
        
        const collapsibleItem = targetElement.closest(`.${styles.collapsibleItem}`);
        if (collapsibleItem) {
          const sectionId = targetElement.id;
          setExpandedSections(prev => ({ ...prev, [sectionId]: true }));
        }

        targetElement.scrollIntoView({ behavior: 'smooth' });
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleSmoothScroll);
    return () => document.removeEventListener('click', handleSmoothScroll);
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [mobileMenuOpen]);

  return (
    <div id="home">
      <a href="#main" className={styles.skipLink}>Skip to main content</a>
      
      <header className={styles.heroSection} role="banner">
        <nav>
          <div className={styles.logo} role="banner">
            <a href="#home">FarmSync</a>
          </div>
          <button 
            className={styles.navToggle}
            aria-label="Toggle menu" 
            aria-expanded={mobileMenuOpen}
            aria-controls="nav-menu"
            onClick={toggleMobileMenu}
          >
            <span className={styles.hamburger}></span>
          </button>
          <div 
            className={`${styles.navLinks} ${mobileMenuOpen ? styles.mobileOpen : ''}`}
            id="nav-menu" 
            role="navigation" 
            aria-label="Main menu"
          >
            <a href="#home">Home</a>
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#pricing">Pricing</a>
            <a href="#contact">Contact Us</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/login'); }} className={styles.signUpBtn}>Get Started</a>
          </div>
        </nav>

        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1>Optimize Your Poultry Farm Operations with FarmSync Poultry Management System</h1>
            <p>Streamline your poultry farm activities, improve efficiency, and ensure the health of your flock with our comprehensive management platform.</p>
            <div className={styles.heroButtons}>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/login'); }} className={`${styles.btn} ${styles.btnPrimary}`}>Get Started</a>
              <a href={demoVideo} className={`${styles.btn} ${styles.btnSecondary}`}>Watch Demo</a>
            </div>
          </div>
          <div className={styles.heroImage}>
            <img src={heroImage} alt="Illustration of poultry farm management" onError={(e) => e.target.style.display='none'} />
          </div>
        </div>
      </header>

      <main id="main">
        <section className={styles.featuresSection} id="features" role="region" aria-labelledby="features-title">
          <div className={`${styles.featuresHeader} ${styles.sectionHeader}`}>
            <h2 id="features-title">Features</h2>
            <p>A comprehensive suite of features designed to meet the specific needs of your poultry farm</p>
          </div>

          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={`${styles.featureIcon} ${styles.iconBlue}`}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
              </div>
              <div className={styles.featureContent}>
                <h3>Advanced Health Monitoring</h3>
                <p>Monitor and manage the wellbeing of flock</p>
              </div>
            </div>

            <div className={styles.featureCard}>
              <div className={`${styles.featureIcon} ${styles.iconYellow}`}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
              </div>
              <div className={styles.featureContent}>
                <h3>Disease Risk</h3>
                <p>Identify and mitigate threats to flock health</p>
              </div>
            </div>

            <div className={styles.featureCard}>
              <div className={`${styles.featureIcon} ${styles.iconCyan}`}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"/>
                </svg>
              </div>
              <div className={styles.featureContent}>
                <h3>Feed Management</h3>
                <p>Track resources and optimize fee nutrition</p>
              </div>
            </div>

            <div className={styles.featureCard}>
              <div className={`${styles.featureIcon} ${styles.iconOrange}`}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
              <div className={styles.featureContent}>
                <h3>Sales and Finance Analysts</h3>
                <p>Increase profitability with actionable</p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.howItWorksSection} id="how-it-works" role="region" aria-labelledby="how-it-works-title">
          <div className={styles.sectionHeader}>
            <h2 id="how-it-works-title">How It Works</h2>
            <p>Get started in just three simple steps and transform your farm management today.</p>
          </div>
          <div className={styles.howItWorksGrid}>
            <div className={styles.howItWorksStep}>
              <div className={styles.stepNumber}>1</div>
              <h3>Set Up Your Farm</h3>
              <p>Easily create digital profiles for your poultry houses, flocks, and feed bins.</p>
            </div>
            <div className={styles.howItWorksStep}>
              <div className={styles.stepNumber}>2</div>
              <h3>Monitor Real-Time Data</h3>
              <p>Track daily feed consumption, water usage, mortality, and health records.</p>
            </div>
            <div className={styles.howItWorksStep}>
              <div className={styles.stepNumber}>3</div>
              <h3>Get Actionable Insights</h3>
              <p>Use our dashboard to analyze performance, predict costs, and boost profitability.</p>
            </div>
          </div>
        </section>

        <section className={styles.pricingSection} id="pricing" role="region" aria-labelledby="pricing-title">
          <div className={styles.pricingHeader}>
            <h2 id="pricing-title">Pricing</h2>
            <p>Choose a plan that fits your farm. No hidden fees — upgrade or cancel anytime.</p>
          </div>

          <div className={styles.pricingGrid}>
            <div className={styles.planCard}>
              <div className={styles.planHeader}>
                <h3>Basic</h3>
                <div className={styles.planPrice}>Free</div>
              </div>
              <ul className={styles.planFeatures}>
                <li>
                  <svg className={styles.featureCheck} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span>Up to 2 sites</span>
                </li>
                <li>
                  <svg className={styles.featureCheck} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span>Basic monitoring</span>
                </li>
                <li>
                  <svg className={styles.featureCheck} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span>Email support</span>
                </li>
              </ul>
              <div className={styles.planActions}>
                <a href="#" onClick={(e) => { e.preventDefault(); navigate('/login'); }} className={`${styles.btn} ${styles.btnOutlineGreen} ${styles.planCta}`}>Start Free</a>
              </div>
            </div>

            <div className={`${styles.planCard} ${styles.planPopular}`} aria-describedby="popular-desc">
              <div className={styles.planHeader}>
                <h3>Pro</h3>
                <div className={styles.planPrice}>₦4,990<span className={styles.per}>/mo</span></div>
              </div>
              <div id="popular-desc" className={styles.srOnly}>Most popular</div>
              <ul className={styles.planFeatures}>
                <li>
                  <svg className={styles.featureCheck} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span>Up to 10 sites</span>
                </li>
                <li>
                  <svg className={styles.featureCheck} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span>Advanced analytics</span>
                </li>
                <li>
                  <svg className={styles.featureCheck} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span>Priority support</span>
                </li>
              </ul>
              <div className={styles.planActions}>
                <a href="#" onClick={(e) => { e.preventDefault(); navigate('/login'); }} className={`${styles.btn} ${styles.btnPrimary} ${styles.planCta}`}>Get Pro</a>
              </div>
            </div>

            <div className={styles.planCard}>
              <div className={styles.planHeader}>
                <h3>Enterprise</h3>
                <div className={styles.planPrice}>Contact</div>
              </div>
              <ul className={styles.planFeatures}>
                <li>
                  <svg className={styles.featureCheck} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span>Unlimited sites</span>
                </li>
                <li>
                  <svg className={styles.featureCheck} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span>Custom integrations</span>
                </li>
                <li>
                  <svg className={styles.featureCheck} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span>Dedicated success manager</span>
                </li>
              </ul>
              <div className={styles.planActions}>
                <a href="#info" className={`${styles.btn} ${styles.btnOutlineGreen} ${styles.planCta}`}>Contact Sales</a>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.infoSection} id="info">
          <div className={styles.collapsibleItem} id="about">
            <button 
              className={styles.collapsibleToggle}
              aria-expanded={expandedSections.about || false}
              aria-controls="about-content"
              onClick={() => toggleCollapsible('about')}
            >
              About Us
            </button>
            {!expandedSections.about ? null : (
              <div className={styles.collapsibleContent} id="about-content">
                <h3>Our Mission</h3>
                <p>At FarmSync, our mission is to empower poultry farmers with the digital tools they need to succeed. We believe that technology can revolutionize agriculture, making it more efficient, sustainable, and profitable for everyone, from small-scale farmers to large enterprises.</p>
                <h3>Our Story</h3>
                <p>Founded by a team of agricultural experts and software engineers, FarmSync was born from a shared passion for solving real-world farming challenges. We saw farmers struggling with manual record-keeping and a lack of actionable data, so we built a platform that is both powerful and easy to use.</p>
              </div>
            )}
          </div>

          <div className={styles.collapsibleItem} id="privacy">
            <button 
              className={styles.collapsibleToggle}
              aria-expanded={expandedSections.privacy || false}
              aria-controls="privacy-content"
              onClick={() => toggleCollapsible('privacy')}
            >
              Privacy Policy
            </button>
            {!expandedSections.privacy ? null : (
              <div className={styles.collapsibleContent} id="privacy-content">
                <h3>1. Information We Collect</h3>
                <p>We collect information you provide directly to us, such as when you create an account, enter farm data (flock size, feed consumption, etc.), or contact us for support. We also collect limited data automatically, like usage statistics, to improve our service.</p>
                <h3>2. How We Use Your Information</h3>
                <p>Your data is used to provide and improve the FarmSync service, offer customer support, and send you important updates. We do not sell your personal or farm data to third parties. Anonymized, aggregated data may be used for industry trend analysis, but it will never be traceable back to you or your farm.</p>
                <h3>3. Data Security</h3>
                <p>We use industry-standard security measures to protect your information from unauthorized access, alteration, or disclosure. However, no internet-based service is 100% secure, so we cannot guarantee absolute security.</p>
              </div>
            )}
          </div>

          <div className={styles.collapsibleItem} id="terms">
            <button 
              className={styles.collapsibleToggle}
              aria-expanded={expandedSections.terms || false}
              aria-controls="terms-content"
              onClick={() => toggleCollapsible('terms')}
            >
              Terms of Service
            </button>
            {!expandedSections.terms ? null : (
              <div className={styles.collapsibleContent} id="terms-content">
                <h3>1. Acceptance of Terms</h3>
                <p>By creating an account and using the FarmSync platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.</p>
                <h3>2. Your Account</h3>
                <p>You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.</p>
                <h3>3. Limitation of Liability</h3>
                <p>FarmSync provides data management tools, but we are not responsible for any farming decisions, financial losses, or livestock health issues. The data and insights provided are for informational purposes, and you are solely responsible for your farm's management and outcomes. Our liability is limited to the maximum extent permitted by law.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer role="contentinfo">
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <h2>FarmSync</h2>
            <p>Poultry Management System</p>
          </div>

          <div className={styles.footerSection}>
            <h3 id='contact'>Contact Us</h3>
            <div className={styles.contactItem}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              <span> +234 806 237 0912</span>
            </div>
            <div className={styles.contactItem}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              <span>info@farmsync.com</span>
            </div>
          </div>

          <div className={styles.footerSection}>
            <h3>Quick Links</h3>
            <ul className={styles.footerLinks}>
              <li><a href="#about">About Us</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h3>Follow Us</h3>
            <ul className={styles.socialLinks}>
              <li>
                <a href="#" aria-label="Follow us on Twitter">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46,6C21.69,6.35,20.86,6.58,20,6.69C20.88,6.16,21.56,5.32,21.88,4.31C21.05,4.81,20.13,5.16,19.16,5.36C18.37,4.5,17.26,4,16,4C13.65,4,11.73,5.92,11.73,8.26C11.73,8.58,11.77,8.9,11.84,9.21C8.28,9.02,5.15,7.38,3.02,4.76C2.66,5.39,2.44,6.12,2.44,6.9C2.44,8.4,3.18,9.75,4.26,10.54C3.57,10.52,2.92,10.32,2.34,10.02C2.34,10.04,2.34,10.05,2.34,10.07C2.34,12.21,3.84,14.01,5.9,14.41C5.55,14.5,5.18,14.56,4.8,14.56C4.52,14.56,4.25,14.54,3.99,14.49C4.55,16.28,6.21,17.55,8.18,17.59C6.7,18.7,4.84,19.33,2.83,19.33C2.5,19.33,2.17,19.31,1.85,19.27C3.85,20.59,6.17,21.33,8.69,21.33C16.02,21.33,20.31,15.42,20.31,10.16C20.31,9.97,20.3,9.78,20.29,9.59C21.1,9,21.86,8.26,22.46,7.38C21.72,7.71,20.94,7.93,20.12,8.04C20.96,7.5,21.6,6.69,22.46,6Z"/>
                  </svg>
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/farmsync-app-610253390" aria-label="Connect with us on LinkedIn">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19,3H5C3.89,3,3,3.9,3,5V19C3,20.1,3.9,21,5,21H19C20.1,21,21,20.1,21,19V5C21,3.9,20.1,3,19,3M8.5,18H5.5V8H8.5V18M6.9,6.48C5.96,6.48,5.18,5.7,5.18,4.74C5.18,3.79,5.96,3,6.9,3C7.84,3,8.62,3.79,8.62,4.74C8.62,5.7,7.84,6.48,6.9,6.48M18.5,18H15.5V13.25C15.5,12.03,15.48,10.43,13.88,10.43C12.28,10.43,12.03,11.79,12.03,13.15V18H9V8H11.9V9.39H11.94C12.39,8.59,13.3,8,14.93,8C18.05,8,18.5,10.09,18.5,12.61V18Z"/>
                  </svg>
                </a>
              </li>
              <li>
                <a href="https://www.facebook.com/share/1A1WC4Bfvn/?mibextid=wwXIfr" aria-label="Follow us on Facebook">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14,13.5L14.8,9.5H11.5V6.5C11.5,5.25 11.83,4.5 13.5,4.5H15V1.14C14.68,1.1 13.3,1 11.9,1C9.12,1 7.5,2.78 7.5,5.69V9.5H4V13.5H7.5V23H11.5V13.5H14Z"/>
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.footerBottom}>
          &copy; 2025 FarmSync. All Rights Reserved.
        </div>
      </footer>

      {modalVisible && (
        <div className={`${styles.customModalOverlay} ${modalVisible ? styles.visible : ''}`} onClick={closeModal}>
          <div className={styles.customModal} onClick={(e) => e.stopPropagation()}>
            <p>{modalMessage}</p>
            <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={closeModal}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;