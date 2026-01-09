package in.chummypixels.Workforce.Manager.dto;

import in.chummypixels.Workforce.Manager.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String gender;
    private String location;

    public static UserResponse fromEntity(User user) {
        return new UserResponse(
            user.getId(),
            user.getFirstName(),
            user.getLastName(),
            user.getGender(),
            user.getLocation()
        );
    }
}
