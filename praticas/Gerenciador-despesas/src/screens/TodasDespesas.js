import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import DespesaSaida from '../components/despesa/DespesaSaida';

const CATEGORIAS = ['Todas', 'Alimentação', 'Transporte', 'Lazer', 'Contas'];

export default function TodasDespesas({ despesas, onSelectDespesa }) {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('Todas');

  const despesasFiltradas = categoriaSelecionada === 'Todas'
    ? despesas
    : despesas.filter((d) => d.categoria === categoriaSelecionada);

  return (
    <View style={styles.container}>
      <View style={styles.filtroContainer}>
        {CATEGORIAS.map((cat) => (
          <Pressable
            key={cat}
            onPress={() => setCategoriaSelecionada(cat)}
            style={[
              styles.btnFiltro,
              categoriaSelecionada === cat && styles.btnFiltroAtivo,
            ]}
          >
            <Text
              style={[
                styles.txtFiltro,
                categoriaSelecionada === cat && styles.txtFiltroAtivo,
              ]}
            >
              {cat}
            </Text>
          </Pressable>
        ))}
      </View>

      <DespesaSaida
        despesas={despesasFiltradas}
        periodo="Total Cadastrado"
        onSelectDespesa={onSelectDespesa}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  filtroContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#fff',
  },
  btnFiltro: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 16 },
  btnFiltroAtivo: { backgroundColor: '#2a6f97' },
  txtFiltro: { fontSize: 12, color: '#555' },
  txtFiltroAtivo: { color: '#fff', fontWeight: 'bold' },
});