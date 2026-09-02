import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import AssetCard from '../components/assets/AssetCard';
import AssetForm from '../components/assets/AssetForm';
import { fetchAssets } from '../redux/assetSlice';
import './AdminAssets.css';

const AdminAssets = () => {
  const dispatch = useDispatch();
  const { items: assets, loading } = useSelector((state) => state.assets);
  const [showAssetForm, setShowAssetForm] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchAssets());
  }, [dispatch]);

  const filteredAssets = assets.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.assetCode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <motion.div className="page-header" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div>
          <h1>Assets</h1>
          <p className="page-subtext">Every registered asset, one QR code each.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAssetForm(true)}>
          + Register Asset
        </button>
      </motion.div>

      <input
        className="search-input"
        placeholder="Search assets by name or code..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
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

      {showAssetForm && <AssetForm onClose={() => setShowAssetForm(false)} />}
    </>
  );
};

export default AdminAssets;