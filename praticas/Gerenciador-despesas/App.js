import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { ExpensesContextProvider, useExpenses } from './src/store/expenses-context';
import TodasDespesas from './src/screens/TodasDespesas';
import DespesasRecentes from './src/screens/DespesasRecentes';
import GerenciarDespesa from './src/screens/GerenciarDespesa';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HeaderButtons({ navigation }) {
  const { themeMode, toggleTheme } = useExpenses();

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Pressable onPress={toggleTheme} style={{ marginRight: 12 }}>
        <Ionicons
          name={themeMode === 'dark' ? 'sunny-outline' : 'moon-outline'}
          size={22}
          color="#fff"
        />
      </Pressable>
      <Pressable
        style={({ pressed }) => [styles.btnHeader, pressed && styles.pressed]}
        onPress={() => navigation.navigate('GerenciarDespesa')}
      >
        <Ionicons name="add-circle-outline" size={22} color="#fff" style={{ marginRight: 4 }} />
        <Text style={styles.btnHeaderTexto}>Nova Despesa</Text>
      </Pressable>
    </View>
  );
}

function BottomTabScreen({ navigation }) {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: { fontSize: 12 },
        headerStyle: { backgroundColor: '#2a6f97' },
        headerTintColor: '#fff',
        tabBarActiveTintColor: '#2a6f97',
        headerRight: () => <HeaderButtons navigation={navigation} />,
      }}
    >
      <Tab.Screen
        name="DespesasRecentes"
        component={DespesasRecentes}
        options={{
          title: 'Despesas Recentes',
          tabBarLabel: 'Recentes',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="hourglass-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="TodasDespesas"
        component={TodasDespesas}
        options={{
          title: 'Todas as Despesas',
          tabBarLabel: 'Todas',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="wallet-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <ExpensesContextProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: '#2a6f97' },
            headerTintColor: '#fff',
          }}
        >
          <Stack.Screen name="Despesas" component={BottomTabScreen} options={{ headerShown: false }} />
          <Stack.Screen name="GerenciarDespesa" component={GerenciarDespesa} />
        </Stack.Navigator>
      </NavigationContainer>
    </ExpensesContextProvider>
  );
}

const styles = StyleSheet.create({
  btnHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
  },
  btnHeaderTexto: { color: '#fff', fontWeight: '600', fontSize: 13 },
  pressed: { opacity: 0.6 },
});