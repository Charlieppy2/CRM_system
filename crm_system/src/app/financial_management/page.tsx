'use client';

import { useState, useEffect, useCallback } from 'react';
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

export default function FinancialManagement() {
  const { user, isLoading } = useAuth();
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<FinancialRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 從 localStorage 獲取保存的記錄
    const savedRecords = localStorage.getItem('financialRecords');
    if (savedRecords) {
      const parsedRecords = JSON.parse(savedRecords);
      setRecords(parsedRecords);
      setFilteredRecords(parsedRecords);
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
      localStorage.setItem('financialRecords', JSON.stringify(mockRecords));
    }
    setLoading(false);
  }, []);

  // 搜索功能
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredRecords(records);
    } else {
      const filtered = records.filter(record =>
        record.member.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRecords(filtered);
    }
  }, [searchTerm, records]);

  // 計算統計數據
  const totalIncome = filteredRecords
    .filter(record => record.type === 'income')
    .reduce((sum, record) => sum + record.totalAmount, 0);

  const totalExpense = filteredRecords
    .filter(record => record.type === 'expense')
    .reduce((sum, record) => sum + record.totalAmount, 0);

  const netAmount = totalIncome - totalExpense;

  const handleDelete = useCallback((id: string) => {
    if (window.confirm('確定要刪除這筆記錄嗎？')) {
      const existingRecords = localStorage.getItem('financialRecords');
      if (existingRecords) {
        const records = JSON.parse(existingRecords);
        const newRecords = records.filter((r: any) => r._id !== id);
        localStorage.setItem('financialRecords', JSON.stringify(newRecords));
        setRecords(newRecords);
        setFilteredRecords(newRecords);
      }
    }
  }, [setRecords, setFilteredRecords]);

  // 如果正在檢查身份驗證，顯示載入狀態
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
        </div>
      </div>
    );
  }

  // 如果用戶未登入，顯示未授權訊息
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
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
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">財務管理</h1>
              <p className="text-gray-600">管理成員的收支記錄</p>
            </div>
            <Link
              href="/financial_management/add"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              新增記錄
            </Link>
          </div>

          {/* 搜索欄 */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="搜索成員、項目、詳情或地點..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  找到 {filteredRecords.length} 筆記錄
                </span>
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

          {/* Financial Records Table */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">財務記錄</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      時間
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      成員
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      項目
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      詳情
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      地點
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      單價
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      數量
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      總額
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      類型
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="px-6 py-4 text-center text-gray-500">
                        {searchTerm ? '沒有找到匹配的記錄' : '暫無財務記錄'}
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((record) => (
                      <tr key={record._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.time}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.member}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.item}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.details}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.location}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${record.unitPrice.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${record.totalAmount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              record.type === 'income'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {record.type === 'income' ? '收入' : '支出'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <Link
                            href={`/financial_management/edit/${record._id}`}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors mr-2"
                          >
                            修改
                          </Link>
                          <button
                            onClick={() => handleDelete(record._id)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                          >
                            刪除
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}