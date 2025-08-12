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

export default function FinancialByName() {
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<FinancialRecord[]>([]);
  const [selectedMember, setSelectedMember] = useState('');
  const [members, setMembers] = useState<string[]>([]);
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
        time: '2024-01-17 09:15',
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
        time: '2024-01-18 16:45',
        member: '王五',
        item: '課程費用',
        details: '私人教練課程',
        location: '台北市',
        unitPrice: 800,
        quantity: 1,
        totalAmount: 800,
        type: 'income'
      }
    ];

    setRecords(mockRecords);
    
    // 提取所有成員姓名
    const uniqueMembers = [...new Set(mockRecords.map(record => record.member))];
    setMembers(uniqueMembers);
    
    setLoading(false);
  }, []);

  useEffect(() => {
    if (selectedMember) {
      const filtered = records.filter(record => record.member === selectedMember);
      setFilteredRecords(filtered);
    } else {
      setFilteredRecords(records);
    }
  }, [selectedMember, records]);

  const getMemberStats = (memberName: string) => {
    const memberRecords = records.filter(record => record.member === memberName);
    const income = memberRecords
      .filter(record => record.type === 'income')
      .reduce((sum, record) => sum + record.totalAmount, 0);
    const expense = memberRecords
      .filter(record => record.type === 'expense')
      .reduce((sum, record) => sum + record.totalAmount, 0);
    const net = income - expense;
    
    return { income, expense, net };
  };

  const allStats = getMemberStats(selectedMember);

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">按姓名分類</h1>
          <p className="text-gray-600">按成員姓名查看財務記錄</p>
        </div>

        {/* Member Selection */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">選擇成員：</label>
            <select
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">全部成員</option>
              {members.map(member => (
                <option key={member} value={member}>{member}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Member Statistics */}
        {selectedMember && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-700 font-medium mb-2">{selectedMember} - 總收入</h3>
              <p className="text-2xl font-bold text-green-600">${allStats.income.toFixed(2)}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-700 font-medium mb-2">{selectedMember} - 總支出</h3>
              <p className="text-2xl font-bold text-red-600">${allStats.expense.toFixed(2)}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-700 font-medium mb-2">{selectedMember} - 淨額</h3>
              <p className={`text-2xl font-bold ${allStats.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${allStats.net.toFixed(2)}
              </p>
            </div>
          </div>
        )}

        {/* Financial Records Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {selectedMember ? `${selectedMember}的財務記錄` : '所有財務記錄'}
            </h2>
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
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
                      {selectedMember ? `暫無${selectedMember}的財務記錄` : '暫無財務記錄'}
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
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 