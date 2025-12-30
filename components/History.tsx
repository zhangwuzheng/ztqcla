import React, { useState } from 'react';
import { Batch } from '../types';

interface HistoryProps {
  batches: Batch[];
  onClear: () => void;
}

export const History: React.FC<HistoryProps> = ({ batches, onClear }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleExportCSV = () => {
    if (batches.length === 0) return;
    
    // Header
    let csvContent = "\ufeff日期,规格,详情,总根数,那曲发货总价,藏境发货总价,建议零售总价\n";
    
    batches.forEach(batch => {
      batch.items.forEach(item => {
        csvContent += `${batch.date},${item.specName},"${item.details}",${item.totalRoots},${item.totalNagquPrice},${item.totalChannelPrice},${item.totalRetail}\n`;
      });
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `藏境扎塔奇生产记录_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (batches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-stone-400">
        <svg className="w-16 h-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-lg font-medium">暂无提交记录</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-brand-900">历史提交记录</h2>
        <div className="flex gap-2">
          <button 
            onClick={handleExportCSV}
            className="text-sm bg-accent-600 text-white px-4 py-2 rounded-lg hover:bg-accent-700 transition-colors shadow-sm font-bold flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            导出表格
          </button>
          <button 
            onClick={() => { if(confirm('确定清空所有记录吗？')) onClear(); }}
            className="text-sm text-red-500 hover:text-red-700 px-3 py-1 rounded hover:bg-red-50 transition-colors"
          >
            清空记录
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {batches.map((batch) => (
          <div key={batch.id} className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm transition-all hover:shadow-md">
            <div 
              className="px-6 py-4 cursor-pointer flex justify-between items-center bg-stone-50 hover:bg-stone-100 transition-colors"
              onClick={() => setExpandedId(expandedId === batch.id ? null : batch.id)}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                <span className="font-bold text-brand-900 text-lg">{batch.date}</span>
                <span className="text-sm text-stone-500 bg-white px-2 py-0.5 rounded border border-stone-200 inline-block w-fit">
                  包含 {batch.itemCount} 项商品
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <div className="text-[10px] text-stone-400 uppercase leading-none">藏境发货总计</div>
                  <div className="font-medium text-stone-600">¥{batch.totalChannelPrice.toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-stone-400 uppercase leading-none">建议零售总额</div>
                  <div className="font-bold text-accent-600">¥{batch.totalRetail.toLocaleString()}</div>
                </div>
                <svg 
                  className={`w-5 h-5 text-stone-400 transition-transform ${expandedId === batch.id ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {expandedId === batch.id && (
              <div className="border-t border-stone-200">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-stone-100 text-sm">
                    <thead className="bg-stone-50/50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase">规格</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase">详情描述</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-stone-500 uppercase">那曲发货</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-stone-500 uppercase">藏境发货</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-stone-500 uppercase">建议零售</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 bg-white">
                      {batch.items.map(item => (
                        <tr key={item.id} className="hover:bg-stone-50 transition-colors">
                          <td className="px-6 py-3 font-bold text-brand-900">{item.specName}</td>
                          <td className="px-6 py-3 text-stone-600 text-xs">{item.details}</td>
                          <td className="px-6 py-3 text-right text-stone-400 text-[10px]">¥{item.totalNagquPrice.toLocaleString()}</td>
                          <td className="px-6 py-3 text-right text-stone-600 font-medium">¥{item.totalChannelPrice.toLocaleString()}</td>
                          <td className="px-6 py-3 text-right font-bold text-accent-600">¥{item.totalRetail.toLocaleString()}</td>
                        </tr>
                      ))}
                      <tr className="bg-stone-50">
                        <td colSpan={2} className="px-6 py-3 text-right font-bold text-stone-900 text-sm">本次批次合计</td>
                        <td className="px-6 py-3 text-right text-stone-400 text-xs">¥{batch.totalNagquPrice.toLocaleString()}</td>
                        <td className="px-6 py-3 text-right text-stone-700 font-bold">¥{batch.totalChannelPrice.toLocaleString()}</td>
                        <td className="px-6 py-3 text-right text-accent-600 font-black">¥{batch.totalRetail.toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};