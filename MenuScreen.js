import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MenuScreen({ navigation }) {
  const [country, setCountry] = useState('');
  const [university, setUniversity] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchUniversities = async () => {
    if (!country.trim() && !university.trim()) {
      Alert.alert('Erro', 'Informe ao menos um campo para busca.');
      return;
    }

    setLoading(true);
    let url = 'http://universities.hipolabs.com/search?';
    if (country) url += `country=${country.toLowerCase()}&`;
    if (university) url += `name=${university}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      setResults(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível buscar as universidades.');
    } finally {
      setLoading(false);
    }
  };

  const saveToFavorites = async (item) => {
    const favKey = 'favUniversidades';
    const favorite = {
      name: item.name,
      country: item.country,
      site: item.web_pages[0],
    };

    try {
      const stored = await AsyncStorage.getItem(favKey);
      const parsed = stored ? JSON.parse(stored) : [];

      if (parsed.some((f) => f.name === favorite.name)) {
        Alert.alert('Aviso', 'Universidade já está nos favoritos.');
        return;
      }

      await AsyncStorage.setItem(favKey, JSON.stringify([...parsed, favorite]));
      navigation.navigate('Favoritos');
    } catch (err) {
      Alert.alert('Erro', 'Falha ao salvar nos favoritos.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="País (ex: Brazil)"
        style={styles.input}
        value={country}
        onChangeText={setCountry}
      />
      <TextInput
        placeholder="Universidade (ex: Univ)"
        style={styles.input}
        value={university}
        onChangeText={setUniversity}
      />
      <TouchableOpacity style={styles.button} onPress={searchUniversities}>
        <Text style={styles.buttonText}>Buscar</Text>
      </TouchableOpacity>
      {loading && <ActivityIndicator size="large" style={{ margin: 10 }} />}
      <FlatList
        data={results}
        keyExtractor={(item, idx) => idx.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.resultItem}
            onPress={() => saveToFavorites(item)}
          >
            <Text style={styles.resultText}>{item.name} ({item.country})</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fafafa' },
  input: {
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 8,
    padding: 12,
    marginVertical: 6,
  },
  button: {
    backgroundColor: '#4a90e2',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  resultItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  resultText: { fontSize: 14 },
});