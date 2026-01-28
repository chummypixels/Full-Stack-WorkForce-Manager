import { useState, useEffect } from 'react';
import { teamService } from '../../services/teamService';
import { userService } from '../../services/userService';
import { HiOutlineCheckCircle, HiOutlineExclamationCircle, HiOutlineUserCircle } from 'react-icons/hi';

const AssignTeamLead = () => {
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [currentTeamLead, setCurrentTeamLead] = useState(null);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedTeam) {
      const team = teams.find((t) => t.id === parseInt(selectedTeam));
      setCurrentTeamLead(team?.teamLead || null);
    } else {
      setCurrentTeamLead(null);
    }
  }, [selectedTeam, teams]);

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
      await teamService.assignTeamLead(selectedTeam, selectedUser);
      setAlert({
        type: 'success',
        message: 'Team lead assigned successfully!',
      });
      fetchData();
      setSelectedTeam('');
      setSelectedUser('');
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'Failed to assign team lead.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        {alert && (
          <div className={`alert alert-${alert.type}`}>
            {alert.type === 'success' ? (
              <HiOutlineCheckCircle className="alert-icon" />
            ) : (
              <HiOutlineExclamationCircle className="alert-icon" />
            )}
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

          {currentTeamLead && (
            <div className="current-lead-info">
              <HiOutlineUserCircle className="current-lead-icon" />
              <div>
                <span className="current-lead-label">Current Team Lead</span>
                <span className="current-lead-name">
                  {currentTeamLead.firstName} {currentTeamLead.lastName}
                </span>
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="user" className="form-label">
              Select New Team Lead <span className="required">*</span>
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
                'Assign Team Lead'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignTeamLead;
