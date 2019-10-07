import axios from 'axios';
import { Alert } from 'react-native';
import { API_ENDPOINT, FRONTEND_ENDPOINT } from 'react-native-dotenv';
import AsyncStorage from '@react-native-community/async-storage';
import NavigationService from './navigationService.js';

const api = axios.create({
  baseURL: API_ENDPOINT,
  headers: { Origin: FRONTEND_ENDPOINT },
});

api.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  },
);

api.interceptors.response.use(undefined, err => {
  const loginPath = err.config.baseURL + '/sessions';
  if (err.response) {
    if (err.response.status === 401 && loginPath !== err.config.url) {
      AsyncStorage.removeItem('userToken');
      Alert.alert('Ops!', 'Sua sessão expirou!, faça login novamente!', [
        {
          text: 'ok',
          onPress: () => {
            NavigationService.navigate('Login');
          },
        },
      ]);
    }
  }
  return Promise.reject(err);
});

export default api;
