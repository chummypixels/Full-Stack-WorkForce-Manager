import { useState, useEffect } from 'react';
import { teamService } from '../../services/teamService';
import { userService } from '../../services/userService';
import { HiOutlineCheckCircle, HiOutlineExclamationCircle, HiOutlineExclamation } from 'react-icons/hi';

const AssignUser = () => {
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [teamsResponse, usersResponse] = await Promise.all([
        teamService.getAllTeams(),
        userService.getAllUsers(),
      ]);
      setTeams(teamsResponse.data);
      setUsers(usersResponse.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    try {
      await teamService.assignUserToTeam(selectedTeam, selectedUser);
      setAlert({
        type: 'success',
        message: 'User assigned to team successfully!',
      });
      setSelectedTeam('');
      setSelectedUser('');
    } catch (error) {
      if (error.response?.status === 409) {
        setAlert({
          type: 'warning',
          message: 'User is already a member of this team.',
        });
      } else {
        setAlert({
          type: 'error',
          message: error.response?.data?.message || 'Failed to assign user to team.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'success':
        return <HiOutlineCheckCircle className="alert-icon" />;
      case 'warning':
        return <HiOutlineExclamation className="alert-icon" />;
      default:
        return <HiOutlineExclamationCircle className="alert-icon" />;
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        {alert && (
          <div className={`alert alert-${alert.type}`}>
            {getAlertIcon(alert.type)}
            <span>{alert.message}</span>
            <button className="alert-close" onClick={() => setAlert(null)}>&times;</button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="team" className="form-label">
              Select Team <span className="required">*</span>
            </label>
            <select
              className="form-select"
              id="team"
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              required
            >
              <option value="">Choose a team...</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="user" className="form-label">
              Select User <span className="required">*</span>
            </label>
            <select
              className="form-select"
              id="user"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              required
            >
              <option value="">Choose a user...</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName} ({user.location})
                </option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Assigning...
                </>
              ) : (
                'Assign User'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignUser;
