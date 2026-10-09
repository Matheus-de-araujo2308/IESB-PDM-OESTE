import React, { useState } from 'react';
import { Pressable, Text, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import TodasDespesas from './src/screens/TodasDespesas';
import DespesasRecentes from './src/screens/DespesasRecentes';
import GerenciarDespesa from './src/screens/GerenciarDespesa';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const DADOS_INICIAIS = [
  { id: 'd1', descricao: 'Almoço', valor: 45.50, categoria: 'Alimentação', data: '2026-10-01' },
  { id: 'd2', descricao: 'Uber', valor: 25.00, categoria: 'Transporte', data: '2026-10-02' },
  { id: 'd3', descricao: 'Cinema', valor: 35.00, categoria: 'Lazer', data: '2026-10-05' },
  { id: 'd4', descricao: 'Luz', valor: 120.00, categoria: 'Contas', data: '2026-10-08' },
];

function BottomTabScreen({ despesas, navigation, onSelectDespesa }) {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: { fontSize: 12 },
        headerStyle: { backgroundColor: '#2a6f97' },
        headerTintColor: '#fff',
        // Botão sem background (transparente) no cabeçalho
        headerRight: () => (
          <Pressable
            style={({ pressed }) => [styles.btnHeader, pressed && styles.pressed]}
            onPress={() => navigation.navigate('GerenciarDespesa')}
          >
            <Ionicons name="add-circle-outline" size={22} color="#fff" style={{ marginRight: 4 }} />
            <Text style={styles.btnHeaderTexto}>Nova Despesa</Text>
          </Pressable>
        ),
      }}
    >
      <Tab.Screen
        name="DespesasRecentes"
        options={{
          title: 'Despesas Recentes',
          tabBarLabel: 'Recentes',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="hourglass-outline" size={size} color={color} />
          ),
        }}
      >
        {() => <DespesasRecentes despesas={despesas} onSelectDespesa={onSelectDespesa} />}
      </Tab.Screen>

      <Tab.Screen
        name="TodasDespesas"
        options={{
          title: 'Todas as Despesas',
          tabBarLabel: 'Todas',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="wallet-outline" size={size} color={color} />
          ),
        }}
      >
        {() => <TodasDespesas despesas={despesas} onSelectDespesa={onSelectDespesa} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function App() {
  const [despesas, setDespesas] = useState(DADOS_INICIAIS);

  const handleSalvarDespesa = (despesa) => {
    setDespesas((despesasAtuais) => {
      const existe = despesasAtuais.some((d) => d.id === despesa.id);
      if (existe) {
        return despesasAtuais.map((d) => (d.id === despesa.id ? despesa : d));
      }
      return [despesa, ...despesasAtuais];
    });
  };

  const handleDeletarDespesa = (id) => {
    setDespesas((despesasAtuais) => despesasAtuais.filter((d) => d.id !== id));
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#2a6f97' },
          headerTintColor: '#fff',
        }}
      >
        <Stack.Screen name="Despesas" options={{ headerShown: false }}>
          {({ navigation }) => (
            <BottomTabScreen
              despesas={despesas}
              navigation={navigation}
              onSelectDespesa={(despesa) => navigation.navigate('GerenciarDespesa', { despesa })}
            />
          )}
        </Stack.Screen>
        <Stack.Screen
          name="GerenciarDespesa"
          options={({ route }) => ({
            title: route?.params?.despesa ? 'Editar Despesa' : 'Adicionar Despesa',
          })}
        >
          {(props) => (
            <GerenciarDespesa
              {...props}
              onSalvar={handleSalvarDespesa}
              onDeletar={handleDeletarDespesa}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
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
  btnHeaderTexto: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  pressed: {
    opacity: 0.6,
  },
});