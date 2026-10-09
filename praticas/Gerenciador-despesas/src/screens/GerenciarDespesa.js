import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import IconButton from '../components/IconButton';

const CATEGORIAS = ['Alimentação', 'Transporte', 'Lazer', 'Contas'];

const formatarDataBR = (dataObj) => {
  const dia = String(dataObj.getDate()).padStart(2, '0');
  const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
  const ano = dataObj.getFullYear();
  return `${dia}/${mes}/${ano}`;
};

export default function GerenciarDespesa({ route, navigation, onSalvar, onDeletar }) {
  const despesaParaEditar = route?.params?.despesa;
  const isEditing = !!despesaParaEditar;

  const [descricao, setDescricao] = useState(despesaParaEditar ? despesaParaEditar.descricao : '');
  const [valor, setValor] = useState(
    despesaParaEditar ? despesaParaEditar.valor.toString().replace('.', ',') : ''
  );
  const [categoria, setCategoria] = useState(despesaParaEditar ? despesaParaEditar.categoria : '');
  const [data, setData] = useState(
    despesaParaEditar ? new Date(despesaParaEditar.data + 'T00:00:00') : new Date()
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleValorChange = (texto) => {
    if (/^\d*[,.]?\d{0,2}$/.test(texto)) {
      setValor(texto);
    }
  };

  const handleSubmeter = () => {
    if (!descricao.trim() || !valor || !categoria) {
      Alert.alert('Erro', 'Por favor, preencha a descrição, valor e selecione uma categoria.');
      return;
    }

    const valorFormatado = parseFloat(valor.replace(',', '.'));

    if (isNaN(valorFormatado)) {
      Alert.alert('Erro', 'Por favor, insira um valor válido.');
      return;
    }

    const dadosDespesa = {
      id: isEditing ? despesaParaEditar.id : Math.random().toString(),
      descricao,
      valor: valorFormatado,
      categoria,
      data: data.toISOString().split('T')[0],
    };

    if (onSalvar) onSalvar(dadosDespesa);
    navigation.goBack();
  };

  const handleDeletar = () => {
    if (onDeletar && despesaParaEditar) {
      onDeletar(despesaParaEditar.id);
    }
    navigation.goBack();
  };

  return (
    <View style={styles.form}>
      <Text style={styles.label}>Descrição:</Text>
      <TextInput
        style={styles.input}
        value={descricao}
        onChangeText={setDescricao}
        placeholder="Ex: Mercado"
      />

      <Text style={styles.label}>Valor (R$):</Text>
      <TextInput
        style={styles.input}
        keyboardType="decimal-pad"
        value={valor}
        onChangeText={handleValorChange}
        placeholder="0,00"
      />

      <Text style={styles.label}>Categoria:</Text>
      <View style={styles.categoriasGroup}>
        {CATEGORIAS.map((cat) => (
          <Pressable
            key={cat}
            style={[styles.catOption, categoria === cat && styles.catOptionAtiva]}
            onPress={() => setCategoria(cat)}
          >
            <Text style={categoria === cat ? styles.catTxtAtivo : styles.catTxt}>{cat}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Data da Despesa:</Text>
      
      {/* Se for Web, exibe input tipo 'date' nativo do browser */}
      {Platform.OS === 'web' ? (
        <input
          type="date"
          value={data.toISOString().split('T')[0]}
          onChange={(e) => {
            if (e.target.value) {
              setData(new Date(e.target.value + 'T00:00:00'));
            }
          }}
          style={{
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            marginBottom: '20px',
            fontSize: '15px',
          }}
        />
      ) : (
        /* Se for Mobile (iOS/Android) */
        <>
          <Pressable style={styles.btnData} onPress={() => setShowDatePicker(true)}>
            <Text style={styles.txtData}>{formatarDataBR(data)}</Text>
          </Pressable>

          {showDatePicker && (
            <DateTimePicker
              value={data}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setData(selectedDate);
              }}
            />
          )}
        </>
      )}

      <View style={styles.botoesContainer}>
        <Pressable style={styles.btnSalvar} onPress={handleSubmeter}>
          <Text style={styles.btnSalvarTexto}>{isEditing ? 'Atualizar' : 'Salvar'}</Text>
        </Pressable>
      </View>

      {isEditing && (
        <View style={styles.deleteContainer}>
          <IconButton icon="trash" size={32} color="#d9534f" onPress={handleDeletar} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  form: { padding: 20 },
  label: { fontSize: 14, fontWeight: 'bold', marginVertical: 6 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 8, marginBottom: 12 },
  categoriasGroup: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
  catOption: { padding: 8, borderWidth: 1, borderColor: '#ccc', borderRadius: 6, marginRight: 6, marginBottom: 6 },
  catOptionAtiva: { backgroundColor: '#2a6f97', borderColor: '#2a6f97' },
  catTxt: { color: '#333' },
  catTxtAtivo: { color: '#fff', fontWeight: 'bold' },
  btnData: { padding: 12, backgroundColor: '#e9ecef', borderRadius: 4, alignItems: 'center', marginBottom: 20 },
  txtData: { fontSize: 15, fontWeight: '600', color: '#2a6f97' },
  botoesContainer: { marginTop: 10 },
  btnSalvar: { backgroundColor: '#2b9348', padding: 12, borderRadius: 6, alignItems: 'center' },
  btnSalvarTexto: { color: '#fff', fontWeight: 'bold' },
  deleteContainer: { marginTop: 24, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#ccc', paddingTop: 12 },
});