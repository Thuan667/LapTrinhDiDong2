import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AuthService from '../AuthService';

const Login = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    setMessage('');
    setLoading(true);

    try {
      const response = await AuthService.login(username, password);
      console.log("Đăng nhập thành công", "Chào mừng bạn quay lại!");
      navigation.navigate('index'); // Chuyển đến màn hình Home sau khi đăng nhập thành công
    } catch (error) {
      const resMessage = 
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra. Vui lòng thử lại!";
      setMessage(resMessage);
      console.log("Đăng nhập thất bại", resMessage);
    } finally {
      setLoading(false);
    }
  };

  const navigateToRegister = () => {
    navigation.navigate('Register'); // Chuyển đến màn hình Register
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Đăng Nhập</Text>
      <TextInput
        placeholder="Tên đăng nhập"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Mật khẩu"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Đăng nhập</Text>
        )}
      </TouchableOpacity>
      {message ? <Text style={styles.errorText}>{message}</Text> : null}
      <Text style={styles.forgotPasswordText}>Bạn chưa có tài khoản?</Text>
      <TouchableOpacity onPress={navigateToRegister}>
        <Text style={styles.registerText}>Đăng ký ngay</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 28,
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#343a40',
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    paddingHorizontal: 12,
    backgroundColor: '#ffffff',
  },
  button: {
    backgroundColor: '#dc3545', // Màu đỏ
    paddingVertical: 12,
    borderRadius: 5,
    marginTop: 12,
  },
  buttonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  forgotPasswordText: {
    textAlign: 'center',
    marginTop: 12,
    color: '#343a40',
  },
  registerText: {
    textAlign: 'center',
    color: '#dc3545', // Màu đỏ
    fontWeight: 'bold',
    marginTop: 4,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default Login;
