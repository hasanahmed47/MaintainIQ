import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardCharts from '../components/dashboard/DashboardCharts';
import { fetchAssets } from '../redux/assetSlice';
import { fetchIssues } from '../redux/issueSlice';
import './AdminOverview.css';

const AdminOverview = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: assets, loading: assetsLoading } = useSelector((state) => state.assets);
  const { items: issues, loading: issuesLoading } = useSelector((state) => state.issues);

  useEffect(() => {
    dispatch(fetchAssets());
    dispatch(fetchIssues());
  }, [dispatch]);

  const summaryCards = [
    { label: 'Total Assets', value: assets.length },
    { label: 'Operational', value: assets.filter((a) => a.status === 'Operational').length },
    { label: 'Open Issues', value: issues.filter((i) => !['Resolved', 'Closed'].includes(i.status)).length },
    { label: 'Critical', value: issues.filter((i) => i.priority === 'Critical').length },
  ];

  const recentAssets = [...assets].slice(0, 4);
  const recentIssues = [...issues].slice(0, 4);

  return (
    <>
      <motion.div className="page-header" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div>
          <h1>Admin Dashboard</h1>
          <p className="page-subtext">Full visibility into every asset and issue.</p>
        </div>
      </motion.div>

      <div className="summary-grid">
        {summaryCards.map((card, i) => (
          <motion.div
            key={card.label}
            className="summary-card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <span className="summary-value">{card.value}</span>
            <span className="summary-label">{card.label}</span>
          </motion.div>
        ))}
      </div>

      {assetsLoading || issuesLoading ? (
        <p className="loading-text">Loading dashboard...</p>
      ) : (
        <>
          <DashboardCharts assets={assets} issues={issues} />

          <div className="overview-recent-grid">
            <div>
              <div className="overview-recent-header">
                <h3>Recent Assets</h3>
                <button className="view-all-btn" onClick={() => navigate('/admin/assets')}>View All</button>
              </div>
              {recentAssets.length === 0 ? (
                <p className="empty-text">No assets registered yet.</p>
              ) : (
                <div className="recent-list">
                  {recentAssets.map((a) => (
                    <div key={a._id} className="recent-row" onClick={() => navigate(`/admin/asset/${a._id}`)}>
                      <div>
                        <span className="recent-title">{a.name}</span>
                        <span className="recent-sub">{a.assetCode}</span>
                      </div>
                      <span className="recent-tag">{a.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="overview-recent-header">
                <h3>Recent Issues</h3>
                <button className="view-all-btn" onClick={() => navigate('/admin/issues')}>View All</button>
              </div>
              {recentIssues.length === 0 ? (
                <p className="empty-text">No issues reported yet.</p>
              ) : (
                <div className="recent-list">
                  {recentIssues.map((i) => (
                    <div
                      key={i._id}
                      className="recent-row"
                      onClick={() => i.asset?._id && navigate(`/admin/asset/${i.asset._id}`)}
                    >
                      <div>
                        <span className="recent-title">{i.title}</span>
                        <span className="recent-sub">{i.asset?.name || 'Unknown Asset'}</span>
                      </div>
                      <span className={`recent-tag priority-${i.priority?.toLowerCase()}`}>{i.priority}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default AdminOverview;