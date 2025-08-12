import { FinancialRecord, MonthlyStats } from '@/types';

// 使用模块作用域变量保持数据状态
let records: FinancialRecord[] = [
  {
    _id: '1',
    time: '2024-01-15T10:30:00Z',
    member: '張三',
    item: '課程費用',
    details: '瑜伽課程',
    location: '台北市',
    unitPrice: 500,
    quantity: 1,
    totalAmount: 500,
    type: 'income'
  },
  {
    _id: '2',
    time: '2024-01-16T14:20:00Z',
    member: '李四',
    item: '器材購買',
    details: '瑜伽墊',
    location: '台北市',
    unitPrice: 149.94,
    quantity: 1,
    totalAmount: 149.94,
    type: 'expense'
  },
  {
    _id: '3',
    time: '2024-02-10T09:15:00Z',
    member: '王五',
    item: '課程費用',
    details: '私人教練',
    location: '台北市',
    unitPrice: 800,
    quantity: 1,
    totalAmount: 800,
    type: 'income'
  }
];

// 获取所有记录
export const getRecords = async (): Promise<FinancialRecord[]> => {
  return records;
};

// 按ID获取记录
export const getRecordById = async (id: string): Promise<FinancialRecord | undefined> => {
  return records.find(record => record._id === id);
};

// 添加记录
export const addRecord = async (record: Omit<FinancialRecord, '_id'>): Promise<FinancialRecord> => {
  const newRecord: FinancialRecord = {
    ...record,
    _id: Date.now().toString(),
    time: new Date().toISOString()
  };
  records = [...records, newRecord];
  return newRecord;
};

// 更新记录
export const updateRecord = async (id: string, record: Partial<FinancialRecord>): Promise<FinancialRecord> => {
  const index = records.findIndex(r => r._id === id);
  if (index === -1) throw new Error('Record not found');
  
  const updatedRecord = { 
    ...records[index], 
    ...record,
    time: new Date().toISOString() // 更新修改时间
  };
  
  records = [
    ...records.slice(0, index),
    updatedRecord,
    ...records.slice(index + 1)
  ];
  
  return updatedRecord;
};

// 删除记录
export const deleteRecord = async (id: string): Promise<void> => {
  records = records.filter(record => record._id !== id);
};

// 计算月度统计
export const getMonthlyStats = async (): Promise<MonthlyStats[]> => {
  const monthlyMap = new Map<string, { income: number; expense: number }>();
  
  records.forEach(record => {
    const date = new Date(record.time);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!monthlyMap.has(monthKey)) {
      monthlyMap.set(monthKey, { income: 0, expense: 0 });
    }
    
    const monthData = monthlyMap.get(monthKey)!;
    if (record.type === 'income') {
      monthData.income += record.totalAmount;
    } else {
      monthData.expense += record.totalAmount;
    }
  });
  
  return Array.from(monthlyMap.entries())
    .map(([month, data]) => ({
      month,
      income: data.income,
      expense: data.expense,
      net: data.income - data.expense
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
};