import { useState, useEffect } from 'react';
import { teamService } from '../../services/teamService';
import { HiOutlineUserGroup, HiOutlineUsers } from 'react-icons/hi';

const TeamMembers = () => {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    if (selectedTeam) {
      fetchTeamMembers(selectedTeam);
    } else {
      setTeamMembers([]);
    }
  }, [selectedTeam]);

  const fetchTeams = async () => {
    try {
      const response = await teamService.getAllTeams();
      setTeams(response.data);
    } catch (err) {
      console.error('Failed to fetch teams:', err);
    }
  };

  const fetchTeamMembers = async (teamId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await teamService.getTeamMembers(teamId);
      setTeamMembers(response.data);
    } catch (err) {
      setError('Failed to fetch team members. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'DEVELOPER':
        return 'badge-developer';
      case 'QA':
        return 'badge-qa';
      case 'PRODUCT_MANAGER':
        return 'badge-pm';
      default:
        return 'badge-default';
    }
  };

  const formatRole = (role) => {
    return role.replace('_', ' ');
  };

  return (
    <div className="team-members-container">
      <div className="form-card" style={{ marginBottom: '2rem' }}>
        <div className="form-group">
          <label htmlFor="team" className="form-label">
            Select Team <span className="required">*</span>
          </label>
          <select
            className="form-select"
            id="team"
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
          >
            <option value="">Choose a team...</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && (
        <div className="loading-container">
          <div className="spinner-large"></div>
          <p>Loading team members...</p>
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && selectedTeam && (
        <>
          {teamMembers.length === 0 ? (
            <div className="empty-state">
              <HiOutlineUsers className="empty-icon" />
              <h3>No Members Found</h3>
              <p>This team has no members yet. Assign users to get started.</p>
            </div>
          ) : (
            <div className="table-container">
              <div className="table-header">
                <HiOutlineUserGroup className="table-icon" />
                <span>{teamMembers.length} Team Members</span>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Gender</th>
                    <th>Location</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {teamMembers.map((member) => (
                    <tr key={member.id}>
                      <td>
                        <div className="member-name">
                          <div className="member-avatar">
                            {member.user.firstName.charAt(0)}
                          </div>
                          <span>{member.user.firstName} {member.user.lastName}</span>
                        </div>
                      </td>
                      <td>{member.user.gender}</td>
                      <td>{member.user.location}</td>
                      <td>
                        <span className={`role-badge ${getRoleBadgeClass(member.role)}`}>
                          {formatRole(member.role)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {!selectedTeam && !loading && (
        <div className="empty-state">
          <HiOutlineUserGroup className="empty-icon" />
          <h3>Select a Team</h3>
          <p>Choose a team from the dropdown above to view its members.</p>
        </div>
      )}
    </div>
  );
};

export default TeamMembers;
