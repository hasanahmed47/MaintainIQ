import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import Sidebar from '../components/layout/Sidebar';
import IssueCard from '../components/issues/IssueCard';
import MaintenanceForm from '../components/maintenance/MaintenanceForm';
import { fetchIssues, updateIssueStatus } from '../redux/issueSlice';
import './TechnicianDashboard.css';

const NEXT_STATUS_MAP = {
  Assigned: 'Inspection Started',
  'Inspection Started': 'Maintenance In Progress',
  'Maintenance In Progress': 'Resolved',
};

const TechnicianDashboard = () => {
  const dispatch = useDispatch();
  const { items: issues, loading } = useSelector((state) => state.issues);
  const { userInfo } = useSelector((state) => state.auth);

  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false);
  const [actionError, setActionError] = useState(null);

  useEffect(() => {
    dispatch(fetchIssues({ assignedTechnician: userInfo?._id }));
  }, [dispatch, userInfo]);

  const myIssues = issues.filter((i) => i.assignedTechnician?._id === userInfo?._id || i.assignedTechnician === userInfo?._id);

  const handleAdvance = async (issue) => {
    setActionError(null);
    const next = NEXT_STATUS_MAP[issue.status];
    if (!next) return;

    if (next === 'Resolved') {
      setSelectedIssue(issue);
      setShowMaintenanceForm(true);
      return;
    }

    const result = await dispatch(updateIssueStatus({ id: issue._id, status: next }));
    if (updateIssueStatus.rejected.match(result)) {
      setActionError(result.payload);
    }
  };

  const handleMaintenanceSaved = async () => {
    if (selectedIssue) {
      await dispatch(updateIssueStatus({ id: selectedIssue._id, status: 'Resolved' }));
      dispatch(fetchIssues({ assignedTechnician: userInfo?._id }));
    }
  };

  const navItems = [{ key: 'issues', label: 'My Issues', active: true, onClick: () => {} }];

  return (
    <div className="dashboard-layout">
      <Sidebar navItems={navItems} />

      <main className="dashboard-main">
        <div className="page-container">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <h1>My Assigned Work</h1>
            <p className="dashboard-subtext">Move each issue through inspection, repair, and resolution.</p>
          </motion.div>

          {actionError && <div className="dash-error">{actionError}</div>}

          {loading ? (
            <p className="loading-text">Loading issues...</p>
          ) : myIssues.length === 0 ? (
            <p className="empty-text">No issues assigned to you right now.</p>
          ) : (
            <div className="tech-issue-list">
              {myIssues.map((issue, i) => (
                <motion.div
                  key={issue._id}
                  className="tech-issue-row"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <IssueCard issue={issue} onClick={() => {}} />
                  {NEXT_STATUS_MAP[issue.status] && (
                    <button className="advance-btn" onClick={() => handleAdvance(issue)}>
                      Move to: {NEXT_STATUS_MAP[issue.status]}
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      {showMaintenanceForm && selectedIssue && (
        <MaintenanceForm
          issueId={selectedIssue._id}
          onClose={() => setShowMaintenanceForm(false)}
          onSaved={handleMaintenanceSaved}
        />
      )}
    </div>
  );
};

export default TechnicianDashboard;
