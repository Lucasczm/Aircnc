import React, { useState, useEffect } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import api from '../services/api';

import logo from '../assets/logo.png';
import ModalSpinner from '../components/ModalSpinner';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('email').then(userEmail => {
      if (userEmail) {
        setEmail(userEmail);
      }
    });
    AsyncStorage.getItem('userToken').then(user => {
      if (user) {
        navigation.navigate('Bookings');
      }
    });
  }, [navigation]);

  async function handleSubmit() {
    try {
      if (email === '' || password === '') {
        return Alert.alert('Ops!', 'E-mail ou senha são inválidos');
      }
      AsyncStorage.setItem('email', email);
      setLoading(true);
      const response = await api.post('/sessions', { email, password });
      const { token } = response.data;
      AsyncStorage.setItem('userToken', token);
      setLoading(false);
      navigation.navigate('List');
    } catch (error) {
      setLoading(false);
      if (error.response) {
        if (error.response.status === 401) {
          return Alert.alert('Ops!', 'E-mail ou senha são inválidos');
        }
      }
      return Alert.alert('Ops!', 'Ocorreu um erro, tente novamente!');
    }
  }

  return (
    <KeyboardAvoidingView
      enabled={Platform.OS === 'ios'}
      behaviour="padding"
      style={styles.container}>
      <ModalSpinner show={isLoading} />
      <Image source={logo} />
      <View style={styles.form}>
        <Text style={styles.label}>SEU E-MAIL</Text>
        <TextInput
          style={styles.input}
          placeholder="Seu email"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
        />
        <Text style={styles.label}>SENHA</Text>
        <TextInput
          style={styles.input}
          placeholder="Sua senha"
          placeholderTextColor="#999"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          onPress={() => navigation.navigate('RecoverPassword')}>
          <Text style={[styles.discreteButton, styles.recoverPasswordText]}>
            Esqueceu a senha?
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>ENTRAR</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.discreteButton}>Criar uma conta</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    alignSelf: 'stretch',
    paddingHorizontal: 30,
    marginTop: 30,
  },
  label: {
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#444',
    height: 44,
    marginBottom: 20,
    borderRadius: 2,
  },
  button: {
    height: 42,
    backgroundColor: '#f05a5b',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  discreteButton: {
    alignSelf: 'center',
    marginTop: 20,
    color: '#999',
  },
  recoverPasswordText: {
    marginTop: -15,
    marginBottom: 20,
    alignSelf: 'flex-end',
  },
});
