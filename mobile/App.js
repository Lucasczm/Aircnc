import React from 'react';
import { YellowBox } from 'react-native';
import Routes from './src/routes';
import NavigationService from './src/services/navigationService';

YellowBox.ignoreWarnings(['Unrecognized WebSocket']);

export default function App() {
  return (
    <Routes
      ref={navigatorRef => {
        NavigationService.setTopLevelNavigator(navigatorRef);
      }}
    />
  );
}
