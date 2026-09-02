import { motion } from 'framer-motion';
import './TeamList.css';

const ROLE_CLASS = {
  admin: 'role-admin',
  supervisor: 'role-supervisor',
  technician: 'role-technician',
};

const TeamList = ({ users }) => {
  if (users.length === 0) {
    return <p className="empty-text">No team members yet.</p>;
  }

  return (
    <div className="team-list">
      {users.map((user, i) => (
        <motion.div
          key={user._id}
          className="team-row"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03 }}
        >
          <div className="team-identity">
            <span className={`team-avatar ${ROLE_CLASS[user.role] || 'role-technician'}`}>
              {user.name?.charAt(0).toUpperCase() || '?'}
            </span>
            <div className="team-meta">
              <span className="team-name">{user.name}</span>
              <span className="team-email">{user.email}</span>
            </div>
          </div>
          <span className={`role-pill ${ROLE_CLASS[user.role] || 'role-technician'}`}>
            {user.role}
          </span>
        </motion.div>
      ))}
    </div>
  );
};

export default TeamList;