import { View, Text, Pressable, StyleSheet } from 'react-native';

const formatarDataParaBR = (dataString) => {
  if (!dataString) return '';
  const partes = dataString.split('-');
  if (partes.length === 3) {
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }
  return dataString;
};

export default function DespesaItem({ id, descricao, valor, data, categoria, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => pressed && styles.pressed}
    >
      <View style={styles.itemContainer}>
        <View style={styles.infoContainer}>
          <Text style={styles.descricao}>{descricao}</Text>
          <View style={styles.metaContainer}>
            <Text style={styles.data}>{formatarDataParaBR(data)}</Text>
            {categoria && (
              <View style={styles.categoriaBadge}>
                <Text style={styles.categoriaTexto}>{categoria}</Text>
              </View>
            )}
          </View>
        </View>
        <View style={styles.valorContainer}>
          <Text style={styles.valor}>R$ {Number(valor).toFixed(2).replace('.', ',')}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: { opacity: 0.75 },
  itemContainer: {
    padding: 12,
    marginVertical: 6,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 6,
    elevation: 2,
  },
  infoContainer: { flex: 1 },
  descricao: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  metaContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  data: { fontSize: 12, color: '#777', marginRight: 8 },
  categoriaBadge: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  categoriaTexto: { fontSize: 10, color: '#444', fontWeight: '600' },
  valorContainer: {
    backgroundColor: '#f4f6f8',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  valor: { fontWeight: 'bold', color: '#2a6f97' },
});