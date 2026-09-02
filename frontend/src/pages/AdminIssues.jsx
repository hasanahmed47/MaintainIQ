import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import IssueCard from '../components/issues/IssueCard';
import { fetchIssues } from '../redux/issueSlice';
import './AdminIssues.css';

const AdminIssues = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: issues, loading } = useSelector((state) => state.issues);

  useEffect(() => {
    dispatch(fetchIssues());
  }, [dispatch]);

  return (
    <>
      <motion.div className="page-header" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div>
          <h1>Issues</h1>
          <p className="page-subtext">Every reported issue, tracked from report to resolution.</p>
        </div>
      </motion.div>

      {loading ? (
        <p className="loading-text">Loading issues...</p>
      ) : issues.length === 0 ? (
        <p className="empty-text">No issues reported yet.</p>
      ) : (
        <div className="issue-grid">
          {issues.map((issue, i) => (
            <IssueCard
              key={issue._id}
              issue={issue}
              index={i}
              onClick={() => {
                if (issue.asset?._id) {
                  navigate(`/admin/asset/${issue.asset._id}`);
                }
              }}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default AdminIssues;