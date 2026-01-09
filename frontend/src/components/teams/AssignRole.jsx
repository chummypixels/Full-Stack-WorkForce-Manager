import { useState, useEffect } from 'react';
import { teamService } from '../../services/teamService';

const AssignRole = () => {
  const [teams, setTeams] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  const roles = ['DEVELOPER', 'QA', 'PRODUCT_MANAGER'];

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    if (selectedTeam) {
      fetchTeamMembers(selectedTeam);
    } else {
      setTeamMembers([]);
      setSelectedUser('');
    }
  }, [selectedTeam]);

  const fetchTeams = async () => {
    try {
      const response = await teamService.getAllTeams();
      setTeams(response.data);
    } catch (error) {
      console.error('Failed to fetch teams:', error);
    }
  };

  const fetchTeamMembers = async (teamId) => {
    try {
      const response = await teamService.getTeamMembers(teamId);
      setTeamMembers(response.data);
    } catch (error) {
      console.error('Failed to fetch team members:', error);
      setTeamMembers([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    try {
      await teamService.assignRole(selectedTeam, selectedUser, selectedRole);
      setAlert({
        type: 'success',
        message: 'Role assigned successfully!',
      });
      fetchTeamMembers(selectedTeam);
      setSelectedUser('');
      setSelectedRole('');
    } catch (error) {
      setAlert({
        type: 'danger',
        message: error.response?.data?.message || 'Failed to assign role.',
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
            <h3 className="card-title mb-4">Assign Role to Team Member</h3>

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
                  Select Team Member <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
                  id="user"
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  required
                  disabled={!selectedTeam || teamMembers.length === 0}
                >
                  <option value="">Choose a team member...</option>
                  {teamMembers.map((member) => (
                    <option key={member.id} value={member.user.id}>
                      {member.user.firstName} {member.user.lastName} (Current: {member.role})
                    </option>
                  ))}
                </select>
                {selectedTeam && teamMembers.length === 0 && (
                  <div className="form-text text-warning">
                    No members in this team. Assign users first.
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="role" className="form-label">
                  Select Role <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
                  id="role"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  required
                >
                  <option value="">Choose a role...</option>
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Assigning...' : 'Assign Role'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignRole;
