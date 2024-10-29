import React, { Component } from "react";
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity } from "react-native";
import AuthService from "./AuthService";

// Kiểm tra trường nhập liệu có rỗng hay không
const required = (value: string): string | undefined => {
  if (!value) {
    return "This field is required!";
  }
  return undefined; // Thay đổi từ null thành undefined
};

// Kiểm tra username có đủ độ dài yêu cầu không
const vusername = (value: string): string | undefined => {
  if (value.length < 3 || value.length > 20) {
    return "The username must be between 3 and 20 characters.";
  }
  return undefined; // Thay đổi từ null thành undefined
};

// Kiểm tra password có đủ độ dài yêu cầu không
const vpassword = (value: string): string | undefined => {
  if (value.length < 6 || value.length > 40) {
    return "The password must be between 6 and 40 characters.";
  }
  return undefined; // Thay đổi từ null thành undefined
};

interface State {
  username: string;
  email: string;
  password: string;
  errors: {
    username?: string;
    email?: string;
    password?: string;
  };
  successful: boolean;
  message: string;
}

class Register extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.handleRegister = this.handleRegister.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);

    this.state = {
      username: "",
      email: "",
      password: "",
      errors: {},
      successful: false,
      message: "",
    };
  }

  onChangeUsername(username: string) {
    this.setState({
      username,
      errors: { ...this.state.errors, username: vusername(username) }
    });
  }

  onChangeEmail(email: string) {
    this.setState({
      email,
      errors: { ...this.state.errors, email: required(email) }
    });
  }

  onChangePassword(password: string) {
    this.setState({
      password,
      errors: { ...this.state.errors, password: vpassword(password) }
    });
  }

  validateForm() {
    const errors = {
      username: vusername(this.state.username),
      email: required(this.state.email),
      password: vpassword(this.state.password),
    };
    this.setState({ errors });
    return !Object.values(errors).some((error) => error !== undefined);
  }

  handleRegister() {
    this.setState({
      message: "",
      successful: false,
    });

    if (this.validateForm()) {
      AuthService.register(this.state.username, this.state.email, this.state.password).then(
        (response) => {
          console.log("Đăng ký thành công"); 
          this.setState({
            message: response.data.message,
            successful: true,
          });
        },
        (error) => {
          const resMessage =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString();

          this.setState({
            successful: false,
            message: resMessage,
          });
        }
      );
    }
  }

  render() {
    const { errors } = this.state;

    return (
      <View style={styles.container}>
        <Text style={styles.header}>Sign Up</Text>

        <TextInput
          placeholder="Username"
          style={styles.input}
          onChangeText={this.onChangeUsername}
          value={this.state.username}
        />
        {errors.username && (
          <Text style={styles.errorText}>{errors.username}</Text>
        )}

        <TextInput
          placeholder="Email"
          style={styles.input}
          keyboardType="email-address"
          onChangeText={this.onChangeEmail}
          value={this.state.email}
        />
        {errors.email && (
          <Text style={styles.errorText}>{errors.email}</Text>
        )}

        <TextInput
          placeholder="Password"
          style={styles.input}
          secureTextEntry
          onChangeText={this.onChangePassword}
          value={this.state.password}
        />
        {errors.password && (
          <Text style={styles.errorText}>{errors.password}</Text>
        )}

        <TouchableOpacity style={styles.button} onPress={this.handleRegister}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        {this.state.message && (
          <Text style={this.state.successful ? styles.successText : styles.errorText}>
            {this.state.message}
          </Text>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: '#f8f9fa', // Thêm màu nền
  },
  header: {
    fontSize: 28,
    marginBottom: 24,
    textAlign: "center",
    fontWeight: 'bold',
    color: '#343a40', // Màu chữ
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5, // Bo góc
    marginBottom: 12,
    paddingHorizontal: 12,
    backgroundColor: '#ffffff', // Màu nền input
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
  },
  successText: {
    color: 'green',
    marginTop: 12,
  },
  button: {
    backgroundColor: '#007bff', // Màu nút
    paddingVertical: 12,
    borderRadius: 5, // Bo góc
    marginTop: 12,
  },
  buttonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default Register;
