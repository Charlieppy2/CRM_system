// src/types/financial-record.ts
export interface FinancialRecord {
    _id: string;
    time: string;
    member: string;
    item: string;
    details: string;
    location: string;
    unitPrice: number;
    quantity: number;
    totalAmount: number;
    type: 'income' | 'expense';
  }