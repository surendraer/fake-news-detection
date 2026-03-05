import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiShieldCheck,
  HiLightningBolt,
  HiChartBar,
  HiGlobe,
  HiDatabase,
  HiClock,
} from 'react-icons/hi';
import { FiArrowRight, FiSearch, FiCpu, FiCheckCircle, FiBarChart2 } from 'react-icons/fi';
import './HomePage.css';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
};

const features = [
  {
    icon: <HiLightningBolt />,
    color: 'blue',
    title: 'Real-Time Analysis',
    desc: 'Get instant credibility scores on any news article using our advanced AI pipeline.',
  },
  {
    icon: <HiShieldCheck />,
    color: 'green',
    title: 'ML-Powered Detection',
    desc: 'Ensemble of Logistic Regression, Random Forest, and Gradient Boosting models.',
  },
  {
    icon: <HiChartBar />,
    color: 'purple',
    title: 'Detailed Breakdown',
    desc: 'See sentiment, subjectivity, clickbait detection, and credibility indicators.',
  },
  {
    icon: <HiGlobe />,
    color: 'cyan',
    title: 'NLP Analysis',
    desc: 'Advanced natural language processing to detect patterns in fake news content.',
  },
  {
    icon: <HiDatabase />,
    color: 'yellow',
    title: 'History Tracking',
    desc: 'Save and review all your previous analyses with a personal dashboard.',
  },
  {
    icon: <HiClock />,
    color: 'red',
    title: 'User Feedback Loop',
    desc: 'Submit feedback on results to help improve the model over time.',
  },
];

const steps = [
  { icon: <FiSearch />, title: 'Paste News', desc: 'Paste the news article text or headline you want to verify.' },
  { icon: <FiCpu />, title: 'AI Processing', desc: 'Our ML models and NLP engine analyze the content in real time.' },
  { icon: <FiCheckCircle />, title: 'Get Verdict', desc: 'Receive a REAL, FAKE, or UNCERTAIN verdict with confidence score.' },
  { icon: <FiBarChart2 />, title: 'Review Details', desc: 'Explore detailed breakdown of credibility indicators & metrics.' },
];

const HomePage = () => {
  return (
    <div>
      {/* Hero */}
      <section className="home-hero">
        <div className="container">
          <motion.div
            className="hero-content"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <motion.div className="hero-badge" custom={0} variants={fadeUp}>
              <HiShieldCheck /> AI-Powered News Verification
            </motion.div>

            <motion.h1 className="hero-title" custom={1} variants={fadeUp}>
              Detect{' '}
              <span className="hero-title-highlight">Fake News</span>{' '}
              Before It Spreads
            </motion.h1>

            <motion.p className="hero-subtitle" custom={2} variants={fadeUp}>
              Paste any news article and our machine learning models will
              analyze it for credibility, sentiment, and reliability in seconds.
            </motion.p>

            <motion.div className="hero-actions" custom={3} variants={fadeUp}>
              <Link to="/analyze" className="btn btn-primary btn-lg">
                Start Analyzing <FiArrowRight />
              </Link>
              <Link to="/about" className="btn btn-secondary btn-lg">
                Learn More
              </Link>
            </motion.div>

            <motion.div className="hero-stats" custom={4} variants={fadeUp}>
              <div className="hero-stat">
                <div className="hero-stat-number">95%+</div>
                <div className="hero-stat-label">Model Accuracy</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-number">&lt;2s</div>
                <div className="hero-stat-label">Analysis Time</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-number">50K+</div>
                <div className="hero-stat-label">Training Samples</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="home-features">
        <div className="container">
          <div className="section-header">
            <div className="section-label">Features</div>
            <h2 className="section-title">Everything You Need to Verify News</h2>
            <p className="section-desc">
              Comprehensive tools and AI models to detect misinformation and
              evaluate news credibility.
            </p>
          </div>

          <div className="feature-grid">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                className="feature-card"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                custom={i}
                variants={fadeUp}
              >
                <div className={`feature-icon ${feature.color}`}>
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="home-how">
        <div className="container">
          <div className="section-header">
            <div className="section-label">How It Works</div>
            <h2 className="section-title">Four Simple Steps</h2>
            <p className="section-desc">
              Verify any news article in under 30 seconds.
            </p>
          </div>

          <div className="steps-grid">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                className="step-card"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                custom={i}
                variants={fadeUp}
              >
                <div className="step-number">{i + 1}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="home-cta">
        <div className="container">
          <motion.div
            className="cta-card"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="cta-title">Ready to Fight Misinformation?</h2>
            <p className="cta-desc">
              Create a free account to save your analysis history, access your
              dashboard, and help improve our AI models.
            </p>
            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary btn-lg">
                Create Free Account <FiArrowRight />
              </Link>
              <Link to="/analyze" className="btn btn-secondary btn-lg">
                Try Without Account
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
