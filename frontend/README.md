# Workforce Manager Frontend

A React-based web application for managing users and teams, built with Vite and Bootstrap.

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Bootstrap 5** - CSS framework
- **Axios** - HTTP client
- **Docker + Nginx** - Production deployment

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm 9 or higher
- Backend API running on http://localhost:8080

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

Application will be available at http://localhost:5173

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── auth/
│   │   └── Login.jsx              # Login page with mock authentication
│   ├── common/
│   │   ├── Layout.jsx             # Common layout wrapper
│   │   └── Navbar.jsx             # Navigation bar with logout
│   ├── dashboard/
│   │   └── Dashboard.jsx          # Main dashboard with 7 feature cards
│   ├── users/
│   │   ├── AddUser.jsx            # Create new user form
│   │   └── UserList.jsx           # Display all users
│   └── teams/
│       ├── AddTeam.jsx            # Create new team form
│       ├── TeamList.jsx           # Display all teams
│       ├── AssignUser.jsx         # Assign user to team
│       ├── AssignTeamLead.jsx     # Assign team lead
│       ├── AssignRole.jsx         # Assign role to team member
│       └── TeamMembers.jsx        # View team members and roles
├── services/
│   ├── api.js                     # Axios configuration
│   ├── userService.js             # User API endpoints
│   └── teamService.js             # Team API endpoints
├── context/
│   └── AuthContext.jsx            # Authentication state management
├── App.jsx                        # Root component
├── main.jsx                       # Application entry point
└── index.css                      # Global styles (includes Bootstrap)
```

## Features

### 1. Authentication
- Simple mock login (any username/password accepted)
- Session state managed with React Context
- Logout functionality

### 2. Dashboard
- Central hub with 7 feature cards
- Responsive grid layout
- Navigation to all features

### 3. User Management
- **Add User**: Create users with first name, last name, gender, and location
- **View Users**: Display all users in a table

### 4. Team Management
- **Add Team**: Create new teams
- **View Teams**: Display all teams with team leads
- **Assign User**: Add users to teams (with duplicate prevention)
- **Assign Team Lead**: Designate team lead
- **Assign Role**: Set member roles (DEVELOPER, QA, PRODUCT_MANAGER)
- **View Members**: Display team members with their roles

## API Integration

### Configuration

API base URL is configured via environment variable:

```env
VITE_API_BASE_URL=http://localhost:8080
```

### Service Layer

All API calls are centralized in the `services/` directory:

**api.js** - Axios instance with:
- Base URL configuration
- Response/error interceptors
- JSON content-type header

**userService.js** - User endpoints:
- `createUser(userData)` - POST /api/users
- `getAllUsers()` - GET /api/users
- `getUserById(id)` - GET /api/users/{id}

**teamService.js** - Team endpoints:
- `createTeam(teamData)` - POST /api/teams
- `getAllTeams()` - GET /api/teams
- `getTeamById(id)` - GET /api/teams/{id}
- `assignTeamLead(teamId, userId)` - PUT /api/teams/{teamId}/team-lead
- `assignUserToTeam(teamId, userId)` - POST /api/teams/{teamId}/members
- `assignRole(teamId, userId, role)` - PUT /api/teams/{teamId}/members/{userId}/role
- `getTeamMembers(teamId)` - GET /api/teams/{teamId}/members

## State Management

### AuthContext

Global authentication state using React Context API:

```jsx
const { isAuthenticated, user, login, logout } = useAuth();
```

**Methods:**
- `login(username)` - Set authentication state
- `logout()` - Clear authentication state

**State:**
- `isAuthenticated` - Boolean auth status
- `user` - Current user object with username

## Styling

### Bootstrap

Bootstrap 5 is imported globally in `index.css`:

```css
@import 'bootstrap/dist/css/bootstrap.min.css';
```

### Responsive Design

- **Mobile (< 768px)**: Single column layout
- **Tablet (768px - 991px)**: 2-column grid
- **Desktop (≥ 992px)**: 3-column grid

## Docker Deployment

### Dockerfile

Multi-stage build for optimized production image:

**Stage 1** - Build:
- Base: node:20-alpine
- Install dependencies with `npm ci`
- Build application with `npm run build`

**Stage 2** - Production:
- Base: nginx:alpine
- Copy built files to nginx html directory
- Copy custom nginx configuration
- Expose port 80

## Troubleshooting

### CORS Errors

If you see CORS errors:
1. Ensure backend is running on http://localhost:8080
2. Verify CorsConfig.java includes your frontend URL
3. Restart backend after CORS changes

### API Connection Failed

1. Check backend is running: `curl http://localhost:8080/api/users`
2. Verify VITE_API_BASE_URL in .env
3. Check browser console for network errors

## Browser Support

- Chrome 90+
- Firefox 88+
- Edge 90+
- Safari 14+
