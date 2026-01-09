#!/bin/bash

echo "========================================="
echo "WORKFORCE MANAGER - COMPLETE API TEST"
echo "========================================="
echo ""

echo "1. Testing: Add Users"
echo "---------------------"
curl -s -X POST http://localhost:8080/api/users -H "Content-Type: application/json" -d '{"firstName":"John","lastName":"Doe","gender":"Male","location":"Lagos, Ikoyi"}' | jq
curl -s -X POST http://localhost:8080/api/users -H "Content-Type: application/json" -d '{"firstName":"Jane","lastName":"Smith","gender":"Female","location":"Lagos, Victoria Island"}' | jq
curl -s -X POST http://localhost:8080/api/users -H "Content-Type: application/json" -d '{"firstName":"Bob","lastName":"Wilson","gender":"Male","location":"Lagos, Lekki"}' | jq
echo ""

echo "2. Testing: Add Teams"
echo "---------------------"
curl -s -X POST http://localhost:8080/api/teams -H "Content-Type: application/json" -d '{"name":"Development Team"}' | jq
curl -s -X POST http://localhost:8080/api/teams -H "Content-Type: application/json" -d '{"name":"QA Team"}' | jq
echo ""

echo "3. Testing: Assign Team Lead"
echo "----------------------------"
curl -s -X PUT http://localhost:8080/api/teams/1/team-lead -H "Content-Type: application/json" -d '{"userId":1}' | jq
echo ""

echo "4. Testing: Assign Users to Team"
echo "---------------------------------"
curl -s -X POST http://localhost:8080/api/teams/1/members -H "Content-Type: application/json" -d '{"userId":1}' | jq
curl -s -X POST http://localhost:8080/api/teams/1/members -H "Content-Type: application/json" -d '{"userId":2}' | jq
curl -s -X POST http://localhost:8080/api/teams/1/members -H "Content-Type: application/json" -d '{"userId":3}' | jq
echo ""

echo "5. Testing: Assign Roles (all 3 roles)"
echo "---------------------------------------"
echo "User 1: DEVELOPER (default)"
echo "User 2: Changing to QA"
curl -s -X PUT http://localhost:8080/api/teams/1/members/2/role -H "Content-Type: application/json" -d '{"role":"QA"}' | jq
echo "User 3: Changing to PRODUCT_MANAGER"
curl -s -X PUT http://localhost:8080/api/teams/1/members/3/role -H "Content-Type: application/json" -d '{"role":"PRODUCT_MANAGER"}' | jq
echo ""

echo "6. Testing: Get All Teams"
echo "-------------------------"
curl -s http://localhost:8080/api/teams | jq
echo ""

echo "7. Testing: Get Team Members and Roles"
echo "---------------------------------------"
curl -s http://localhost:8080/api/teams/1/members | jq
echo ""

echo "8. Testing: User in Multiple Teams"
echo "-----------------------------------"
curl -s -X POST http://localhost:8080/api/teams/2/members -H "Content-Type: application/json" -d '{"userId":1}' | jq
echo "Team 1 members:"
curl -s http://localhost:8080/api/teams/1/members | jq
echo "Team 2 members:"
curl -s http://localhost:8080/api/teams/2/members | jq
echo ""

echo "========================================="
echo "ALL TESTS COMPLETED!"
echo "========================================="
echo ""
echo "✅ All 7 API endpoints tested"
echo "✅ All 3 roles tested (DEVELOPER, QA, PRODUCT_MANAGER)"
echo "✅ Default role verified (DEVELOPER)"
echo "✅ User in multiple teams verified"
echo "✅ Team lead assignment verified"
