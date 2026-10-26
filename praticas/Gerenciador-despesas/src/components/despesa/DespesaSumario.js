import { View, Text, StyleSheet } from 'react-native';

export default function DespesaSumario({ despesas, periodo }) {
  const somaDespesas = despesas.reduce((acumulador, item) => {
    return acumulador + Number(item.valor);
  }, 0);

  const isAcimaDoLimite = somaDespesas > 200;

  return (
    <View style={styles.container}>
      <Text style={styles.periodo}>{periodo}</Text>
      <Text style={[styles.soma, isAcimaDoLimite && styles.alertaLimite]}>
        R$ {somaDespesas.toFixed(2)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: '#e4e7eb',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  periodo: { fontSize: 14, color: '#555', fontWeight: 'bold' },
  soma: { fontSize: 18, fontWeight: 'bold', color: '#2b2b2b' },
  alertaLimite: { color: '#d9534f' },
});