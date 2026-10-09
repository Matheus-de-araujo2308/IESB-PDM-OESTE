import DespesaSaida from '../components/despesa/DespesaSaida';

export default function DespesasRecentes({ despesas, onSelectDespesa }) {
  return (
    <DespesaSaida
      despesas={despesas}
      periodo="Últimos 7 dias"
      onSelectDespesa={onSelectDespesa}
    />
  );
}