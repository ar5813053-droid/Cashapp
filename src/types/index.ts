export type VirtualCard = {
  id: string;
  label: string;
  last4: string;
  color: string;
  textColor: string;
  frozen: boolean;
};

export type Recipient = {
  id: string;
  name: string;
  handle: string;
  avatarColor: string;
  initials: string;
};

export type LinkedAccount = {
  id: string;
  name: string;
  bank: string;
  last4: string;
  avatarColor: string;
  initials: string;
};

export type Transaction = {
  id: string;
  merchant: string;
  amount: number;
  icon: 'apple' | 'threads' | 'generic' | 'transfer';
  iconColor: string;
  date: string;
};

export type PaymentDraft = {
  recipientId: string | null;
  amount: number;
  cardId: string | null;
  expression: string;
};
