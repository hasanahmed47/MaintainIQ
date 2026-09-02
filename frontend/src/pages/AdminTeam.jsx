import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import TeamList from '../components/team/TeamList';
import AddTeamMemberForm from '../components/team/AddTeamMemberForm';
import './AdminTeam.css';

const AdminTeam = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/auth/users');
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return (
    <>
      <motion.div className="page-header" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div>
          <h1>Team</h1>
          <p className="page-subtext">Manage administrators, supervisors and technicians.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          + Add Team Member
        </button>
      </motion.div>

      {loading ? <p className="loading-text">Loading team...</p> : <TeamList users={users} />}

      {showForm && <AddTeamMemberForm onClose={() => setShowForm(false)} onAdded={loadUsers} />}
    </>
  );
};

export default AdminTeam;