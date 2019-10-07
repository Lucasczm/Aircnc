import React from 'react';
import { withNavigation } from 'react-navigation';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

function SpotList({ navigation, tech, spots }) {
  function handleNavigate(id) {
    navigation.navigate('Book', { id });
  }
  function renderItem({ item }) {
    return (
      <View style={styles.listItem}>
        <Image style={styles.thumbnail} source={{ uri: item.thumbnail }} />
        <Text style={styles.company}>{item.company}</Text>
        <Text style={styles.price}>
          {item.precie ? `R$ ${item.price}/dia` : 'GRATUITO'}
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleNavigate(item._id)}>
          <Text style={styles.buttonText}>Solicitar Reserva</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Empresas que usam <Text style={styles.bold}>{tech}</Text>
      </Text>
      <FlatList
        contentContainerStyle={styles.list}
        data={spots}
        keyExtractor={item => item._id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    color: '#444',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  bold: {
    fontWeight: 'bold',
  },
  list: {
    paddingHorizontal: 20,
  },
  listItem: {
    marginRight: 15,
    marginBottom: 15,
  },
  thumbnail: {
    width: 200,
    height: 120,
    resizeMode: 'cover',
    borderRadius: 2,
  },
  company: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  price: {
    fontSize: 15,
    color: '#999',
    marginTop: 5,
  },
  button: {
    height: 32,
    backgroundColor: '#f05a5b',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
    marginTop: 15,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default withNavigation(SpotList);
