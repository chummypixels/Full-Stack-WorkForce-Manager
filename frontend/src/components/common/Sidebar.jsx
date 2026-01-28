import {
  HiOutlineViewGrid,
  HiOutlineUserAdd,
  HiOutlineUserGroup,
  HiOutlineUsers,
  HiOutlineUserCircle,
  HiOutlineBadgeCheck,
  HiOutlineClipboardList,
  HiOutlineLogout,
  HiOutlineOfficeBuilding
} from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ activeView, setActiveView }) => {
  const { user, logout } = useAuth();

  const menuItems = [
    { id: 'home', label: 'Dashboard', icon: HiOutlineViewGrid },
    { id: 'divider1', type: 'divider', label: 'User Management' },
    { id: 'addUser', label: 'Add User', icon: HiOutlineUserAdd },
    { id: 'divider2', type: 'divider', label: 'Team Management' },
    { id: 'addTeam', label: 'Add Team', icon: HiOutlineOfficeBuilding },
    { id: 'viewTeams', label: 'View Teams', icon: HiOutlineClipboardList },
    { id: 'assignUser', label: 'Assign to Team', icon: HiOutlineUsers },
    { id: 'assignTeamLead', label: 'Assign Team Lead', icon: HiOutlineUserCircle },
    { id: 'assignRole', label: 'Assign Role', icon: HiOutlineBadgeCheck },
    { id: 'viewTeamMembers', label: 'Team Members', icon: HiOutlineUserGroup },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">
          <HiOutlineUserGroup />
        </div>
        <span className="sidebar-brand-text">Workforce</span>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          if (item.type === 'divider') {
            return (
              <div key={item.id} className="sidebar-section-title">
                {item.label}
              </div>
            );
          }

          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`sidebar-link ${activeView === item.id ? 'active' : ''}`}
              onClick={() => setActiveView(item.id)}
            >
              <Icon className="sidebar-link-icon" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-user">
        <div className="sidebar-user-info">
          <div className="sidebar-user-avatar">
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <div className="sidebar-user-name">{user?.username || 'User'}</div>
            <div className="sidebar-user-role">Administrator</div>
          </div>
        </div>
        <div className="sidebar-logout">
          <button onClick={logout}>
            <HiOutlineLogout />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
