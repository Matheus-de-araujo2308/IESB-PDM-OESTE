import React, { useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useExpenses } from '../store/expenses-context';
import { Colors } from '../constants/theme';

export default function DespesasRecentes({ navigation }) {
  const { expenses, themeMode } = useExpenses();
  const theme = Colors[themeMode || 'light'];

  const recentExpenses = useMemo(() => {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    return expenses.filter((exp) => {
      const expDate = new Date(exp.date);
      return expDate >= sevenDaysAgo && expDate <= today;
    });
  }, [expenses]);

  const totalAmount = useMemo(() => {
    return recentExpenses.reduce((sum, item) => sum + item.amount, 0);
  }, [recentExpenses]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={recentExpenses}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={[styles.summaryCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View>
              <Text style={[styles.summaryCount, { color: theme.textSecondary }]}>
                {recentExpenses.length} {recentExpenses.length === 1 ? 'despesa' : 'despesas'}
              </Text>
              <Text style={[styles.summaryTotalLabel, { color: theme.textPrimary }]}>Últimos 7 dias</Text>
            </View>
            <Text style={[styles.summaryTotalValue, { color: theme.primary }]}>
              R$ {totalAmount.toFixed(2)}
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="hourglass-outline" size={64} color={theme.textSecondary} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              Nenhuma despesa nos últimos 7 dias.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            style={[styles.itemCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
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
  itemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
      android: { elevation: 2 },
    }),
  },
  itemTitle: { fontSize: 15, fontWeight: '600' },
  itemSubtitle: { fontSize: 12, marginTop: 2 },
  itemAmount: { fontSize: 15, fontWeight: 'bold' },
});