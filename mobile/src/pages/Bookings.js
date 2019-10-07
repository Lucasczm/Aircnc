import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  Modal,
  FlatList,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';

import api from '../services/api';
import backIcon from '../assets/back-arrow.png';
import Header from '../components/Header';

export default function Bookings({ navigation }) {
  const [isLoading, setLoading] = useState(false);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    async function loadBookings() {
      try {
        setLoading(true);
        const response = await api.get('/mybookings');
        setBookings(response.data);
        setLoading(false);
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
    loadBookings();
  }, []);

  function handlerBack() {
    navigation.navigate('List');
  }
  function renderItem({ item }) {
    return (
      <View style={styles.bookings}>
        <Image style={styles.thumbnail} source={{ uri: item.spot.thumbnail }} />
        <View style={styles.description}>
          <Text style={styles.bold}>{item.spot.company}</Text>
          <Text>{item.date}</Text>
          {item.approved === undefined && (
            <Text style={styles.pending}>PENDENTE</Text>
          )}
          {item.approved && <Text style={styles.accept}>APROVADO</Text>}
          {item.approved === false && (
            <Text style={styles.reject}>RECUSADO</Text>
          )}
        </View>
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <Header primaryIcon={backIcon} handlerPrimaryButton={handlerBack} />
      <Text style={styles.title}>Seus pedidos de reserva</Text>
      <FlatList
        style={styles.list}
        data={bookings}
        keyExtractor={item => item._id}
        renderItem={renderItem}
      />
      <Modal transparent={true} visible={isLoading && bookings.length <= 0}>
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
  title: {
    fontSize: 20,
    color: '#444',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  list: {
    paddingHorizontal: 20,
  },
  bookings: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  thumbnail: {
    height: 100,
    width: 100,
    borderRadius: 5,
    marginRight: 10,
  },
  description: {
    justifyContent: 'space-around',
  },
  pending: {
    color: '#999',
  },
  accept: {
    color: 'green',
  },
  reject: {
    color: '#e14f50',
  },
  bold: {
    fontWeight: 'bold',
  },
  loadContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
