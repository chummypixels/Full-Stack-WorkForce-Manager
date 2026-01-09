package in.chummypixels.Workforce.Manager.controller;

import in.chummypixels.Workforce.Manager.dto.*;
import in.chummypixels.Workforce.Manager.entity.Role;
import in.chummypixels.Workforce.Manager.service.TeamService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TeamController.class)
class TeamControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TeamService teamService;

    private TeamResponse teamResponse;
    private TeamMemberResponse teamMemberResponse;
    private UserResponse userResponse;

    @BeforeEach
    void setUp() {
        userResponse = new UserResponse(1L, "John", "Doe", "Male", "Lagos, Ikoyi");
        teamResponse = new TeamResponse(1L, "Development Team", null);
        teamMemberResponse = new TeamMemberResponse(1L, userResponse, Role.DEVELOPER);
    }

    @Test
    void createTeam_ShouldReturnCreatedTeam() throws Exception {
        when(teamService.createTeam(any(TeamRequest.class))).thenReturn(teamResponse);

        mockMvc.perform(post("/api/teams")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"Development Team\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Development Team"));
    }

    @Test
    void getAllTeams_ShouldReturnTeamList() throws Exception {
        when(teamService.getAllTeams()).thenReturn(Arrays.asList(teamResponse));

        mockMvc.perform(get("/api/teams"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].name").value("Development Team"));
    }

    @Test
    void getTeamById_ShouldReturnTeam() throws Exception {
        when(teamService.getTeamById(1L)).thenReturn(teamResponse);

        mockMvc.perform(get("/api/teams/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Development Team"));
    }

    @Test
    void assignTeamLead_ShouldReturnUpdatedTeam() throws Exception {
        teamResponse.setTeamLead(userResponse);
        when(teamService.assignTeamLead(eq(1L), eq(1L))).thenReturn(teamResponse);

        mockMvc.perform(put("/api/teams/1/team-lead")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"userId\":1}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.teamLead.id").value(1));
    }

    @Test
    void assignUserToTeam_ShouldReturnTeamMember() throws Exception {
        when(teamService.assignUserToTeam(eq(1L), eq(1L))).thenReturn(teamMemberResponse);

        mockMvc.perform(post("/api/teams/1/members")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"userId\":1}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.user.id").value(1))
                .andExpect(jsonPath("$.role").value("DEVELOPER"));
    }

    @Test
    void assignRole_ShouldReturnUpdatedTeamMember() throws Exception {
        teamMemberResponse.setRole(Role.QA);
        when(teamService.assignRole(eq(1L), eq(1L), eq(Role.QA))).thenReturn(teamMemberResponse);

        mockMvc.perform(put("/api/teams/1/members/1/role")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"role\":\"QA\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role").value("QA"));
    }

    @Test
    void getTeamMembers_ShouldReturnMemberList() throws Exception {
        when(teamService.getTeamMembers(1L)).thenReturn(Arrays.asList(teamMemberResponse));

        mockMvc.perform(get("/api/teams/1/members"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].user.id").value(1))
                .andExpect(jsonPath("$[0].role").value("DEVELOPER"));
    }
}
