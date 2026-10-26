import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Pressable,
  Alert,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useExpenses } from '../store/expenses-context';
import { useDebounce } from '../hooks/useDebounce';
import { Colors } from '../constants/theme';

const CATEGORIES = ['Todas', 'Alimentação', 'Transporte', 'Lazer', 'Contas', 'Outros'];

export default function TodasDespesas({ navigation }) {
  const { expenses, clearExpenses, themeMode } = useExpenses();
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  
  const debouncedSearch = useDebounce(searchText, 300);
  const theme = Colors[themeMode || 'light'];
  const { width } = useWindowDimensions();

  const numColumns = width > 600 ? 2 : 1;

  const filteredExpenses = useMemo(() => {
    return expenses.filter((exp) => {
      const matchesSearch = exp.description.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesCategory = selectedCategory === 'Todas' || exp.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [expenses, debouncedSearch, selectedCategory]);

  const totalAmount = useMemo(() => {
    return filteredExpenses.reduce((sum, item) => sum + item.amount, 0);
  }, [filteredExpenses]);

  function handleClearAll() {
    Alert.alert('Limpar Tudo', 'Deseja remover todas as despesas salvas?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Limpar', style: 'destructive', onPress: clearExpenses },
    ]);
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Campo de Busca */}
      <View style={[styles.searchContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Ionicons name="search-outline" size={20} color={theme.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: theme.textPrimary }]}
          placeholder="Buscar por descrição..."
          placeholderTextColor={theme.textSecondary}
          value={searchText}
          onChangeText={setSearchText}
        />
        {searchText.length > 0 && (
          <Pressable onPress={() => setSearchText('')}>
            <Ionicons name="close-circle" size={18} color={theme.textSecondary} />
          </Pressable>
        )}
      </View>

      {/* Chips de Categoria */}
      <View style={{ maxHeight: 40, marginBottom: 12 }}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CATEGORIES}
          keyExtractor={(item) => item}
          renderItem={({ item }) => {
            const isSelected = selectedCategory === item;
            return (
              <Pressable
                style={[
                  styles.chip,
                  { backgroundColor: isSelected ? theme.primary : theme.surface, borderColor: theme.border },
                ]}
                onPress={() => setSelectedCategory(item)}
              >
                <Text style={{ color: isSelected ? '#FFF' : theme.textPrimary, fontWeight: isSelected ? 'bold' : 'normal' }}>
                  {item}
                </Text>
              </Pressable>
            );
          }}
        />
      </View>

      <FlatList
        key={numColumns}
        numColumns={numColumns}
        data={filteredExpenses}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={[styles.summaryCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View>
              <Text style={[styles.summaryCount, { color: theme.textSecondary }]}>
                {filteredExpenses.length} {filteredExpenses.length === 1 ? 'despesa' : 'despesas'}
              </Text>
              <Text style={[styles.summaryTotalLabel, { color: theme.textPrimary }]}>Total Exibido</Text>
            </View>
            <Text style={[styles.summaryTotalValue, { color: theme.primary }]}>
              R$ {totalAmount.toFixed(2)}
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={64} color={theme.textSecondary} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              Nenhuma despesa encontrada.
            </Text>
            <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
              Toque em "+" para adicionar uma nova despesa.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            style={[
              styles.itemCard,
              { backgroundColor: theme.surface, borderColor: theme.border, flex: 1 / numColumns, margin: 4 },
            ]}
            onPress={() => navigation.navigate('GerenciarDespesa', { expenseId: item.id })}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.itemTitle, { color: theme.textPrimary }]}>{item.description}</Text>
              <Text style={[styles.itemSubtitle, { color: theme.textSecondary }]}>
                {item.category} • {item.date}
              </Text>
            </View>
            <Text style={[styles.itemAmount, { color: theme.primary }]}>R$ {item.amount.toFixed(2)}</Text>
          </Pressable>
        )}
      />

      {/* Botão Limpar Tudo */}
      {expenses.length > 0 && (
        <Pressable style={styles.clearAllBtn} onPress={handleClearAll}>
          <Text style={{ color: theme.danger, fontWeight: 'bold' }}>Limpar Tudo</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 12,
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 15 },
  chip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, borderWidth: 1, marginRight: 8 },
  summaryCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  summaryCount: { fontSize: 12 },
  summaryTotalLabel: { fontSize: 16, fontWeight: 'bold' },
  summaryTotalValue: { fontSize: 18, fontWeight: 'bold' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', padding: 32, marginTop: 24 },
  emptyText: { fontSize: 16, fontWeight: 'bold', marginTop: 12 },
  emptySubtext: { fontSize: 13, marginTop: 4, textAlign: 'center' },
  itemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
      android: { elevation: 2 },
    }),
  },
  itemTitle: { fontSize: 15, fontWeight: '600' },
  itemSubtitle: { fontSize: 12, marginTop: 2 },
  itemAmount: { fontSize: 15, fontWeight: 'bold' },
  clearAllBtn: { padding: 12, alignItems: 'center', marginTop: 8 },
});