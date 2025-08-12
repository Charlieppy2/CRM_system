'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function FinancialSidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/financial_management') {
      return pathname === '/financial_management';
    }
    return pathname.startsWith(path);
  };

  return (
    <div className="w-64 bg-white shadow-lg h-screen fixed left-0 top-16 z-40">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">財務管理系統</h2>
        
        {/* 主要功能 */}
        <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-600 mb-3">主要功能</h3>
          <nav className="space-y-2">
            <Link
              href="/financial_management"
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive('/financial_management') && pathname === '/financial_management'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>財務總覽</span>
            </Link>

            <Link
              href="/financial_management/by-name"
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive('/financial_management/by-name')
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>按姓名分類</span>
            </Link>

            <Link
              href="/financial_management/reports"
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive('/financial_management/reports')
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
              <span>財務報告</span>
            </Link>

            <Link
              href="/financial_management/add"
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive('/financial_management/add')
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>新增記錄</span>
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
} 