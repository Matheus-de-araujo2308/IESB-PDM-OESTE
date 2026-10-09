import { FlatList } from 'react-native';
import DespesaItem from './DespesaItem';

export default function DespesaLista({ despesas, onSelectDespesa }) {
  return (
    <FlatList
      data={despesas}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <DespesaItem
          id={item.id}
          descricao={item.descricao}
          valor={item.valor}
          data={item.data}
          categoria={item.categoria}
          onPress={() => onSelectDespesa && onSelectDespesa(item)}
        />
      )}
    />
  );
}