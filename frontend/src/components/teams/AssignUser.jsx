import { useState, useEffect } from 'react';
import { teamService } from '../../services/teamService';
import { userService } from '../../services/userService';

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
          type: 'danger',
          message: error.response?.data?.message || 'Failed to assign user to team.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8 col-lg-6">
        <div className="card shadow-sm">
          <div className="card-body">
            <h3 className="card-title mb-4">Assign User to Team</h3>

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
                {loading ? 'Assigning...' : 'Assign User'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignUser;
