import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useAuthStore from '../store/authStore'

const Home = () => {
  const user = useAuthStore((state) => state.user)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (user) {
    return null
  }

  return (
    <div className="home-page">
      <div className="home-header">
        <div className="home-nav">
          <div className="home-logo">
            <span className="home-logo__icon">📊</span>
            <span className="home-logo__text">LeaveMS</span>
          </div>
          <div className="home-nav__buttons">
            <Link to="/login" className="btn btn--ghost btn--nav">Login</Link>
            <Link to="/register" className="btn btn--primary btn--nav">Sign Up</Link>
          </div>
        </div>

        <div className="home-hero">
          <div className="home-hero__background" style={{ transform: `translateY(${scrollY * 0.5}px)` }}>
            <div className="home-hero__blob home-hero__blob--1"></div>
            <div className="home-hero__blob home-hero__blob--2"></div>
            <div className="home-hero__blob home-hero__blob--3"></div>
          </div>
          
          <div className="home-hero__content">
            <h1 className="home-hero__title">
              Effortless Leave <span className="home-hero__highlight">Management</span>
            </h1>
            <p className="home-hero__subtitle">
              Streamline your leave requests, track approvals, and manage your time off with our modern leave management system
            </p>
            <div className="home-hero__buttons">
              <Link to="/login" className="btn btn--primary btn--large">
                <span className="btn__icon">→</span>
                Get Started
              </Link>
              <Link to="/register" className="btn btn--secondary btn--large">
                Create Account
              </Link>
            </div>
            <div className="home-hero__stats">
              <div className="home-stat">
                <span className="home-stat__number">10+</span>
                <span className="home-stat__label">Organizations</span>
              </div>
              <div className="home-stat">
                <span className="home-stat__number">500+</span>
                <span className="home-stat__label">Users</span>
              </div>
              <div className="home-stat">
                <span className="home-stat__number">99.9%</span>
                <span className="home-stat__label">Uptime</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="home-features">
        <div className="section-header">
          <h2>Powerful Features</h2>
          <p>Everything you need to manage leaves effectively</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>Easy Apply</h3>
            <p>Submit leave requests in seconds with our simple and intuitive interface</p>
            <ul className="feature-list">
              <li>✓ Quick submission</li>
              <li>✓ Auto-calculate days</li>
              <li>✓ Real-time preview</li>
            </ul>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Fast Approvals</h3>
            <p>Managers can review and approve requests instantly with detailed insights</p>
            <ul className="feature-list">
              <li>✓ Quick reviews</li>
              <li>✓ Bulk actions</li>
              <li>✓ Comments & notes</li>
            </ul>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Analytics</h3>
            <p>Beautiful charts and statistics to visualize leave patterns and trends</p>
            <ul className="feature-list">
              <li>✓ Status breakdown</li>
              <li>✓ Trend analysis</li>
              <li>✓ Export reports</li>
            </ul>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔐</div>
            <h3>Secure</h3>
            <p>Enterprise-grade security to keep your data safe and protected</p>
            <ul className="feature-list">
              <li>✓ Encrypted data</li>
              <li>✓ JWT auth</li>
              <li>✓ Secure API</li>
            </ul>
          </div>

          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Role-Based</h3>
            <p>Separate interfaces and permissions for employees and managers</p>
            <ul className="feature-list">
              <li>✓ Employee panel</li>
              <li>✓ Manager panel</li>
              <li>✓ Permissions</li>
            </ul>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Responsive</h3>
            <p>Works seamlessly on desktop, tablet, and mobile devices</p>
            <ul className="feature-list">
              <li>✓ Mobile friendly</li>
              <li>✓ Touch optimized</li>
              <li>✓ Fast loading</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="home-benefits">
        <div className="section-header">
          <h2>Why Choose Us?</h2>
          <p>Trusted by teams who value simplicity and efficiency</p>
        </div>

        <div className="benefits-grid">
          <div className="benefit-item">
            <div className="benefit-number">1</div>
            <h3>Simple Setup</h3>
            <p>Get started in minutes. No complex configuration needed.</p>
          </div>

          <div className="benefit-item">
            <div className="benefit-number">2</div>
            <h3>Beautiful Design</h3>
            <p>Modern, clean interface that's a pleasure to use daily.</p>
          </div>

          <div className="benefit-item">
            <div className="benefit-number">3</div>
            <h3>Always Available</h3>
            <p>Cloud-based with 99.9% uptime guarantee.</p>
          </div>

          <div className="benefit-item">
            <div className="benefit-number">4</div>
            <h3>Data Protection</h3>
            <p>Your data is encrypted and stored securely.</p>
          </div>
        </div>
      </section>

      <section className="home-cta">
        <div className="cta-content">
          <h2>Ready to Get Started?</h2>
          <p>Join thousands of teams using our leave management system</p>
          <div className="cta-buttons">
            <Link to="/login" className="btn btn--primary btn--large">
              Login Now
            </Link>
            <Link to="/register" className="btn btn--outline btn--large">
              Create Free Account
            </Link>
          </div>
        </div>
        <div className="cta-background">
          <div className="cta-blob cta-blob--1"></div>
          <div className="cta-blob cta-blob--2"></div>
        </div>
      </section>

      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Product</h4>
            <ul>
              <li><a href="#features">Features</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#security">Security</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Company</h4>
            <ul>
              <li><a href="#about">About</a></li>
              <li><a href="#blog">Blog</a></li>
              <li><a href="#careers">Careers</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Legal</h4>
            <ul>
              <li><a href="#privacy">Privacy</a></li>
              <li><a href="#terms">Terms</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Follow Us</h4>
            <div className="footer-socials">
              <a href="#twitter">𝕏</a>
              <a href="#github">GitHub</a>
              <a href="#linkedin">LinkedIn</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 LeaveMS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Home
