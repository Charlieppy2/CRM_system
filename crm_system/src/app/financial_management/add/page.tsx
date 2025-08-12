'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import FinancialSidebar from '@/app/components/FinancialSidebar';

export default function AddFinancialRecord() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    member: '',
    item: '',
    details: '',
    location: '',
    unitPrice: '',
    quantity: '1',
    type: 'income' as 'income' | 'expense'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateTotal = () => {
    const unitPrice = parseFloat(formData.unitPrice) || 0;
    const quantity = parseInt(formData.quantity) || 0;
    return (unitPrice * quantity).toFixed(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const totalAmount = parseFloat(calculateTotal());
      const recordData = {
        _id: Date.now().toString(), // 生成唯一ID
        ...formData,
        unitPrice: parseFloat(formData.unitPrice),
        quantity: parseInt(formData.quantity),
        totalAmount,
        time: new Date().toLocaleString('zh-TW')
      };

      // 保存到 localStorage
      const existingRecords = localStorage.getItem('financialRecords');
      const records = existingRecords ? JSON.parse(existingRecords) : [];
      records.push(recordData);
      localStorage.setItem('financialRecords', JSON.stringify(records));
      
      console.log('Record saved:', recordData);
      
      router.push('/financial_management');
    } catch (error) {
      console.error('Error saving record:', error);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      <FinancialSidebar />
      <div className="ml-64 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">新增財務記錄</h1>
            <p className="text-gray-600">創建新的財務記錄</p>
          </div>

          {/* 創建新記錄提示區 */}
          <div className="bg-blue-50 rounded-lg p-8 mb-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="text-5xl mb-4">📝</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">創建您的財務記錄</h2>
              <p className="text-gray-600 mb-4">開始記錄您的收入和支出，輕鬆管理財務</p>
            </div>
          </div>

          {/* 表單區 */}
          <div className="bg-white rounded-lg shadow p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 記錄類型 */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    記錄類型 *
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="type"
                        value="income"
                        checked={formData.type === 'income'}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">收入</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="type"
                        value="expense"
                        checked={formData.type === 'expense'}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">支出</span>
                    </label>
                  </div>
                </div>

                {/* 成員 */}
                <div>
                  <label htmlFor="member" className="block text-sm font-medium text-gray-700 mb-2">
                    成員 *
                  </label>
                  <input
                    type="text"
                    id="member"
                    name="member"
                    value={formData.member}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="輸入成員姓名"
                  />
                </div>

                {/* 項目 */}
                <div>
                  <label htmlFor="item" className="block text-sm font-medium text-gray-700 mb-2">
                    項目 *
                  </label>
                  <input
                    type="text"
                    id="item"
                    name="item"
                    value={formData.item}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="輸入項目名稱"
                  />
                </div>

                {/* 地點 */}
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                    地點
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="輸入地點"
                  />
                </div>

                {/* 單價 */}
                <div>
                  <label htmlFor="unitPrice" className="block text-sm font-medium text-gray-700 mb-2">
                    單價 *
                  </label>
                  <input
                    type="number"
                    id="unitPrice"
                    name="unitPrice"
                    value={formData.unitPrice}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>

                {/* 數量 */}
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                    數量 *
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="1"
                  />
                </div>

                {/* 詳情 */}
                <div className="md:col-span-2">
                  <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-2">
                    詳情
                  </label>
                  <textarea
                    id="details"
                    name="details"
                    value={formData.details}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="輸入詳細描述"
                  />
                </div>
              </div>

              {/* 總金額顯示 */}
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">總額：</span>
                  <span className="text-lg font-bold text-gray-900">
                    ${calculateTotal()}
                  </span>
                </div>
              </div>

              {/* 提交按鈕 */}
              <div className="flex justify-end space-x-4 pt-4">
                <Link
                  href="/financial_management"
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  取消
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? '保存中...' : '保存記錄'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}