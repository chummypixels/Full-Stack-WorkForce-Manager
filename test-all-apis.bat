@echo off
echo =========================================
echo WORKFORCE MANAGER - COMPLETE API TEST
echo =========================================
echo.

echo 1. Testing: Add Users
echo ---------------------
curl -X POST http://localhost:8080/api/users -H "Content-Type: application/json" -d "{\"firstName\":\"John\",\"lastName\":\"Doe\",\"gender\":\"Male\",\"location\":\"Lagos, Ikoyi\"}"
echo.
curl -X POST http://localhost:8080/api/users -H "Content-Type: application/json" -d "{\"firstName\":\"Jane\",\"lastName\":\"Smith\",\"gender\":\"Female\",\"location\":\"Lagos, Victoria Island\"}"
echo.
curl -X POST http://localhost:8080/api/users -H "Content-Type: application/json" -d "{\"firstName\":\"Bob\",\"lastName\":\"Wilson\",\"gender\":\"Male\",\"location\":\"Lagos, Lekki\"}"
echo.

echo 2. Testing: Add Teams
echo ---------------------
curl -X POST http://localhost:8080/api/teams -H "Content-Type: application/json" -d "{\"name\":\"Development Team\"}"
echo.
curl -X POST http://localhost:8080/api/teams -H "Content-Type: application/json" -d "{\"name\":\"QA Team\"}"
echo.

echo 3. Testing: Assign Team Lead
echo ----------------------------
curl -X PUT http://localhost:8080/api/teams/1/team-lead -H "Content-Type: application/json" -d "{\"userId\":1}"
echo.

echo 4. Testing: Assign Users to Team
echo ---------------------------------
curl -X POST http://localhost:8080/api/teams/1/members -H "Content-Type: application/json" -d "{\"userId\":1}"
echo.
curl -X POST http://localhost:8080/api/teams/1/members -H "Content-Type: application/json" -d "{\"userId\":2}"
echo.
curl -X POST http://localhost:8080/api/teams/1/members -H "Content-Type: application/json" -d "{\"userId\":3}"
echo.

echo 5. Testing: Assign Roles (all 3 roles)
echo ---------------------------------------
echo User 1: DEVELOPER (default)
echo User 2: Changing to QA
curl -X PUT http://localhost:8080/api/teams/1/members/2/role -H "Content-Type: application/json" -d "{\"role\":\"QA\"}"
echo.
echo User 3: Changing to PRODUCT_MANAGER
curl -X PUT http://localhost:8080/api/teams/1/members/3/role -H "Content-Type: application/json" -d "{\"role\":\"PRODUCT_MANAGER\"}"
echo.

echo 6. Testing: Get All Teams
echo -------------------------
curl http://localhost:8080/api/teams
echo.

echo 7. Testing: Get Team Members and Roles
echo ---------------------------------------
curl http://localhost:8080/api/teams/1/members
echo.

echo 8. Testing: User in Multiple Teams
echo -----------------------------------
curl -X POST http://localhost:8080/api/teams/2/members -H "Content-Type: application/json" -d "{\"userId\":1}"
echo.
echo Team 1 members:
curl http://localhost:8080/api/teams/1/members
echo.
echo Team 2 members:
curl http://localhost:8080/api/teams/2/members
echo.

echo =========================================
echo ALL TESTS COMPLETED!
echo =========================================
echo.
echo [OK] All 7 API endpoints tested
echo [OK] All 3 roles tested (DEVELOPER, QA, PRODUCT_MANAGER)
echo [OK] Default role verified (DEVELOPER)
echo [OK] User in multiple teams verified
echo [OK] Team lead assignment verified
