import React, { useState } from 'react';
import { ProductionItem } from '../types';

interface QueueProps {
  items: ProductionItem[];
  onRemove: (id: string) => void;
  onSubmit: () => void;
}

export const Queue: React.FC<QueueProps> = ({ items, onRemove, onSubmit }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const totalCost = items.reduce((acc, item) => acc + item.totalCost, 0);
  const totalRetail = items.reduce((acc, item) => acc + item.totalRetail, 0);

  if (items.length === 0) return null;

  return (
    <>
      {/* Mobile Collapsed View */}
      <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-40 transition-transform duration-300 transform ${isExpanded ? 'translate-y-full' : 'translate-y-0'} md:hidden`}>
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3" onClick={() => setIsExpanded(true)}>
            <div className="bg-brand-900 text-white w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
              {items.length}
            </div>
            <div>
              <div className="text-xs text-stone-500">总计</div>
              <div className="font-bold text-brand-900">¥{totalRetail.toLocaleString()}</div>
            </div>
            <svg className="w-5 h-5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </div>
          <button
            onClick={onSubmit}
            className="bg-accent-600 text-white px-6 py-2 rounded-lg font-bold text-sm shadow-md"
          >
            提交
          </button>
        </div>
      </div>

      {/* Expanded / Desktop View */}
      <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 shadow-[0_-4px_25px_rgba(0,0,0,0.15)] z-40 flex flex-col transition-all duration-300 ${isExpanded ? 'h-[80vh]' : 'hidden md:flex md:max-h-[40vh]'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-stone-50 border-b border-stone-200">
          <div className="flex items-center gap-4 cursor-pointer md:cursor-default" onClick={() => setIsExpanded(false)}>
            {/* Mobile Close Icon */}
            <div className="md:hidden p-1 rounded-full hover:bg-stone-200">
               <svg className="w-6 h-6 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
               </svg>
            </div>
            <h3 className="font-bold text-lg text-brand-900 flex items-center gap-2">
              生产待办
              <span className="bg-brand-100 text-brand-800 px-2 py-0.5 rounded-full text-xs">
                {items.length}
              </span>
            </h3>
          </div>
          
          <div className="flex items-center gap-4 sm:gap-8">
            <div className="hidden sm:block text-right">
              <span className="text-xs text-stone-500 block">那曲总成本</span>
              <span className="font-medium text-stone-900">¥{totalCost.toLocaleString()}</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-stone-500 block">建议零售总价</span>
              <span className="font-bold text-accent-600 text-lg">¥{totalRetail.toLocaleString()}</span>
            </div>
            <button
              onClick={onSubmit}
              className="bg-brand-900 text-white px-6 py-2.5 rounded-lg hover:bg-brand-800 text-sm font-bold shadow-lg shadow-brand-900/20 transition-colors"
            >
              提交入库
            </button>
          </div>
        </div>
        
        {/* Table/List */}
        <div className="overflow-y-auto flex-grow bg-white">
          <div className="md:hidden divide-y divide-stone-100">
             {/* Mobile List View */}
             {items.map((item) => (
                <div key={item.id} className="p-4 flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-brand-900">{item.specName}</span>
                      <span className="text-xs bg-stone-100 text-stone-500 px-1.5 py-0.5 rounded">{item.type === 'bottle' ? '瓶装' : '礼盒'}</span>
                    </div>
                    <p className="text-xs text-stone-500 mb-2 leading-relaxed">{item.details}</p>
                    <div className="flex gap-4 text-sm">
                      <span className="text-stone-600">{item.totalRoots} 根</span>
                      <span className="font-bold text-accent-600">¥{item.totalRetail.toLocaleString()}</span>
                    </div>
                  </div>
                  <button onClick={() => onRemove(item.id)} className="p-2 text-stone-400 hover:text-red-500">
                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                     </svg>
                  </button>
                </div>
             ))}
          </div>

          <table className="min-w-full divide-y divide-stone-100 hidden md:table">
            <thead className="bg-stone-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-stone-500 text-xs uppercase tracking-wider w-24">规格</th>
                <th className="px-6 py-3 text-left font-medium text-stone-500 text-xs uppercase tracking-wider">详情描述</th>
                <th className="px-6 py-3 text-right font-medium text-stone-500 text-xs uppercase tracking-wider w-32">总根数</th>
                <th className="px-6 py-3 text-right font-medium text-stone-500 text-xs uppercase tracking-wider w-32">成本</th>
                <th className="px-6 py-3 text-right font-medium text-stone-500 text-xs uppercase tracking-wider w-32">零售价</th>
                <th className="px-6 py-3 text-center font-medium text-stone-500 text-xs uppercase tracking-wider w-16"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-stone-100">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-stone-50 transition-colors group">
                  <td className="px-6 py-4 font-bold text-brand-900">{item.specName}</td>
                  <td className="px-6 py-4 text-stone-600 text-sm">{item.details}</td>
                  <td className="px-6 py-4 text-right text-stone-900 text-sm font-medium">{item.totalRoots.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right text-stone-500 text-sm">¥{item.totalCost.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right font-bold text-accent-600">¥{item.totalRetail.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => onRemove(item.id)}
                      className="text-stone-300 hover:text-red-500 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};