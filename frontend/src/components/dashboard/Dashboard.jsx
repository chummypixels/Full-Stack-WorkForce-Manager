import { useState } from 'react';
import Sidebar from '../common/Sidebar';
import AddUser from '../users/AddUser';
import AddTeam from '../teams/AddTeam';
import TeamList from '../teams/TeamList';
import AssignUser from '../teams/AssignUser';
import AssignTeamLead from '../teams/AssignTeamLead';
import AssignRole from '../teams/AssignRole';
import TeamMembers from '../teams/TeamMembers';
import {
  HiOutlineUserAdd,
  HiOutlineOfficeBuilding,
  HiOutlineUsers,
  HiOutlineUserCircle,
  HiOutlineBadgeCheck,
  HiOutlineClipboardList,
  HiOutlineUserGroup
} from 'react-icons/hi';

const Dashboard = () => {
  const [activeView, setActiveView] = useState('home');

  const cards = [
    {
      title: 'Add User',
      description: 'Create a new user in the system with their personal details',
      icon: HiOutlineUserAdd,
      view: 'addUser',
      color: '#4f46e5',
    },
    {
      title: 'Add Team',
      description: 'Create a new team to organize your workforce',
      icon: HiOutlineOfficeBuilding,
      view: 'addTeam',
      color: '#059669',
    },
    {
      title: 'Assign to Team',
      description: 'Add existing users to teams as members',
      icon: HiOutlineUsers,
      view: 'assignUser',
      color: '#0891b2',
    },
    {
      title: 'Assign Team Lead',
      description: 'Designate a user as the leader of a team',
      icon: HiOutlineUserCircle,
      view: 'assignTeamLead',
      color: '#7c3aed',
    },
    {
      title: 'Assign Role',
      description: 'Set roles for team members (Developer, QA, PM)',
      icon: HiOutlineBadgeCheck,
      view: 'assignRole',
      color: '#db2777',
    },
    {
      title: 'View Teams',
      description: 'Browse all teams and their current team leads',
      icon: HiOutlineClipboardList,
      view: 'viewTeams',
      color: '#ea580c',
    },
    {
      title: 'Team Members',
      description: 'View team members with their assigned roles',
      icon: HiOutlineUserGroup,
      view: 'viewTeamMembers',
      color: '#0d9488',
    },
  ];

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
          <div className="dashboard-home">
            <div className="dashboard-header">
              <h1>Welcome to Workforce Manager</h1>
              <p>Select an option from the sidebar or choose from the quick actions below</p>
            </div>

            <div className="feature-cards">
              {cards.map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.view}
                    className="feature-card"
                    onClick={() => setActiveView(card.view)}
                  >
                    <div
                      className="feature-card-icon"
                      style={{ backgroundColor: `${card.color}15`, color: card.color }}
                    >
                      <Icon />
                    </div>
                    <h3 className="feature-card-title">{card.title}</h3>
                    <p className="feature-card-description">{card.description}</p>
                    <button
                      className="btn btn-primary feature-card-btn"
                      style={{ backgroundColor: card.color, borderColor: card.color }}
                    >
                      Get Started
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );
    }
  };

  const getPageTitle = () => {
    const titles = {
      addUser: 'Add New User',
      addTeam: 'Create Team',
      assignUser: 'Assign User to Team',
      assignTeamLead: 'Assign Team Lead',
      assignRole: 'Assign Role',
      viewTeams: 'All Teams',
      viewTeamMembers: 'Team Members',
    };
    return titles[activeView] || '';
  };

  return (
    <div className="app-layout">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <main className="main-content">
        {activeView !== 'home' && (
          <div className="page-header">
            <button
              className="btn btn-secondary back-btn"
              onClick={() => setActiveView('home')}
            >
              <span>&larr;</span> Back to Dashboard
            </button>
            <h2 className="page-title">{getPageTitle()}</h2>
          </div>
        )}
        <div className="content-area">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
