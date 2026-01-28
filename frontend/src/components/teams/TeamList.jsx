import { useState, useEffect } from 'react';
import { teamService } from '../../services/teamService';
import { HiOutlineOfficeBuilding, HiOutlineUserCircle, HiOutlineRefresh } from 'react-icons/hi';

const TeamList = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await teamService.getAllTeams();
      setTeams(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch teams. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-large"></div>
        <p>Loading teams...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="team-list-container">
      <div className="list-header">
        <div className="list-count">
          <span className="count-number">{teams.length}</span>
          <span className="count-label">Total Teams</span>
        </div>
        <button className="btn btn-secondary refresh-btn" onClick={fetchTeams}>
          <HiOutlineRefresh />
          Refresh
        </button>
      </div>

      {teams.length === 0 ? (
        <div className="empty-state">
          <HiOutlineOfficeBuilding className="empty-icon" />
          <h3>No Teams Found</h3>
          <p>Create a team to get started with organizing your workforce.</p>
        </div>
      ) : (
        <div className="team-grid">
          {teams.map((team) => (
            <div key={team.id} className="team-card">
              <div className="team-card-header">
                <div className="team-icon">
                  <HiOutlineOfficeBuilding />
                </div>
                <span className="team-id">#{team.id}</span>
              </div>
              <h3 className="team-name">{team.name}</h3>
              <div className="team-lead-info">
                <HiOutlineUserCircle className="lead-icon" />
                <div className="lead-details">
                  <span className="lead-label">Team Lead</span>
                  <span className="lead-name">
                    {team.teamLead
                      ? `${team.teamLead.firstName} ${team.teamLead.lastName}`
                      : 'Not assigned'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamList;
