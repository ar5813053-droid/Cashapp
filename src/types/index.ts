export type VirtualCard = {
  id: string;
  label: string;
  last4: string;
  color: string;
  textColor: string;
  frozen?: boolean;
  holderName?: string;
  expiry?: string;
  cvv?: string;
  displayBalance?: number;
  backgroundUri?: string | null;
  numberDisplay?: string;
};

export type Transaction = {
  id: string;
  merchant: string;
  amount: number;
  date?: string;
};

export type Recipient = {
  id: string;
  name: string;
  handle: string;
  initials: string;
  avatarColor: string;
};

export type LinkedAccount = {
  id: string;
  name: string;
  bank: string;
  last4: string;
  initials: string;
  avatarColor: string;
};
