import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FavoritosScreen() {
  const [favorites, setFavorites] = useState([]);
  const favKey = 'favUniversidades';

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadFavorites);
    return unsubscribe;
  }, [navigation]);

  const loadFavorites = async () => {
    const stored = await AsyncStorage.getItem(favKey);
    setFavorites(stored ? JSON.parse(stored) : []);
  };

  const removeFavorite = async (item) => {
    Alert.alert(
      'Remover',
      `Remover ${item.name} dos favoritos?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'OK',
          onPress: async () => {
            const updated = favorites.filter((f) => f.name !== item.name);
            await AsyncStorage.setItem(favKey, JSON.stringify(updated));
            setFavorites(updated);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item, idx) => idx.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.favoriteItem}
            onPress={() => removeFavorite(item)}
          >
            <Text style={styles.favoriteText}>{item.name} {'\n'}{item.site}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  favoriteItem: {
    padding: 12,
    backgroundColor: '#eef',
    borderRadius: 6,
    marginVertical: 4,
  },
  favoriteText: { fontSize: 14 },
});
