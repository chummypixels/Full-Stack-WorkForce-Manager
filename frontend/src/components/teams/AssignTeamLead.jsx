import { useState, useEffect } from 'react';
import { teamService } from '../../services/teamService';
import { userService } from '../../services/userService';

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
        type: 'danger',
        message: error.response?.data?.message || 'Failed to assign team lead.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8 col-lg-6">
        <div className="card shadow-sm">
          <div className="card-body">
            <h3 className="card-title mb-4">Assign Team Lead</h3>

            {alert && (
              <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
                {alert.message}
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setAlert(null)}
                ></button>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="team" className="form-label">
                  Select Team <span className="text-danger">*</span>
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
                <div className="alert alert-info">
                  Current Team Lead: {currentTeamLead.firstName} {currentTeamLead.lastName}
                </div>
              )}

              <div className="mb-3">
                <label htmlFor="user" className="form-label">
                  Select User <span className="text-danger">*</span>
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

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Assigning...' : 'Assign Team Lead'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignTeamLead;
