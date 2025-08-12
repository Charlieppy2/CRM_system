'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AddFinancialRecord() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    member: '',
    item: '',
    details: '',
    location: '',
    unitPrice: '',
    quantity: '1',
    type: 'income' as 'income' | 'expense'
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTotal = () => {
    const unitPrice = parseFloat(formData.unitPrice) || 0;
    const quantity = parseInt(formData.quantity) || 1;
    return (unitPrice * quantity).toFixed(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const totalAmount = parseFloat(calculateTotal());
      const recordData = {
        ...formData,
        unitPrice: parseFloat(formData.unitPrice),
        quantity: parseInt(formData.quantity),
        totalAmount,
        time: new Date().toISOString()
      };

      // 這裡可以添加API調用來保存記錄
      console.log('Saving record:', recordData);
      
      // 模擬API調用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      router.push('/financial_management');
    } catch (error) {
      console.error('Error saving record:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">新增財務記錄</h1>
          <p className="text-gray-600">添加新的收入或支出記錄</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Record Type */}
            <div>
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
                  <span className="text-green-600 font-medium">收入</span>
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
                  <span className="text-red-600 font-medium">支出</span>
                </label>
              </div>
            </div>

            {/* Member */}
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

            {/* Item */}
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

            {/* Details */}
            <div>
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

            {/* Location */}
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

            {/* Price and Quantity */}
            <div className="grid grid-cols-2 gap-4">
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
            </div>

            {/* Total Amount Display */}
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">總額：</span>
                <span className="text-lg font-bold text-gray-900">
                  ${calculateTotal()}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
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
  );
} 