import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Calculator } from './components/Calculator';
import { Settings } from './components/Settings';
import { Queue } from './components/Queue';
import { History } from './components/History';
import { INITIAL_DATA } from './constants';
import { AppData, ProductionItem, Batch } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'calculator' | 'settings' | 'history'>('calculator');
  const [data, setData] = useState<AppData>(INITIAL_DATA);
  const [queue, setQueue] = useState<ProductionItem[]>([]);
  const [history, setHistory] = useState<Batch[]>([]);

  // Load history from local storage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('packaging_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const saveHistory = (newHistory: Batch[]) => {
    setHistory(newHistory);
    localStorage.setItem('packaging_history', JSON.stringify(newHistory));
  };

  const handleAddItem = (item: ProductionItem) => {
    setQueue((prev) => [...prev, item]);
  };

  const handleRemoveItem = (id: string) => {
    setQueue((prev) => prev.filter(i => i.id !== id));
  };

  const handleSubmit = () => {
    if (confirm(`确认提交 ${queue.length} 条数据入库保存吗?`)) {
      const newBatch: Batch = {
        id: Date.now().toString(),
        date: new Date().toLocaleString('zh-CN'),
        items: [...queue],
        totalCost: queue.reduce((acc, i) => acc + i.totalCost, 0),
        totalRetail: queue.reduce((acc, i) => acc + i.totalRetail, 0),
        itemCount: queue.length
      };

      saveHistory([newBatch, ...history]);
      setQueue([]);
      alert('提交成功！已保存至历史记录。');
      setActiveTab('history');
    }
  };

  const handleClearHistory = () => {
    saveHistory([]);
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="pb-32 sm:pb-40"> 
        {activeTab === 'calculator' && (
           <Calculator data={data} onAddItem={handleAddItem} />
        )}
        {activeTab === 'settings' && (
           <Settings data={data} onUpdate={setData} />
        )}
        {activeTab === 'history' && (
           <History batches={history} onClear={handleClearHistory} />
        )}
      </div>
      
      {/* Show queue only on calculator tab or if not empty, but usually best just on calculator */}
      {activeTab === 'calculator' && (
        <Queue items={queue} onRemove={handleRemoveItem} onSubmit={handleSubmit} />
      )}
    </Layout>
  );
}