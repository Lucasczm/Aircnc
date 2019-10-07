import React, { useState } from 'react';
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

import api from '../services/api';

import logo from '../assets/logo.png';
import ModalSpinner from '../components/ModalSpinner';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [isLoading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    try {
      await api.post('/recover', { email });
      setLoading(false);
      Alert.alert(
        'Falta pouco!',
        'Foi enviado um e-mail com os passos da recuperação de senha. Verifique também no seu span :D',
      );
      navigation.navigate('Login');
    } catch (error) {
      if (error.response) {
        setLoading(false);
        if (error.response) {
          if (error.response.status === 404) {
            return Alert.alert('Ops!', 'E-mail não cadastrado');
          } else if (error.response.status !== 401) {
            return Alert.alert('Ops!', 'Um erro aconteceu, tente novamente!');
          }
        }
        return Alert.alert('Ops!', 'Um erro aconteceu, tente novamente!');
      }
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
        <Text style={styles.label}>
          Digite seu email para recuperar sua senha
        </Text>
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

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>CONTINUAR</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.backButton]}
          onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}>VOLTAR</Text>
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
    fontSize: 18,
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
  backButton: {
    marginTop: 20,
    backgroundColor: '#999',
  },
});
