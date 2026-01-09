import apiClient from './api';

export const teamService = {
  createTeam: (teamData) => apiClient.post('/api/teams', teamData),

  getAllTeams: () => apiClient.get('/api/teams'),

  getTeamById: (id) => apiClient.get(`/api/teams/${id}`),

  assignTeamLead: (teamId, userId) =>
    apiClient.put(`/api/teams/${teamId}/team-lead`, { userId }),

  assignUserToTeam: (teamId, userId) =>
    apiClient.post(`/api/teams/${teamId}/members`, { userId }),

  assignRole: (teamId, userId, role) =>
    apiClient.put(`/api/teams/${teamId}/members/${userId}/role`, { role }),

  getTeamMembers: (teamId) => apiClient.get(`/api/teams/${teamId}/members`),
};
