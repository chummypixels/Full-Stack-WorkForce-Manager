import { useState, useEffect } from 'react';
import { teamService } from '../../services/teamService';
import { HiOutlineCheckCircle, HiOutlineExclamationCircle } from 'react-icons/hi';

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
        type: 'error',
        message: error.response?.data?.message || 'Failed to assign role.',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatRole = (role) => {
    return role.replace('_', ' ');
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

          <div className="form-group">
            <label htmlFor="user" className="form-label">
              Select Team Member <span className="required">*</span>
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
                  {member.user.firstName} {member.user.lastName} (Current: {formatRole(member.role)})
                </option>
              ))}
            </select>
            {selectedTeam && teamMembers.length === 0 && (
              <span className="form-hint warning">
                No members in this team. Assign users first.
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="role" className="form-label">
              Select Role <span className="required">*</span>
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
                  {formatRole(role)}
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
                'Assign Role'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignRole;
