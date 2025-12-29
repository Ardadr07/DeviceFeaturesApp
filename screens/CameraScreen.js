import { View, Button, Image, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';

export default function CameraScreen() {
  const [imageUri, setImageUri] = useState(null);

  const pickImage = async () => {
    // Galeri izni iste
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('İzin gerekli', 'Galeriye erişim izni vermeniz gerekiyor.');
      return;
    }

    // Galeriyi aç
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      // Titreşim geri bildirimi
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const takePhoto = async () => {
    // Kamera izni iste
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Kamera izni gerekli', 'Fotoğraf çekmek için izin vermelisiniz.');
      return;
    }

    // Kamerayı aç
    const result = await ImagePicker.launchCameraAsync({
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      // Başarılı işlem bildirimi (farklı bir titreşim)
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Galeriden Seç" onPress={pickImage} />
      <Button title="Fotoğraf Çek" onPress={takePhoto} />
      
      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    padding: 20,
    justifyContent: 'flex-start', // Butonlar üstte dursun
  },
  image: {
    width: '100%',
    height: 300,
    marginTop: 20,
    borderRadius: 10, // Biraz görsellik
    backgroundColor: '#f0f0f0', // Resim yokken veya yüklenirken belli olsun
  },
});