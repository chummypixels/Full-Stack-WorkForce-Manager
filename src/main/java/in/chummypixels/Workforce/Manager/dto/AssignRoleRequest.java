package in.chummypixels.Workforce.Manager.dto;

import in.chummypixels.Workforce.Manager.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssignRoleRequest {
    private Role role;
}
