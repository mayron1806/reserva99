const transactionTypes = {
  'Invoice': 'Receita',
  'Expense': 'Despesa'
} as const;

const transactionStatus = {
  'PAID': 'Pago',
  'UNPAID': 'Não pago'
} as const;

type TransactionTypeKey = keyof typeof transactionTypes;
export const formatType = (type: keyof typeof transactionTypes | typeof transactionTypes[TransactionTypeKey]) => {
  if (type === 'Invoice' || type === 'Expense') {
    return transactionTypes[type];
  }
  if (type === 'Despesa' || type === 'Receita') {
    return Object.keys(transactionTypes).find(k => transactionTypes[k as TransactionTypeKey]  === type);
  }
}
type TransactionStatusKey = keyof typeof transactionStatus;

export const formatStatus = (status: keyof typeof transactionStatus | typeof transactionStatus[TransactionStatusKey]) => {
  if (status === 'PAID' || status === 'UNPAID') {
    return transactionStatus[status];
  }
  if (status === 'Pago' || status === 'Não pago') {
    const key = Object.keys(transactionStatus).find(k => transactionStatus[k as TransactionStatusKey] === status);
    return key as TransactionStatusKey | undefined;
  }
}