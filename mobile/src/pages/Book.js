import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import api from '../services/api';

import ModalSpinner from '../components/ModalSpinner';

export default function Book({ navigation }) {
  const [date, setDate] = useState('');
  const [isLoading, setLoading] = useState(false);
  const id = navigation.getParam('id');

  async function handleSubmit() {
    try {
      setLoading(true);
      await api.post(`/spots/${id}/bookings`, { date });
      setLoading(false);
      Alert.alert('Agora é só esperar!', 'Solicitação de reserva enviada!', [
        {
          text: 'ok',
          onPress: () => {
            navigation.navigate('List');
          },
        },
      ]);
    } catch (error) {
      setLoading(false);
      if (error.response) {
        if (error.response.status !== 401) {
          return Alert.alert('Ops!', 'Um erro aconteceu, tente novamente!');
        }
      }
      return Alert.alert('Ops!', 'Ocorreu um erro, tente novamente!');
    }
  }

  function handleCancel() {
    navigation.navigate('List');
  }

  return (
    <SafeAreaView>
      <ModalSpinner show={isLoading} />
      <View style={styles.container}>
        <Text style={styles.label}>DATA DE INTERESSE</Text>
        <TextInput
          style={styles.input}
          placeholder="Qual data você quer reservar?"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="words"
          autoCorrect={false}
          value={date}
          onChangeText={setDate}
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Solicitar reserva</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={handleCancel}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 30,
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
  cancelButton: {
    marginTop: 10,
    backgroundColor: '#999',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
