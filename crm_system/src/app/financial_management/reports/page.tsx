'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import FinancialSidebar from '@/app/components/FinancialSidebar';

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
  const { user, isLoading } = useAuth();
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<FinancialRecord[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([]);
  const [timeRange, setTimeRange] = useState('this-month');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 從 localStorage 獲取記錄數據
    const savedRecords = localStorage.getItem('financialRecords');
    if (savedRecords) {
      const records = JSON.parse(savedRecords);
      setRecords(records);
      setFilteredRecords(records);
    } else {
      // 默認數據
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
        }
      ];
      setRecords(mockRecords);
      setFilteredRecords(mockRecords);
    }
    setLoading(false);
  }, []);

  // 計算月度統計
  const calculateMonthlyStats = (records: FinancialRecord[]): MonthlyStats[] => {
    const monthlyData: { [key: string]: MonthlyStats } = {};
    
    records.forEach(record => {
      const date = new Date(record.time);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthKey,
          income: 0,
          expense: 0,
          net: 0
        };
      }
      
      if (record.type === 'income') {
        monthlyData[monthKey].income += record.totalAmount;
      } else {
        monthlyData[monthKey].expense += record.totalAmount;
      }
      
      monthlyData[monthKey].net = monthlyData[monthKey].income - monthlyData[monthKey].expense;
    });
    
    return Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));
  };

  // 獲取前5名成員
  const getTopMembers = () => {
    const memberStats: { [key: string]: number } = {};
    
    filteredRecords.forEach(record => {
      if (!memberStats[record.member]) {
        memberStats[record.member] = 0;
      }
      memberStats[record.member] += record.totalAmount;
    });
    
    return Object.entries(memberStats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([member, amount]) => ({ member, amount }));
  };

  // 獲取前5名項目
  const getTopItems = () => {
    const itemStats: { [key: string]: number } = {};
    
    filteredRecords.forEach(record => {
      if (!itemStats[record.item]) {
        itemStats[record.item] = 0;
      }
      itemStats[record.item] += record.totalAmount;
    });
    
    return Object.entries(itemStats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([item, amount]) => ({ item, amount }));
  };

  // 時間範圍過濾功能
  useEffect(() => {
    const now = new Date();
    let filtered = records;

    switch (timeRange) {
      case 'this-month':
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        filtered = records.filter(record => new Date(record.time) >= thisMonthStart);
        break;
      case 'last-month':
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
        filtered = records.filter(record => {
          const recordDate = new Date(record.time);
          return recordDate >= lastMonthStart && recordDate <= lastMonthEnd;
        });
        break;
      case 'this-quarter':
        const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
        filtered = records.filter(record => new Date(record.time) >= quarterStart);
        break;
      case 'custom':
        // 自定義範圍可以後續實現
        filtered = records;
        break;
      default:
        filtered = records;
    }

    setFilteredRecords(filtered);
    setMonthlyStats(calculateMonthlyStats(filtered));
  }, [timeRange, records]);

  const totalIncome = filteredRecords
    .filter(record => record.type === 'income')
    .reduce((sum, record) => sum + record.totalAmount, 0);

  const totalExpense = filteredRecords
    .filter(record => record.type === 'expense')
    .reduce((sum, record) => sum + record.totalAmount, 0);

  const netAmount = totalIncome - totalExpense;

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">需要登入</h1>
          <p className="text-gray-600 mb-6">請先登入以訪問財務管理功能</p>
          <Link
            href="/login"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            前往登入
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <FinancialSidebar />
      <div className="ml-64 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">財務報告</h1>
                <p className="text-gray-600">查看詳細的財務統計和分析</p>
              </div>
              <div className="relative">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="this-month">本月</option>
                  <option value="last-month">上個月</option>
                  <option value="this-quarter">本季度</option>
                  <option value="custom">自定義範圍</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
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

          {/* Charts and Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Monthly Trends */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">月度趨勢</h3>
              <div className="space-y-4">
                {monthlyStats.map((stat) => (
                  <div key={stat.month} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{stat.month}</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-green-600">+${stat.income.toFixed(2)}</span>
                      <span className="text-sm text-red-600">-${stat.expense.toFixed(2)}</span>
                      <span className={`text-sm font-medium ${stat.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${stat.net.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Members */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">前5名成員</h3>
              <div className="space-y-3">
                {getTopMembers().map((member, index) => (
                  <div key={member.member} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                      <span className="text-sm text-gray-900">{member.member}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">${member.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Items */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">熱門項目</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getTopItems().map((item, index) => (
                <div key={item.item} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                    <span className="text-sm text-gray-900">{item.item}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">${item.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}