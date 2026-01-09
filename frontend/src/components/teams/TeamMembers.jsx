import { useState, useEffect } from 'react';
import { teamService } from '../../services/teamService';

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
        return 'bg-primary';
      case 'QA':
        return 'bg-success';
      case 'PRODUCT_MANAGER':
        return 'bg-warning text-dark';
      default:
        return 'bg-secondary';
    }
  };

  return (
    <div>
      <h3 className="mb-4">View Team Members</h3>

      <div className="row mb-4">
        <div className="col-md-6">
          <label htmlFor="team" className="form-label">
            Select Team <span className="text-danger">*</span>
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
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && selectedTeam && (
        <>
          {teamMembers.length === 0 ? (
            <div className="alert alert-info" role="alert">
              No members in this team. Assign users to get started.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
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
                        {member.user.firstName} {member.user.lastName}
                      </td>
                      <td>{member.user.gender}</td>
                      <td>{member.user.location}</td>
                      <td>
                        <span className={`badge ${getRoleBadgeClass(member.role)}`}>
                          {member.role.replace('_', ' ')}
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
    </div>
  );
};

export default TeamMembers;
