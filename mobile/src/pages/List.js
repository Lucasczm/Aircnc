import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import socketio from 'socket.io-client';

import api from '../services/api';
import Header from '../components/Header';
import SpotList from '../components/SpotList';
import calendar from '../assets/calendar.png';

export default function List({ navigation }) {
  const [techs, setTechs] = useState([]);
  const [isLoading, setIsLoading] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem('userToken').then(token => {
      if (!token) {
        return;
      }
      const socket = socketio.connect(api.defaults.baseURL, {
        query: { token },
      });

      socket.on('booking_response', booking => {
        Alert.alert(
          booking.approved ? 'Show!' : 'Não foi dessa vez :(',
          `Sua reserva em ${booking.spot.company} no dia ${booking.date} foi ${
            booking.approved ? 'APROVADA' : 'RECUSADA'
          }`,
        );
      });
    });
  }, []);

  useEffect(() => {
    async function loadSpots() {
      setIsLoading(true);
      try {
        const response = await api.get('/spots');
        let techObj = [];
        response.data.forEach(spot => {
          spot.techs.forEach(tech => {
            let obj = { name: tech, spots: [] };
            if (!techObj[tech]) {
              techObj[tech] = obj;
              techObj[tech].spots.push(spot);
            } else {
              techObj[tech].spots.push(spot);
            }
          });
        });
        techObj = Object.keys(techObj).map(tech => {
          return techObj[tech];
        });
        setIsLoading(false);
        setTechs(techObj);
      } catch (error) {
        setIsLoading(false);
        if (error.response) {
          if (error.response.status !== 401) {
            return Alert.alert('Ops!', 'Um erro aconteceu, tente novamente!');
          }
        }
        return Alert.alert('Ops!', 'Ocorreu um erro, tente novamente!');
      }
    }
    loadSpots();
  }, []);

  async function handlerLogout() {
    await AsyncStorage.removeItem('userToken');
    navigation.navigate('Login');
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll}>
        <Header
          primaryIcon={calendar}
          handlerPrimaryButton={() => navigation.navigate('Bookings')}
          handlerLogout={handlerLogout}
        />
        {techs.map(tech => (
          <SpotList key={tech.name} tech={tech.name} spots={tech.spots} />
        ))}
      </ScrollView>
      <Modal transparent={true} visible={isLoading && techs.length <= 0}>
        <View style={styles.loadContainer}>
          <ActivityIndicator size="large" color="#e14f50" />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
    paddingBottom: 20,
  },
  loadContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
