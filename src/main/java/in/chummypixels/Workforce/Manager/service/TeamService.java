package in.chummypixels.Workforce.Manager.service;

import in.chummypixels.Workforce.Manager.dto.TeamMemberResponse;
import in.chummypixels.Workforce.Manager.dto.TeamRequest;
import in.chummypixels.Workforce.Manager.dto.TeamResponse;
import in.chummypixels.Workforce.Manager.entity.Role;
import in.chummypixels.Workforce.Manager.entity.Team;
import in.chummypixels.Workforce.Manager.entity.TeamMember;
import in.chummypixels.Workforce.Manager.entity.User;
import in.chummypixels.Workforce.Manager.exception.DuplicateMemberException;
import in.chummypixels.Workforce.Manager.exception.ResourceNotFoundException;
import in.chummypixels.Workforce.Manager.repository.TeamMemberRepository;
import in.chummypixels.Workforce.Manager.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final UserService userService;

    @Transactional
    public TeamResponse createTeam(TeamRequest request) {
        Team team = new Team();
        team.setName(request.getName());

        Team savedTeam = teamRepository.save(team);
        return TeamResponse.fromEntity(savedTeam);
    }

    @Transactional(readOnly = true)
    public List<TeamResponse> getAllTeams() {
        return teamRepository.findAll().stream()
            .map(TeamResponse::fromEntity)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TeamResponse getTeamById(Long id) {
        Team team = teamRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Team not found with id: " + id));
        return TeamResponse.fromEntity(team);
    }

    @Transactional
    public TeamResponse assignTeamLead(Long teamId, Long userId) {
        Team team = teamRepository.findById(teamId)
            .orElseThrow(() -> new ResourceNotFoundException("Team not found with id: " + teamId));

        User user = userService.getUserEntity(userId);
        team.setTeamLead(user);

        Team savedTeam = teamRepository.save(team);
        return TeamResponse.fromEntity(savedTeam);
    }

    @Transactional
    public TeamMemberResponse assignUserToTeam(Long teamId, Long userId) {
        Team team = teamRepository.findById(teamId)
            .orElseThrow(() -> new ResourceNotFoundException("Team not found with id: " + teamId));

        User user = userService.getUserEntity(userId);

        if (teamMemberRepository.findByTeamIdAndUserId(teamId, userId).isPresent()) {
            throw new DuplicateMemberException("User is already a member of this team");
        }

        TeamMember teamMember = new TeamMember();
        teamMember.setTeam(team);
        teamMember.setUser(user);
        teamMember.setRole(Role.DEVELOPER);

        TeamMember savedMember = teamMemberRepository.save(teamMember);
        return TeamMemberResponse.fromEntity(savedMember);
    }

    @Transactional
    public TeamMemberResponse assignRole(Long teamId, Long userId, Role role) {
        TeamMember teamMember = teamMemberRepository.findByTeamIdAndUserId(teamId, userId)
            .orElseThrow(() -> new ResourceNotFoundException(
                "User is not a member of this team"));

        teamMember.setRole(role);
        TeamMember savedMember = teamMemberRepository.save(teamMember);
        return TeamMemberResponse.fromEntity(savedMember);
    }

    @Transactional(readOnly = true)
    public List<TeamMemberResponse> getTeamMembers(Long teamId) {
        if (!teamRepository.existsById(teamId)) {
            throw new ResourceNotFoundException("Team not found with id: " + teamId);
        }

        return teamMemberRepository.findByTeamId(teamId).stream()
            .map(TeamMemberResponse::fromEntity)
            .collect(Collectors.toList());
    }
}
