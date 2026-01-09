package in.chummypixels.Workforce.Manager.dto;

import in.chummypixels.Workforce.Manager.entity.Team;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TeamResponse {
    private Long id;
    private String name;
    private UserResponse teamLead;

    public static TeamResponse fromEntity(Team team) {
        return new TeamResponse(
            team.getId(),
            team.getName(),
            team.getTeamLead() != null ? UserResponse.fromEntity(team.getTeamLead()) : null
        );
    }
}
