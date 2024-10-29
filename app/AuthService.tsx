import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://localhost:8082/api/auth/";

interface UserResponse {
  accessToken: string;
  [key: string]: any; // thêm các thuộc tính khác nếu cần
}

class AuthService {
  async login(username: string, password: string): Promise<UserResponse> {
    try {
      const response = await axios.post<UserResponse>(API_URL + "signin", { username, password });
      if (response.data.accessToken) {
        await AsyncStorage.setItem("user", JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await AsyncStorage.removeItem("user");
    } catch (error) {
      console.error("Failed to remove user data from storage", error);
    }
  }

  register(username: string, email: string, password: string): Promise<any> {
    return axios.post(API_URL + "signup", {
      username,
      email,
      password,
    });
  }

  async getCurrentUser(): Promise<UserResponse | null> {
    try {
      const user = await AsyncStorage.getItem("user");
      return user ? JSON.parse(user) as UserResponse : null;
    } catch (error) {
      console.error("Failed to get current user from storage", error);
      return null;
    }
  }
}

export default new AuthService();
