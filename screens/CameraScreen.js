import { View, Button, Image, Alert, StyleSheet, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library'; // YENİ EKLENDİ
import * as Haptics from 'expo-haptics';
import { useState } from 'react';

export default function CameraScreen() {
  const [imageUri, setImageUri] = useState(null);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions(); // YENİ: Galeri kayıt izni

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('İzin gerekli', 'Galeriye erişim izni vermeniz gerekiyor.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const takePhoto = async () => {
    // 1. Kamera izni iste
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (cameraStatus !== 'granted') {
      Alert.alert('Kamera izni gerekli', 'Fotoğraf çekmek için izin vermelisiniz.');
      return;
    }

    // 2. Kamerayı aç
    const result = await ImagePicker.launchCameraAsync({
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      
      // 3. Fotoğrafı Galeriye Kaydetme İşlemi (YENİ KISIM)
      try {
        // Galeriye yazma izni var mı kontrol et
        if (permissionResponse?.status !== 'granted') {
            const { status } = await requestPermission();
            if (status !== 'granted') {
                Alert.alert("Hata", "Fotoğrafı kaydetmek için galeri izni lazım.");
                return;
            }
        }
        
        // Varlığı oluştur (Kaydet)
        await MediaLibrary.createAssetAsync(uri);
        
        // Başarılı bildirimi
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert("Başarılı", "Fotoğraf galeriye kaydedildi! 📸");

      } catch (error) {
        console.log(error);
        Alert.alert("Hata", "Fotoğraf kaydedilemedi.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Galeriden Seç" onPress={pickImage} />
      <View style={{ marginTop: 10 }}>
        <Button title="Fotoğraf Çek ve Kaydet" onPress={takePhoto} />
      </View>
      
      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" />
      )}
      <Text style={styles.info}>Çekilen fotoğraflar galeriye kaydedilir.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    padding: 20,
    justifyContent: 'flex-start',
  },
  image: {
    width: '100%',
    height: 300,
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
  info: {
    textAlign: 'center',
    color: '#666',
    fontSize: 12,
    marginTop: 5
  }
});