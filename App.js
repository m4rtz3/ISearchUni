import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MenuScreen from './MenuScreen';
import FavoritosScreen from './FavoritosScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="BuscarUniversidades">
        <Stack.Screen
          name="BuscarUniversidades"
          component={MenuScreen}
          options={{ title: 'Pesquisar Universidades' }}
        />
        <Stack.Screen
          name="Favoritos"
          component={FavoritosScreen}
          options={{ title: 'Universidades Favoritas' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}