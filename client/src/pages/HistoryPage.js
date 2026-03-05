import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiSearch, FiArrowRight } from 'react-icons/fi';
import { fetchHistory } from '../store/slices/analysisSlice';
import './HistoryPage.css';

const HistoryPage = () => {
  const dispatch = useDispatch();
  const { history, pagination, loading } = useSelector(
    (state) => state.analysis
  );
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchHistory({ page, limit: 10, label: filter }));
  }, [dispatch, page, filter]);

  const handleFilter = (label) => {
    setFilter(label === filter ? '' : label);
    setPage(1);
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className="history-page">
      <div className="container">
        <div className="history-header">
          <h1>Analysis History</h1>
          <div className="history-filters">
            {['REAL', 'FAKE', 'UNCERTAIN'].map((label) => (
              <button
                key={label}
                className={`filter-btn${filter === label ? ' active' : ''}`}
                onClick={() => handleFilter(label)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="loading-overlay">
            <div className="spinner spinner-lg" />
            <div className="loading-text">Loading history...</div>
          </div>
        ) : history.length > 0 ? (
          <>
            <div className="history-list">
              {history.map((item, i) => (
                <motion.div
                  key={item._id}
                  className="history-card"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="history-card-left">
                    <div className="history-card-title">
                      {item.title || 'Untitled Analysis'}
                    </div>
                    <div className="history-card-meta">
                      <span>{formatDate(item.createdAt)}</span>
                    </div>
                  </div>
                  <div className="history-card-right">
                    <span
                      className={`badge badge-${item.prediction.label.toLowerCase()}`}
                    >
                      {item.prediction.label}
                    </span>
                    <span className="history-confidence">
                      {item.prediction.confidence}%
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {pagination && pagination.pages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </button>
                <span className="pagination-info">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  className="pagination-btn"
                  disabled={page >= pagination.pages}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="history-empty">
            <FiSearch
              style={{ fontSize: '2.5rem', marginBottom: '1rem', opacity: 0.4 }}
            />
            <h3>No Analyses Found</h3>
            <p>
              {filter
                ? `No ${filter} results found. Try a different filter.`
                : 'Start by analyzing a news article.'}
            </p>
            <Link
              to="/analyze"
              className="btn btn-primary"
              style={{ marginTop: '1.25rem' }}
            >
              Analyze News <FiArrowRight />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
