package in.chummypixels.Workforce.Manager.controller;

import in.chummypixels.Workforce.Manager.dto.*;
import in.chummypixels.Workforce.Manager.service.TeamService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
public class TeamController {

    private final TeamService teamService;

    @PostMapping
    public ResponseEntity<TeamResponse> createTeam(@RequestBody TeamRequest request) {
        TeamResponse response = teamService.createTeam(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<TeamResponse>> getAllTeams() {
        List<TeamResponse> teams = teamService.getAllTeams();
        return ResponseEntity.ok(teams);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TeamResponse> getTeamById(@PathVariable("id") Long id) {
        TeamResponse response = teamService.getTeamById(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{teamId}/team-lead")
    public ResponseEntity<TeamResponse> assignTeamLead(
            @PathVariable("teamId") Long teamId,
            @RequestBody AssignUserRequest request) {
        TeamResponse response = teamService.assignTeamLead(teamId, request.getUserId());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{teamId}/members")
    public ResponseEntity<TeamMemberResponse> assignUserToTeam(
            @PathVariable("teamId") Long teamId,
            @RequestBody AssignUserRequest request) {
        TeamMemberResponse response = teamService.assignUserToTeam(teamId, request.getUserId());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{teamId}/members/{userId}/role")
    public ResponseEntity<TeamMemberResponse> assignRole(
            @PathVariable("teamId") Long teamId,
            @PathVariable("userId") Long userId,
            @RequestBody AssignRoleRequest request) {
        TeamMemberResponse response = teamService.assignRole(teamId, userId, request.getRole());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{teamId}/members")
    public ResponseEntity<List<TeamMemberResponse>> getTeamMembers(@PathVariable("teamId") Long teamId) {
        List<TeamMemberResponse> members = teamService.getTeamMembers(teamId);
        return ResponseEntity.ok(members);
    }
}
