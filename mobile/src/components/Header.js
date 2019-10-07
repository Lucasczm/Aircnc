import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';

import logo from '../assets/logo.png';
import logout from '../assets/log-out.png';

export default function Header({
  primaryIcon,
  handlerPrimaryButton,
  handlerLogout,
}) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={handlerPrimaryButton}>
        <Image source={primaryIcon} style={styles.ImageHeader} />
      </TouchableOpacity>
      <Image style={styles.ImageHeader} source={logo} />
      <TouchableOpacity style={styles.logout} onPress={handlerLogout}>
        <Image source={handlerLogout ? logout : null} />
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 55,
    paddingHorizontal: 20,
  },

  ImageHeader: {
    height: 32,
    resizeMode: 'contain',
  },
});
