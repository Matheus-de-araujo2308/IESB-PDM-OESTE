import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useExpenses } from '../store/expenses-context';
import { Colors } from '../constants/theme';

const CATEGORIES = ['Alimentação', 'Transporte', 'Lazer', 'Contas', 'Outros'];

export default function GerenciarDespesa({ route, navigation }) {
  const expenseId = route.params?.expenseId;
  const isEditing = !!expenseId;
  const { expenses, addExpense, updateExpense, deleteExpense, themeMode } = useExpenses();

  const theme = Colors[themeMode || 'light'];

  const selectedExpense = isEditing ? expenses.find((e) => e.id === expenseId) : null;

  const [form, setForm] = useState({
    description: selectedExpense ? selectedExpense.description : '',
    amount: selectedExpense ? selectedExpense.amount.toString() : '',
    date: selectedExpense ? new Date(selectedExpense.date) : new Date(),
    category: selectedExpense ? selectedExpense.category : '',
  });

  const [errors, setErrors] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Editar despesa' : 'Nova despesa',
    });
  }, [navigation, isEditing]);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  }

  function handleAmountChange(text) {
    const formatted = text.replace(',', '.');
    if (/^\d*\.?\d{0,2}$/.test(formatted) || formatted === '') {
      handleChange('amount', formatted);
    }
  }

  function validate(values) {
    const newErrors = {};
    if (!values.description || values.description.trim().length < 3) {
      newErrors.description = 'A descrição deve ter no mínimo 3 caracteres.';
    }
    const numAmount = parseFloat(values.amount);
    if (!values.amount || isNaN(numAmount) || numAmount <= 0) {
      newErrors.amount = 'Informe um valor maior que zero.';
    }
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (!values.date || values.date > today) {
      newErrors.date = 'A data não pode ser futura.';
    }
    if (!values.category) {
      newErrors.category = 'Selecione uma categoria.';
    }
    return newErrors;
  }

  function handleSave() {
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const expenseData = {
      description: form.description.trim(),
      amount: parseFloat(form.amount),
      date: form.date.toISOString().split('T')[0],
      category: form.category,
    };

    if (isEditing) {
      updateExpense(expenseId, expenseData);
    } else {
      addExpense(expenseData);
    }
    navigation.goBack();
  }

  function handleDeleteConfirm() {
    Alert.alert('Excluir despesa', 'Tem certeza que deseja excluir esta despesa?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => {
          deleteExpense(expenseId);
          navigation.goBack();
        },
      },
    ]);
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: theme.textPrimary }]}>Descrição</Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: theme.surface, color: theme.textPrimary, borderColor: theme.border },
              errors.description && styles.inputError,
            ]}
            value={form.description}
            onChangeText={(val) => handleChange('description', val)}
            placeholder="Ex: Almoço"
            placeholderTextColor={theme.textSecondary}
          />
          {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: theme.textPrimary }]}>Valor (R$)</Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: theme.surface, color: theme.textPrimary, borderColor: theme.border },
              errors.amount && styles.inputError,
            ]}
            keyboardType="decimal-pad"
            value={form.amount}
            onChangeText={handleAmountChange}
            placeholder="0.00"
            placeholderTextColor={theme.textSecondary}
          />
          {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: theme.textPrimary }]}>Data</Text>
          <Pressable
            style={[
              styles.selector,
              { backgroundColor: theme.surface, borderColor: theme.border },
              errors.date && styles.inputError,
            ]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={{ color: theme.textPrimary }}>
              {form.date ? form.date.toLocaleDateString('pt-BR') : 'Selecione a data'}
            </Text>
            <Ionicons name="calendar-outline" size={20} color={theme.textSecondary} />
          </Pressable>
          {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}
          {showDatePicker && (
            <DateTimePicker
              value={form.date || new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(Platform.OS === 'ios');
                if (selectedDate) handleChange('date', selectedDate);
              }}
            />
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: theme.textPrimary }]}>Categoria</Text>
          <Pressable
            style={[
              styles.selector,
              { backgroundColor: theme.surface, borderColor: theme.border },
              errors.category && styles.inputError,
            ]}
            onPress={() => setShowCategoryModal(true)}
          >
            <Text style={{ color: form.category ? theme.textPrimary : theme.textSecondary }}>
              {form.category || 'Selecione uma categoria'}
            </Text>
            <Ionicons name="chevron-down-outline" size={20} color={theme.textSecondary} />
          </Pressable>
          {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
        </View>

        <View style={styles.buttonsContainer}>
          <Pressable
            style={[styles.button, { backgroundColor: theme.border }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.btnText, { color: theme.textPrimary }]}>Cancelar</Text>
          </Pressable>
          <Pressable style={[styles.button, { backgroundColor: theme.primary }]} onPress={handleSave}>
            <Text style={[styles.btnText, { color: '#FFF' }]}>Salvar</Text>
          </Pressable>
        </View>

        {isEditing && (
          <View style={styles.deleteContainer}>
            <Pressable style={styles.deleteButton} onPress={handleDeleteConfirm}>
              <Ionicons name="trash-outline" size={24} color={theme.danger} />
              <Text style={[styles.deleteText, { color: theme.danger }]}>Excluir Despesa</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>

      {/* Modal de Categorias */}
      <Modal visible={showCategoryModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>Escolha a Categoria</Text>
            <FlatList
              data={CATEGORIES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.categoryItem}
                  onPress={() => {
                    handleChange('category', item);
                    setShowCategoryModal(false);
                  }}
                >
                  <Text style={[styles.categoryText, { color: theme.textPrimary }]}>{item}</Text>
                </Pressable>
              )}
            />
            <Pressable
              style={[styles.button, { backgroundColor: theme.border, marginTop: 12 }]}
              onPress={() => setShowCategoryModal(false)}
            >
              <Text style={[styles.btnText, { color: theme.textPrimary }]}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  formGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 16 },
  inputError: { borderColor: '#EF4444' },
  errorText: { color: '#EF4444', fontSize: 12, marginTop: 4 },
  selector: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, gap: 12 },
  button: { flex: 1, padding: 14, borderRadius: 8, alignItems: 'center' },
  btnText: { fontWeight: 'bold', fontSize: 16 },
  deleteContainer: { marginTop: 32, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingTop: 16 },
  deleteButton: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  deleteText: { fontWeight: 'bold', fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 20, maxHeight: '50%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  categoryItem: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  categoryText: { fontSize: 16, textAlign: 'center' },
});