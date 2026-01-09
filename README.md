# Workforce Manager

Backend REST API solution for managing users and teams using Spring Boot and Java 17.

## Table of Contents
- [Overview](#overview)
- [Technologies](#technologies)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Getting Started](#getting-started)
- [Running with Docker](#running-with-docker)
- [Testing](#testing)
- [Project Structure](#project-structure)

## Overview

This application implements the following requirements:

**Data Model:**
- User: id, first name, last name, gender, location
- Team: id, name, team lead, team members
- Each user can be part of zero or more teams
- Each team has one user as a team lead
- Each team member has a role (Developer, QA, Product Manager)
- Developer is the default role

**Implemented APIs:**
1. Add user
2. Add team
3. Assign user to team
4. Assign team lead to team
5. Assign role to team member
6. Get teams
7. Get team members and their roles

## Technologies

- **Java 17**
- **Spring Boot 3.5.8**
- **Spring Data JPA**
- **H2 Database** (in-memory)
- **Lombok** (reduces boilerplate code)
- **Gradle** (build tool)
- **JUnit 5 & Mockito** (testing)
- **Docker** (containerization)

## Database Schema

### Tables

**users**
- `id` (BIGINT, Primary Key, Auto-increment)
- `first_name` (VARCHAR, NOT NULL)
- `last_name` (VARCHAR, NOT NULL)
- `gender` (VARCHAR, NOT NULL)
- `location` (VARCHAR, NOT NULL)

**teams**
- `id` (BIGINT, Primary Key, Auto-increment)
- `name` (VARCHAR, NOT NULL)
- `team_lead_id` (BIGINT, Foreign Key to users)

**team_members**
- `id` (BIGINT, Primary Key, Auto-increment)
- `team_id` (BIGINT, Foreign Key to teams, NOT NULL)
- `user_id` (BIGINT, Foreign Key to users, NOT NULL)
- `role` (VARCHAR, NOT NULL, Default: 'DEVELOPER')
- Unique constraint on (team_id, user_id)

### Relationships
- Team has many TeamMembers (One-to-Many)
- Team has one TeamLead (Many-to-One with User)
- TeamMember references Team and User (Many-to-One)

## API Endpoints

### User Management

#### Create User
```
POST /api/users
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "gender": "Male",
  "location": "Lagos, Ikoyi"
}

Response: 201 Created
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "gender": "Male",
  "location": "Lagos, Ikoyi"
}
```

#### Get All Users
```
GET /api/users

Response: 200 OK
[
  {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "gender": "Male",
    "location": "Lagos, Ikoyi"
  }
]
```

#### Get User by ID
```
GET /api/users/{id}

Response: 200 OK
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "gender": "Male",
  "location": "Lagos, Ikoyi"
}
```

### Team Management

#### Create Team
```
POST /api/teams
Content-Type: application/json

{
  "name": "Development Team"
}

Response: 201 Created
{
  "id": 1,
  "name": "Development Team",
  "teamLead": null
}
```

#### Get All Teams
```
GET /api/teams

Response: 200 OK
[
  {
    "id": 1,
    "name": "Development Team",
    "teamLead": {
      "id": 1,
      "firstName": "John",
      "lastName": "Doe",
      "gender": "Male",
      "location": "Lagos, Ikoyi"
    }
  }
]
```

#### Get Team by ID
```
GET /api/teams/{id}

Response: 200 OK
{
  "id": 1,
  "name": "Development Team",
  "teamLead": null
}
```

#### Assign Team Lead
```
PUT /api/teams/{teamId}/team-lead
Content-Type: application/json

{
  "userId": 1
}

Response: 200 OK
{
  "id": 1,
  "name": "Development Team",
  "teamLead": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "gender": "Male",
    "location": "Lagos, Ikoyi"
  }
}
```

#### Assign User to Team
```
POST /api/teams/{teamId}/members
Content-Type: application/json

{
  "userId": 1
}

Response: 201 Created
{
  "id": 1,
  "user": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "gender": "Male",
    "location": "Lagos, Ikoyi"
  },
  "role": "DEVELOPER"
}
```

#### Assign Role to Team Member
```
PUT /api/teams/{teamId}/members/{userId}/role
Content-Type: application/json

{
  "role": "QA"
}

Response: 200 OK
{
  "id": 1,
  "user": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "gender": "Male",
    "location": "Lagos, Ikoyi"
  },
  "role": "QA"
}
```

Available roles: `DEVELOPER`, `QA`, `PRODUCT_MANAGER`

#### Get Team Members
```
GET /api/teams/{teamId}/members

Response: 200 OK
[
  {
    "id": 1,
    "user": {
      "id": 1,
      "firstName": "John",
      "lastName": "Doe",
      "gender": "Male",
      "location": "Lagos, Ikoyi"
    },
    "role": "DEVELOPER"
  }
]
```

### Error Responses

**404 Not Found**
```json
{
  "timestamp": "2025-11-26T10:30:00",
  "status": 404,
  "error": "Not Found",
  "message": "User not found with id: 999"
}
```

**409 Conflict**
```json
{
  "timestamp": "2025-11-26T10:30:00",
  "status": 409,
  "error": "Conflict",
  "message": "User is already a member of this team"
}
```

## Getting Started

### Prerequisites
- Java 17 or higher
- Gradle 8.x (or use the included Gradle wrapper)

### Running Locally

```bash
cd Workforce-Manager
```

2. Build the project
```bash
./gradlew clean build
```

3. Run the application
```bash
./gradlew bootRun
```

The application will start on `http://localhost:8080`

### Accessing H2 Console

The H2 database console is available at `http://localhost:8080/h2-console`

Connection details:
- JDBC URL: `jdbc:h2:mem:workforcedb`
- Username: `chummy`
- Password: (leave empty)

## Running with Docker

### Build Docker Image
```bash
docker build -t workforce-manager:latest .
```

### Run Docker Container
```bash
docker run -p 8080:8080 workforce-manager:latest
```

The application will be accessible at `http://localhost:8080`

## Testing

### Quick API Testing

A complete test script is provided to test all 7 REST APIs:

**Windows:**
```bash
./test-all-apis.bat
```

**Linux/Mac:**
```bash
./test-all-apis.sh
```

This script will:
- Create sample users and teams
- Test all API endpoints
- Verify all 3 roles (DEVELOPER, QA, PRODUCT_MANAGER)
- Demonstrate users in multiple teams
- Show default role assignment

### Run Unit Tests
```bash
./gradlew test
```

### Run Specific Test Class
```bash
./gradlew test --tests UserServiceTest
```

### Test Coverage

The project includes comprehensive unit tests for:
- **Service Layer**: Business logic and data operations
- **Controller Layer**: REST API endpoints and HTTP interactions (following feedback from the initial interview)

Test frameworks used:
- JUnit 5 for test execution
- Mockito for mocking dependencies
- Spring MockMvc for controller testing


## Architecture & Design

### Layered Architecture
The application follows a standard Spring Boot layered architecture:

1. **Controller Layer**: Handles HTTP requests and responses
2. **Service Layer**: Contains business logic and transaction management
3. **Repository Layer**: Manages database operations using Spring Data JPA
4. **Entity Layer**: JPA entities representing database tables
5. **DTO Layer**: Data transfer objects for API requests/responses

### Design Patterns Used
- **Repository Pattern**: Data access abstraction
- **DTO Pattern**: Separating domain models from API contracts
- **Dependency Injection**: Spring's IoC container
- **Builder Pattern**: Lombok's @Data annotation

### Key Design Decisions

1. **Separate TeamMember Entity**: Instead of directly mapping Many-to-Many between User and Team, a separate TeamMember entity allows storing additional information (role) for each team membership.

2. **Role as Enum**: Predefined roles are implemented as an enum to ensure type safety and validation.

3. **Default Role**: Developer role is set as default when assigning users to teams.

4. **Unique Constraint**: Database constraint prevents duplicate team memberships.

5. **Transaction Management**: Service methods use @Transactional for data consistency.

## API Testing with cURL

### Create a User
```bash
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","gender":"Male","location":"Lagos, Ikoyi"}'
```

### Create a Team
```bash
curl -X POST http://localhost:8080/api/teams \
  -H "Content-Type: application/json" \
  -d '{"name":"Development Team"}'
```

### Assign Team Lead
```bash
curl -X PUT http://localhost:8080/api/teams/1/team-lead \
  -H "Content-Type: application/json" \
  -d '{"userId":1}'
```

### Assign User to Team
```bash
curl -X POST http://localhost:8080/api/teams/1/members \
  -H "Content-Type: application/json" \
  -d '{"userId":1}'
```

### Assign Role
```bash
curl -X PUT http://localhost:8080/api/teams/1/members/1/role \
  -H "Content-Type: application/json" \
  -d '{"role":"QA"}'
```

---

## Frontend Application

A React-based web application that provides a user interface for managing users and teams.

### Frontend Tech Stack

- **React 18** with Vite
- **Bootstrap 5** for styling
- **Axios** for API calls
- **Docker** for containerization
- **Nginx** for serving in production

### Frontend Features

1. **Mock Authentication** - Simple login page (any username/password accepted)
2. **Dashboard** - Central hub with 7 feature cards
3. **User Management**:
   - Add new users
   - View all users
4. **Team Management**:
   - Create teams
   - View all teams with team leads
   - Assign users to teams
   - Assign team leads
   - Assign roles to team members
   - View team members with their roles

### Development Setup

#### Prerequisites
- Node.js 20 or higher
- npm 9 or higher

#### Running Frontend in Development Mode

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at `http://localhost:5173`

**Note:** Please make sure the backend is running on `http://localhost:8080` before starting the frontend.

### Production Deployment with Docker Compose

The entire application (frontend + backend) can be run with a single command:

```bash
# From the project root directory
docker-compose up --build
```

This will:
- Build and start the backend on `http://localhost:8080`
- Build and start the frontend on `http://localhost:3000`
- Configure networking between containers

**Access Points:**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **H2 Console**: http://localhost:8080/h2-console

To stop the application:
```bash
docker-compose down
```
### Environment Variables

The frontend uses environment variables for configuration:

**Development (.env):**
```env
VITE_API_BASE_URL=http://localhost:8080
```

**Production (docker-compose.yml):**
```yaml
environment:
  - VITE_API_BASE_URL=http://localhost:8080
```

### API Integration

The frontend communicates with the backend REST API using Axios. All API calls are centralized in the `services/` directory:

- **api.js**: Axios instance with base URL and error interceptors
- **userService.js**: User-related API calls
- **teamService.js**: Team-related API calls

### Authentication Flow

1. User lands on Login page
2. User enters any username/password (mock authentication)
3. On login, user is redirected to Dashboard
4. Dashboard displays 7 feature cards
5. Clicking any card navigates to that feature
6. User can logout via Navbar

### Responsive Design

The application is fully responsive using Bootstrap's grid system:
- **Mobile**: Single column layout
- **Tablet**: 2-column grid
- **Desktop**: 3-column grid

### Browser Support

- Chrome (latest)
- Firefox (latest)
- Edge (latest)
- Safari (latest)
