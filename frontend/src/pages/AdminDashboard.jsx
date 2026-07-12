import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import Sidebar from '../components/layout/Sidebar';
import AssetCard from '../components/assets/AssetCard';
import IssueCard from '../components/issues/IssueCard';
import AssetForm from '../components/assets/AssetForm';
import { fetchAssets } from '../redux/assetSlice';
import { fetchIssues } from '../redux/issueSlice';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: assets, loading: assetsLoading } = useSelector((state) => state.assets);
  const { items: issues, loading: issuesLoading } = useSelector((state) => state.issues);

  const [tab, setTab] = useState('assets');
  const [showAssetForm, setShowAssetForm] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchAssets());
    dispatch(fetchIssues());
  }, [dispatch]);

  const filteredAssets = assets.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.assetCode.toLowerCase().includes(search.toLowerCase())
  );

  const summaryCards = [
    { label: 'Total Assets', value: assets.length },
    { label: 'Operational', value: assets.filter((a) => a.status === 'Operational').length },
    { label: 'Open Issues', value: issues.filter((i) => !['Resolved', 'Closed'].includes(i.status)).length },
    { label: 'Critical', value: issues.filter((i) => i.priority === 'Critical').length },
  ];

  const navItems = [
    { key: 'assets', label: 'Assets', active: tab === 'assets', onClick: () => setTab('assets') },
    { key: 'issues', label: 'Issues', active: tab === 'issues', onClick: () => setTab('issues') },
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar navItems={navItems} />

      <main className="dashboard-main">
        <div className="page-container">
          <motion.div
            className="dashboard-header"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div>
              <h1>Admin Dashboard</h1>
              <p className="dashboard-subtext">Full visibility into every asset and issue.</p>
            </div>
            {tab === 'assets' && (
              <button className="btn-primary" onClick={() => setShowAssetForm(true)}>
                + Register Asset
              </button>
            )}
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

          {tab === 'assets' && (
            <>
              <input
                className="search-input"
                placeholder="Search assets by name or code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              {assetsLoading ? (
                <p className="loading-text">Loading assets...</p>
              ) : filteredAssets.length === 0 ? (
                <p className="empty-text">No assets found. Register your first asset to get started.</p>
              ) : (
                <div className="asset-grid">
                  {filteredAssets.map((asset, i) => (
                    <AssetCard key={asset._id} asset={asset} index={i} />
                  ))}
                </div>
              )}
            </>
          )}

          {tab === 'issues' && (
            <>
              {issuesLoading ? (
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
          )}
        </div>
      </main>

      {showAssetForm && <AssetForm onClose={() => setShowAssetForm(false)} />}
    </div>
  );
};

export default AdminDashboard;
