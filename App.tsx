import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Calculator } from './components/Calculator';
import { Settings } from './components/Settings';
import { Queue } from './components/Queue';
import { History } from './components/History';
import { Login } from './components/Login';
import { INITIAL_DATA } from './constants';
import { AppData, ProductionItem, Batch } from './types';

export default function App() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // App state
  const [activeTab, setActiveTab] = useState<'calculator' | 'settings' | 'history'>('calculator');
  const [data, setData] = useState<AppData>(INITIAL_DATA);
  const [queue, setQueue] = useState<ProductionItem[]>([]);
  const [history, setHistory] = useState<Batch[]>([]);

  // Check login status on mount
  useEffect(() => {
    const authStatus = localStorage.getItem('is_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    setIsCheckingAuth(false);
  }, []);

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

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('is_authenticated', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('is_authenticated');
    setActiveTab('calculator'); // Reset tab
  };

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
        totalNagquPrice: queue.reduce((acc, i) => acc + i.totalNagquPrice, 0),
        totalChannelPrice: queue.reduce((acc, i) => acc + i.totalChannelPrice, 0),
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

  if (isCheckingAuth) return null; // Or a loading spinner

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="pb-32 sm:pb-40 relative"> 
        {activeTab === 'calculator' && (
           <Calculator data={data} onAddItem={handleAddItem} />
        )}
        {activeTab === 'settings' && (
           <div className="flex flex-col gap-6">
             <Settings data={data} onUpdate={setData} />
             <div className="text-center pb-8">
                <button 
                  onClick={handleLogout}
                  className="text-stone-400 hover:text-brand-900 text-sm underline decoration-stone-300 underline-offset-4"
                >
                  退出登录
                </button>
             </div>
           </div>
        )}
        {activeTab === 'history' && (
           <History batches={history} onClear={handleClearHistory} />
        )}
      </div>
      
      {activeTab === 'calculator' && (
        <Queue items={queue} onRemove={handleRemoveItem} onSubmit={handleSubmit} />
      )}
    </Layout>
  );
}