import React from 'react';
import { ActivityIndicator, Modal, View, StyleSheet } from 'react-native';

export default function ModalSpinner({ show }) {
  return (
    <Modal transparent={true} visible={show}>
      <View style={styles.container}>
        <View style={styles.box}>
          <ActivityIndicator size="large" color="#e14f50" />
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  box: {
    backgroundColor: '#FFF',
    padding: 20,
    paddingHorizontal: 40,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
});
