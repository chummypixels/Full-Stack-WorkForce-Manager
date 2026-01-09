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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TeamServiceTest {

    @Mock
    private TeamRepository teamRepository;

    @Mock
    private TeamMemberRepository teamMemberRepository;

    @Mock
    private UserService userService;

    @InjectMocks
    private TeamService teamService;

    private Team testTeam;
    private User testUser;
    private TeamMember testTeamMember;

    @BeforeEach
    void setUp() {
        testUser = new User(1L, "John", "Doe", "Male", "Lagos, Ikoyi");
        testTeam = new Team(1L, "Development Team", null, null);
        testTeamMember = new TeamMember(1L, testTeam, testUser, Role.DEVELOPER);
    }

    @Test
    void createTeam_ShouldReturnTeamResponse() {
        TeamRequest request = new TeamRequest("Development Team");
        when(teamRepository.save(any(Team.class))).thenReturn(testTeam);

        TeamResponse response = teamService.createTeam(request);

        assertNotNull(response);
        assertEquals("Development Team", response.getName());
        verify(teamRepository, times(1)).save(any(Team.class));
    }

    @Test
    void getAllTeams_ShouldReturnListOfTeams() {
        Team team2 = new Team(2L, "QA Team", null, null);
        when(teamRepository.findAll()).thenReturn(Arrays.asList(testTeam, team2));

        List<TeamResponse> teams = teamService.getAllTeams();

        assertEquals(2, teams.size());
        verify(teamRepository, times(1)).findAll();
    }

    @Test
    void getTeamById_WhenTeamExists_ShouldReturnTeam() {
        when(teamRepository.findById(1L)).thenReturn(Optional.of(testTeam));

        TeamResponse response = teamService.getTeamById(1L);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Development Team", response.getName());
        verify(teamRepository, times(1)).findById(1L);
    }

    @Test
    void getTeamById_WhenTeamNotExists_ShouldThrowException() {
        when(teamRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> teamService.getTeamById(999L));
        verify(teamRepository, times(1)).findById(999L);
    }

    @Test
    void assignTeamLead_ShouldReturnTeamWithLead() {
        when(teamRepository.findById(1L)).thenReturn(Optional.of(testTeam));
        when(userService.getUserEntity(1L)).thenReturn(testUser);
        testTeam.setTeamLead(testUser);
        when(teamRepository.save(any(Team.class))).thenReturn(testTeam);

        TeamResponse response = teamService.assignTeamLead(1L, 1L);

        assertNotNull(response);
        assertNotNull(response.getTeamLead());
        assertEquals("John", response.getTeamLead().getFirstName());
        verify(teamRepository, times(1)).save(any(Team.class));
    }

    @Test
    void assignUserToTeam_WhenUserNotInTeam_ShouldAddMember() {
        when(teamRepository.findById(1L)).thenReturn(Optional.of(testTeam));
        when(userService.getUserEntity(1L)).thenReturn(testUser);
        when(teamMemberRepository.findByTeamIdAndUserId(1L, 1L)).thenReturn(Optional.empty());
        when(teamMemberRepository.save(any(TeamMember.class))).thenReturn(testTeamMember);

        TeamMemberResponse response = teamService.assignUserToTeam(1L, 1L);

        assertNotNull(response);
        assertEquals(Role.DEVELOPER, response.getRole());
        verify(teamMemberRepository, times(1)).save(any(TeamMember.class));
    }

    @Test
    void assignUserToTeam_WhenUserAlreadyInTeam_ShouldThrowException() {
        when(teamRepository.findById(1L)).thenReturn(Optional.of(testTeam));
        when(userService.getUserEntity(1L)).thenReturn(testUser);
        when(teamMemberRepository.findByTeamIdAndUserId(1L, 1L)).thenReturn(Optional.of(testTeamMember));

        assertThrows(DuplicateMemberException.class, () -> teamService.assignUserToTeam(1L, 1L));
        verify(teamMemberRepository, never()).save(any(TeamMember.class));
    }

    @Test
    void assignRole_WhenMemberExists_ShouldUpdateRole() {
        when(teamMemberRepository.findByTeamIdAndUserId(1L, 1L)).thenReturn(Optional.of(testTeamMember));
        when(teamMemberRepository.save(any(TeamMember.class))).thenReturn(testTeamMember);

        TeamMemberResponse response = teamService.assignRole(1L, 1L, Role.QA);

        assertNotNull(response);
        verify(teamMemberRepository, times(1)).save(any(TeamMember.class));
    }

    @Test
    void assignRole_WhenMemberNotExists_ShouldThrowException() {
        when(teamMemberRepository.findByTeamIdAndUserId(1L, 1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> teamService.assignRole(1L, 1L, Role.QA));
        verify(teamMemberRepository, never()).save(any(TeamMember.class));
    }

    @Test
    void getTeamMembers_WhenTeamExists_ShouldReturnMembers() {
        when(teamRepository.existsById(1L)).thenReturn(true);
        when(teamMemberRepository.findByTeamId(1L)).thenReturn(Arrays.asList(testTeamMember));

        List<TeamMemberResponse> members = teamService.getTeamMembers(1L);

        assertEquals(1, members.size());
        verify(teamMemberRepository, times(1)).findByTeamId(1L);
    }

    @Test
    void getTeamMembers_WhenTeamNotExists_ShouldThrowException() {
        when(teamRepository.existsById(999L)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> teamService.getTeamMembers(999L));
        verify(teamMemberRepository, never()).findByTeamId(anyLong());
    }
}
