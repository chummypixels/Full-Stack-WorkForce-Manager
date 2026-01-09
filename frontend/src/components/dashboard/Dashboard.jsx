import { useState } from 'react';
import Layout from '../common/Layout';
import AddUser from '../users/AddUser';
import UserList from '../users/UserList';
import AddTeam from '../teams/AddTeam';
import TeamList from '../teams/TeamList';
import AssignUser from '../teams/AssignUser';
import AssignTeamLead from '../teams/AssignTeamLead';
import AssignRole from '../teams/AssignRole';
import TeamMembers from '../teams/TeamMembers';

const Dashboard = () => {
  const [activeView, setActiveView] = useState('home');

  const renderView = () => {
    switch (activeView) {
      case 'addUser':
        return <AddUser />;
      case 'addTeam':
        return <AddTeam />;
      case 'assignUser':
        return <AssignUser />;
      case 'assignTeamLead':
        return <AssignTeamLead />;
      case 'assignRole':
        return <AssignRole />;
      case 'viewTeams':
        return <TeamList />;
      case 'viewTeamMembers':
        return <TeamMembers />;
      default:
        return (
          <div className="row g-4">
            <div className="col-12">
              <h2 className="mb-4">Workforce Manager Dashboard</h2>
            </div>
            {cards.map((card, index) => (
              <div key={index} className="col-12 col-md-6 col-lg-4">
                <div
                  className="card shadow-sm h-100 hover-card"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setActiveView(card.view)}
                >
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{card.title}</h5>
                    <p className="card-text text-muted">{card.description}</p>
                    <button className="btn btn-primary mt-auto">
                      {card.buttonText}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
    }
  };

  const cards = [
    {
      title: 'Add User',
      description: 'Create a new user in the system',
      buttonText: 'Add User',
      view: 'addUser',
    },
    {
      title: 'Add Team',
      description: 'Create a new team',
      buttonText: 'Add Team',
      view: 'addTeam',
    },
    {
      title: 'Assign User to Team',
      description: 'Add a user to an existing team',
      buttonText: 'Assign User',
      view: 'assignUser',
    },
    {
      title: 'Assign Team Lead',
      description: 'Designate a team lead for a team',
      buttonText: 'Assign Team Lead',
      view: 'assignTeamLead',
    },
    {
      title: 'Assign Role',
      description: 'Assign a role to a team member',
      buttonText: 'Assign Role',
      view: 'assignRole',
    },
    {
      title: 'View Teams',
      description: 'See all teams and their details',
      buttonText: 'View Teams',
      view: 'viewTeams',
    },
    {
      title: 'View Team Members',
      description: 'See team members and their roles',
      buttonText: 'View Members',
      view: 'viewTeamMembers',
    },
  ];

  return (
    <Layout>
      {activeView !== 'home' && (
        <button
          className="btn btn-secondary mb-3"
          onClick={() => setActiveView('home')}
        >
          &larr; Back to Dashboard
        </button>
      )}
      {renderView()}
    </Layout>
  );
};

export default Dashboard;
