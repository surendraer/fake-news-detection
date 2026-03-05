import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiCpu,
  FiDatabase,
  FiCode,
  FiServer,
  FiLayers,
  FiGitBranch,
  FiArrowRight,
  FiGlobe,
  FiShield,
} from 'react-icons/fi';
import './AboutPage.css';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const techStack = [
  {
    icon: <FiCode />,
    title: 'React + Redux',
    desc: 'Modern React with Redux Toolkit for state management, React Router for navigation.',
  },
  {
    icon: <FiServer />,
    title: 'Node.js + Express',
    desc: 'RESTful API backend with JWT authentication, rate limiting, and input validation.',
  },
  {
    icon: <FiDatabase />,
    title: 'MongoDB',
    desc: 'NoSQL database for storing users, analyses, and model feedback data.',
  },
  {
    icon: <FiCpu />,
    title: 'Python ML Service',
    desc: 'FastAPI microservice with scikit-learn ensemble model (LR + RF + GB).',
  },
  {
    icon: <FiLayers />,
    title: 'NLP Engine',
    desc: 'Built-in NLP analysis with sentiment, subjectivity, and clickbait detection.',
  },
  {
    icon: <FiGitBranch />,
    title: 'TF-IDF + Ensemble',
    desc: 'Text vectorization with n-grams and ensemble voting classifier for predictions.',
  },
];

const datasets = [
  {
    name: 'Kaggle Fake News Dataset',
    desc: 'Competition dataset with 20K+ labeled articles. Has title, text, and label columns.',
    url: 'https://www.kaggle.com/c/fake-news/data',
  },
  {
    name: 'ISOT Fake News Dataset',
    desc: 'University of Victoria dataset with 44K articles (21K real, 23K fake).',
    url: 'https://onlineacademiccommunity.uvic.ca/isot/2022/11/27/fake-news-detection-datasets/',
  },
  {
    name: 'LIAR Dataset',
    desc: 'Benchmark dataset with 12.8K labeled short statements from PolitiFact.',
    url: 'https://www.cs.ucsb.edu/~william/data/liar_dataset.zip',
  },
  {
    name: 'FakeNewsNet',
    desc: 'Comprehensive dataset with news content and social context from Twitter.',
    url: 'https://github.com/KaiDMML/FakeNewsNet',
  },
];

const AboutPage = () => {
  return (
    <div className="about-page">
      <div className="container">
        <motion.div
          className="about-hero"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <h1>About VerifyNews</h1>
          <p>
            An AI-powered platform that helps users identify misinformation
            using machine learning and natural language processing.
          </p>
        </motion.div>

        {/* Mission */}
        <motion.div
          className="about-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h2>
            <FiShield className="icon" /> Our Mission
          </h2>
          <div className="about-text">
            <p>
              In an era of information overload, distinguishing between real and
              fake news has become increasingly challenging. VerifyNews
              leverages artificial intelligence to help users make informed
              decisions about the news they consume.
            </p>
            <p>
              Our platform combines multiple machine learning algorithms with
              natural language processing techniques to analyze news articles
              for credibility indicators, including sentiment analysis,
              clickbait detection, source attribution, and subjectivity scoring.
            </p>
          </div>
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          className="about-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h2>
            <FiCpu className="icon" /> Technology Stack
          </h2>
          <div className="about-text">
            <p>
              Built with a modern, production-ready architecture using
              industry-standard tools and frameworks.
            </p>
          </div>
          <div className="tech-grid">
            {techStack.map((tech, i) => (
              <motion.div
                key={i}
                className="tech-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="tech-card-icon">{tech.icon}</div>
                <h4>{tech.title}</h4>
                <p>{tech.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ML Model */}
        <motion.div
          className="about-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h2>
            <FiLayers className="icon" /> How the ML Model Works
          </h2>
          <div className="about-text">
            <p>
              Our fake news detection pipeline uses a multi-stage approach:
            </p>
            <p>
              <strong>1. Text Preprocessing:</strong> Raw text is cleaned by
              removing URLs, HTML tags, special characters, and stopwords. Words
              are then stemmed using the Porter Stemmer algorithm.
            </p>
            <p>
              <strong>2. Feature Extraction (TF-IDF):</strong> Text is
              converted into numerical features using Term Frequency-Inverse
              Document Frequency with up to tri-gram features (50,000 max features).
            </p>
            <p>
              <strong>3. Ensemble Classification:</strong> Three classifiers
              vote on the final prediction:
            </p>
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
              <li>Logistic Regression -- fast and interpretable baseline</li>
              <li>Random Forest (200 trees) -- captures non-linear patterns</li>
              <li>Gradient Boosting (150 estimators) -- high accuracy on structured data</li>
            </ul>
            <p>
              <strong>4. NLP Analysis Layer:</strong> Additionally, a rule-based
              NLP engine checks for clickbait patterns, emotional language,
              source attribution, statistical claims, and readability.
            </p>
            <p>
              The system falls back to the NLP heuristic engine if the ML
              microservice is not running, ensuring the app always works.
            </p>
          </div>
        </motion.div>

        {/* Datasets */}
        <motion.div
          className="about-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h2>
            <FiDatabase className="icon" /> Datasets
          </h2>
          <div className="about-text">
            <p>
              You can train the model using any of these publicly available
              datasets. Download the CSV, place it in{' '}
              <code
                style={{
                  background: 'var(--bg-input)',
                  padding: '0.15rem 0.4rem',
                  borderRadius: '4px',
                  fontSize: '0.85em',
                }}
              >
                ml-service/data/
              </code>{' '}
              and run the training script.
            </p>
          </div>
          <ul className="dataset-list">
            {datasets.map((ds, i) => (
              <li key={i} className="dataset-item">
                <div className="dataset-number">{i + 1}</div>
                <div className="dataset-info">
                  <h4>{ds.name}</h4>
                  <p>{ds.desc}</p>
                  <a href={ds.url} target="_blank" rel="noopener noreferrer">
                    <FiGlobe style={{ marginRight: '0.3rem' }} />
                    Visit Dataset
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* CTA */}
        <motion.div
          style={{ textAlign: 'center', marginTop: '2rem' }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <Link to="/analyze" className="btn btn-primary btn-lg">
            Try It Now <FiArrowRight />
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;
