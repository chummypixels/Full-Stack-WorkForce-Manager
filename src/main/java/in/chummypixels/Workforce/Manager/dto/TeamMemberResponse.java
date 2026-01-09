package in.chummypixels.Workforce.Manager.dto;

import in.chummypixels.Workforce.Manager.entity.Role;
import in.chummypixels.Workforce.Manager.entity.TeamMember;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TeamMemberResponse {
    private Long id;
    private UserResponse user;
    private Role role;

    public static TeamMemberResponse fromEntity(TeamMember teamMember) {
        return new TeamMemberResponse(
            teamMember.getId(),
            UserResponse.fromEntity(teamMember.getUser()),
            teamMember.getRole()
        );
    }
}
