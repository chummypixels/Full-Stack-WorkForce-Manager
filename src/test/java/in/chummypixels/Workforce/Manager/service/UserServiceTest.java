package in.chummypixels.Workforce.Manager.service;

import in.chummypixels.Workforce.Manager.dto.UserRequest;
import in.chummypixels.Workforce.Manager.dto.UserResponse;
import in.chummypixels.Workforce.Manager.entity.User;
import in.chummypixels.Workforce.Manager.exception.ResourceNotFoundException;
import in.chummypixels.Workforce.Manager.repository.UserRepository;
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
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private User testUser;
    private UserRequest userRequest;

    @BeforeEach
    void setUp() {
        testUser = new User(1L, "John", "Doe", "Male", "Lagos, Ikoyi");
        userRequest = new UserRequest("John", "Doe", "Male", "Lagos, Ikoyi");
    }

    @Test
    void createUser_ShouldReturnUserResponse() {
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        UserResponse response = userService.createUser(userRequest);

        assertNotNull(response);
        assertEquals("John", response.getFirstName());
        assertEquals("Doe", response.getLastName());
        assertEquals("Male", response.getGender());
        assertEquals("Lagos, Ikoyi", response.getLocation());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void getAllUsers_ShouldReturnListOfUsers() {
        User user2 = new User(2L, "Jane", "Smith", "Female", "Lagos, Victoria Island");
        when(userRepository.findAll()).thenReturn(Arrays.asList(testUser, user2));

        List<UserResponse> users = userService.getAllUsers();

        assertEquals(2, users.size());
        verify(userRepository, times(1)).findAll();
    }

    @Test
    void getUserById_WhenUserExists_ShouldReturnUser() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        UserResponse response = userService.getUserById(1L);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("John", response.getFirstName());
        verify(userRepository, times(1)).findById(1L);
    }

    @Test
    void getUserById_WhenUserNotExists_ShouldThrowException() {
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> userService.getUserById(999L));
        verify(userRepository, times(1)).findById(999L);
    }

    @Test
    void getUserEntity_WhenUserExists_ShouldReturnUser() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        User user = userService.getUserEntity(1L);

        assertNotNull(user);
        assertEquals(1L, user.getId());
        verify(userRepository, times(1)).findById(1L);
    }

    @Test
    void getUserEntity_WhenUserNotExists_ShouldThrowException() {
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> userService.getUserEntity(999L));
        verify(userRepository, times(1)).findById(999L);
    }
}
