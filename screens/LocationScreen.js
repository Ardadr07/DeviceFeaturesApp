import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { useState } from 'react';

// Uygulama açıkken bildirimin görünmesini sağlar
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function LocationScreen() {
  const [coords, setCoords] = useState(null);

  const getLocation = async () => {
    // 1. Konum izni iste
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Konum izni gerekli', 'Konumunuzu alabilmek için izin vermelisiniz.');
      return;
    }

    // 2. Konumu al
    const location = await Location.getCurrentPositionAsync({});
    setCoords(location.coords);

    // 3. Bildirim izni iste
    await Notifications.requestPermissionsAsync();

    // 4. Bildirimi gönder
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Konum Alındı',
        body: 'GPS konumunuz başarıyla alındı.',
      },
      trigger: null, // null = hemen gönder
    });
  };

  return (
    <View style={styles.container}>
      <Button title="Mevcut Konumu Al" onPress={getLocation} />
      
      {coords && (
        <Text style={styles.text}>
          Enlem: {coords.latitude} {"\n"}
          Boylam: {coords.longitude}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
  },
});