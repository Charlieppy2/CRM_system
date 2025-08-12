'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface FinancialRecord {
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

interface MonthlyStats {
  month: string;
  income: number;
  expense: number;
  net: number;
}

export default function FinancialReports() {
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模擬數據
    const mockRecords: FinancialRecord[] = [
      {
        _id: '1',
        time: '2024-01-15 10:30',
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
        time: '2024-01-16 14:20',
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
        time: '2024-02-17 09:15',
        member: '張三',
        item: '器材購買',
        details: '瑜伽球',
        location: '台北市',
        unitPrice: 200,
        quantity: 1,
        totalAmount: 200,
        type: 'expense'
      },
      {
        _id: '4',
        time: '2024-02-18 16:45',
        member: '王五',
        item: '課程費用',
        details: '私人教練課程',
        location: '台北市',
        unitPrice: 800,
        quantity: 1,
        totalAmount: 800,
        type: 'income'
      },
      {
        _id: '5',
        time: '2024-03-20 11:00',
        member: '趙六',
        item: '課程費用',
        details: '團體課程',
        location: '台北市',
        unitPrice: 300,
        quantity: 1,
        totalAmount: 300,
        type: 'income'
      }
    ];

    setRecords(mockRecords);
    
    // 計算月度統計
    const monthlyData = calculateMonthlyStats(mockRecords);
    setMonthlyStats(monthlyData);
    
    setLoading(false);
  }, []);

  const calculateMonthlyStats = (records: FinancialRecord[]): MonthlyStats[] => {
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

  const getTopMembers = () => {
    const memberStats = new Map<string, { income: number; expense: number; net: number }>();
    
    records.forEach(record => {
      if (!memberStats.has(record.member)) {
        memberStats.set(record.member, { income: 0, expense: 0, net: 0 });
      }
      
      const stats = memberStats.get(record.member)!;
      if (record.type === 'income') {
        stats.income += record.totalAmount;
      } else {
        stats.expense += record.totalAmount;
      }
      stats.net = stats.income - stats.expense;
    });
    
    return Array.from(memberStats.entries())
      .map(([member, stats]) => ({ member, ...stats }))
      .sort((a, b) => b.net - a.net);
  };

  const getTopItems = () => {
    const itemStats = new Map<string, { total: number; count: number }>();
    
    records.forEach(record => {
      if (!itemStats.has(record.item)) {
        itemStats.set(record.item, { total: 0, count: 0 });
      }
      
      const stats = itemStats.get(record.item)!;
      stats.total += record.totalAmount;
      stats.count += 1;
    });
    
    return Array.from(itemStats.entries())
      .map(([item, stats]) => ({ item, ...stats }))
      .sort((a, b) => b.total - a.total);
  };

  const totalIncome = records
    .filter(record => record.type === 'income')
    .reduce((sum, record) => sum + record.totalAmount, 0);

  const totalExpense = records
    .filter(record => record.type === 'expense')
    .reduce((sum, record) => sum + record.totalAmount, 0);

  const netAmount = totalIncome - totalExpense;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link
              href="/financial_management"
              className="text-blue-600 hover:text-blue-800 mr-4"
            >
              ← 返回財務管理
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">財務報告</h1>
          <p className="text-gray-600">查看詳細的財務統計和分析</p>
        </div>

        {/* Overall Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-700 font-medium mb-2">總收入</h3>
            <p className="text-2xl font-bold text-green-600">${totalIncome.toFixed(2)}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-700 font-medium mb-2">總支出</h3>
            <p className="text-2xl font-bold text-red-600">${totalExpense.toFixed(2)}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-700 font-medium mb-2">淨額</h3>
            <p className={`text-2xl font-bold ${netAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${netAmount.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Monthly Statistics */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">月度統計</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    月份
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    收入
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    支出
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    淨額
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {monthlyStats.map((stat) => (
                  <tr key={stat.month} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {stat.month}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                      ${stat.income.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                      ${stat.expense.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={stat.net >= 0 ? 'text-green-600' : 'text-red-600'}>
                        ${stat.net.toFixed(2)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Members and Items */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Members */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">成員排名</h2>
            </div>
            <div className="p-6">
              {getTopMembers().slice(0, 5).map((member, index) => (
                <div key={member.member} className="flex justify-between items-center py-2">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-500 w-6">{index + 1}.</span>
                    <span className="text-sm text-gray-900">{member.member}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      ${member.net.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">
                      收入: ${member.income.toFixed(2)} | 支出: ${member.expense.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Items */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">熱門項目</h2>
            </div>
            <div className="p-6">
              {getTopItems().slice(0, 5).map((item, index) => (
                <div key={item.item} className="flex justify-between items-center py-2">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-500 w-6">{index + 1}.</span>
                    <span className="text-sm text-gray-900">{item.item}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      ${item.total.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.count} 筆記錄
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 