import { useState } from 'react';
import { teamService } from '../../services/teamService';
import { HiOutlineCheckCircle, HiOutlineExclamationCircle } from 'react-icons/hi';

const AddTeam = () => {
  const [teamName, setTeamName] = useState('');
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    try {
      const response = await teamService.createTeam({ name: teamName });
      setAlert({
        type: 'success',
        message: `Team "${response.data.name}" created successfully!`,
      });
      setTeamName('');
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'Failed to create team. Please try again.',
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
            <label htmlFor="teamName" className="form-label">
              Team Name <span className="required">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              id="teamName"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="e.g., Development Team"
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Creating...
                </>
              ) : (
                'Create Team'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTeam;
