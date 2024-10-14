import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import demo from './(tabs)/demo';
import Register from './Register';  // Đường dẫn đến file Register
import CategoryScreen from './CategoryScreen';
import ProductDetailScreen from './ProductDetailScreen';
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="demo">
        <Stack.Screen name="demo" component={demo} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="CategoryScreen" component={CategoryScreen} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
