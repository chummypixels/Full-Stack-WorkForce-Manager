import { useState, useEffect } from 'react';
import { teamService } from '../../services/teamService';

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
      <div className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div>
      <h3 className="mb-4">All Teams</h3>

      {teams.length === 0 ? (
        <div className="alert alert-info" role="alert">
          No teams found. Create a team to get started.
        </div>
      ) : (
        <div className="row g-4">
          {teams.map((team) => (
            <div key={team.id} className="col-12 col-md-6 col-lg-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">{team.name}</h5>
                  <p className="card-text text-muted">
                    <strong>Team Lead:</strong>{' '}
                    {team.teamLead
                      ? `${team.teamLead.firstName} ${team.teamLead.lastName}`
                      : 'Not assigned'}
                  </p>
                  <span className="badge bg-secondary">ID: {team.id}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button className="btn btn-secondary mt-4" onClick={fetchTeams}>
        Refresh
      </button>
    </div>
  );
};

export default TeamList;
