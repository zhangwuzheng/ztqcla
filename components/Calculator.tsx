import React, { useState, useEffect } from 'react';
import { AppData, ProductionItem, ProductSpec, BottleRule } from '../types';

interface CalculatorProps {
  data: AppData;
  onAddItem: (item: ProductionItem) => void;
}

export const Calculator: React.FC<CalculatorProps> = ({ data, onAddItem }) => {
  const [selectedSpecId, setSelectedSpecId] = useState<string>(data.specs[0]?.id || '');
  const [mode, setMode] = useState<'bottle' | 'box'>('bottle');
  
  // Bottle Mode State
  const [bottleSize, setBottleSize] = useState<'small' | 'medium'>('small');
  const [boxConfig, setBoxConfig] = useState<number>(0); 
  const [quantity, setQuantity] = useState<number>(1);
  
  // Box/Gram Mode State
  const [gramWeight, setGramWeight] = useState<number>(50);

  // Derived State
  const spec = data.specs.find(s => s.id === selectedSpecId);
  const bottleRule = data.bottleRules.find(r => r.specId === selectedSpecId);

  useEffect(() => {
    if (bottleRule && mode === 'bottle') {
      const options = bottleSize === 'small' ? bottleRule.smallBottlesPerBox : bottleRule.mediumBottlesPerBox;
      if (options && options.length > 0) {
        setBoxConfig(options[0]);
      } else {
        setBoxConfig(1);
      }
    }
  }, [selectedSpecId, bottleSize, mode, bottleRule]);

  if (!spec || !bottleRule) return <div className="p-8 text-center text-stone-500">正在加载数据...</div>;

  // Calculation
  let calculated = {
    totalRoots: 0,
    totalCost: 0,
    totalRetail: 0,
    description: ''
  };

  if (mode === 'bottle') {
    const rootsPerBottle = bottleSize === 'small' ? bottleRule.smallBottleCount : bottleRule.mediumBottleCount;
    const bottlesPerUnit = boxConfig; 
    const totalBottles = quantity * bottlesPerUnit;
    
    calculated.totalRoots = totalBottles * rootsPerBottle;
    calculated.totalCost = calculated.totalRoots * spec.costPrice;
    calculated.totalRetail = calculated.totalRoots * spec.retailPrice;
    
    const boxText = boxConfig > 1 ? `(共${quantity}盒, 每盒${boxConfig}瓶)` : `(${quantity}瓶散装)`;
    // Updated description to explicitly include total roots
    calculated.description = `规格:${spec.name} - ${bottleSize === 'small' ? '小瓶' : '中瓶'} (${rootsPerBottle}根/瓶) x ${totalBottles}瓶 ${boxText} [总根数:${calculated.totalRoots}]`;
  } else {
    const totalGrams = gramWeight * quantity;
    const rootsPerBox = Math.round(gramWeight * spec.rootsPerGram);
    calculated.totalRoots = rootsPerBox * quantity;
    calculated.totalCost = calculated.totalRoots * spec.costPrice;
    calculated.totalRetail = calculated.totalRoots * spec.retailPrice;
    // Updated description to explicitly include total roots
    calculated.description = `规格:${spec.name} - ${gramWeight}克礼盒 (约${rootsPerBox}根) x ${quantity}盒 [总根数:${calculated.totalRoots}]`;
  }

  const handleAdd = () => {
    onAddItem({
      id: Math.random().toString(36).substr(2, 9),
      specName: spec.name,
      type: mode,
      details: calculated.description,
      totalRoots: calculated.totalRoots,
      totalCost: calculated.totalCost,
      totalRetail: calculated.totalRetail,
      timestamp: Date.now(),
    });
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
      {/* Left Panel: Configuration */}
      <div className="xl:col-span-2 space-y-6">
        {/* Spec Selection */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-stone-200">
          <h2 className="text-lg font-bold text-brand-900 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-800 flex items-center justify-center text-xs font-bold">1</span>
            选择规格
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {data.specs.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedSpecId(s.id)}
                className={`relative flex flex-col items-center justify-center p-3 rounded-xl border text-sm transition-all duration-200 group ${
                  selectedSpecId === s.id
                    ? 'border-accent-500 bg-brand-900 text-white shadow-md transform scale-[1.02]'
                    : 'border-stone-200 bg-stone-50 hover:border-brand-300 hover:bg-white text-stone-600'
                }`}
              >
                <span className="font-medium text-base">{s.name}</span>
                <span className={`text-xs mt-1 ${selectedSpecId === s.id ? 'text-accent-400' : 'text-stone-400'}`}>
                  ¥{s.retailPrice}/根
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Configuration */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-stone-200">
          <h2 className="text-lg font-bold text-brand-900 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-800 flex items-center justify-center text-xs font-bold">2</span>
            包装配置
          </h2>
          
          <div className="flex p-1 bg-stone-100 rounded-xl mb-6">
            <button
              onClick={() => setMode('bottle')}
              className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${
                mode === 'bottle' 
                  ? 'bg-white text-brand-900 shadow-sm ring-1 ring-black/5' 
                  : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              瓶装模式
            </button>
            <button
              onClick={() => setMode('box')}
              className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${
                mode === 'box' 
                  ? 'bg-white text-brand-900 shadow-sm ring-1 ring-black/5' 
                  : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              礼盒/称重
            </button>
          </div>

          <div className="animate-fadeIn">
            {mode === 'bottle' ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-stone-500 mb-2 uppercase tracking-wide">瓶型选择</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setBottleSize('small')}
                      className={`p-4 border rounded-xl text-left transition-all ${
                        bottleSize === 'small' 
                          ? 'border-accent-500 bg-accent-100/10 ring-1 ring-accent-500' 
                          : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <div className="font-bold text-brand-900">小瓶</div>
                      <div className="text-xs text-stone-500 mt-1">{bottleRule.smallBottleCount} 根/瓶</div>
                    </button>
                    <button
                      onClick={() => setBottleSize('medium')}
                      className={`p-4 border rounded-xl text-left transition-all ${
                        bottleSize === 'medium' 
                          ? 'border-accent-500 bg-accent-100/10 ring-1 ring-accent-500' 
                          : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <div className="font-bold text-brand-900">中瓶</div>
                      <div className="text-xs text-stone-500 mt-1">{bottleRule.mediumBottleCount} 根/瓶</div>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-500 mb-2 uppercase tracking-wide">装箱规格</label>
                  <select
                    value={boxConfig}
                    onChange={(e) => setBoxConfig(Number(e.target.value))}
                    className="block w-full rounded-xl border-stone-300 bg-stone-50 py-3 px-4 shadow-sm focus:border-accent-500 focus:ring-accent-500 text-brand-900"
                  >
                    {(bottleSize === 'small' ? bottleRule.smallBottlesPerBox : bottleRule.mediumBottlesPerBox).map(num => (
                      <option key={num} value={num}>{num} 瓶 / 盒</option>
                    ))}
                    <option value={1}>散装单瓶</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-stone-500 mb-2 uppercase tracking-wide">每盒克重</label>
                  <div className="flex gap-4">
                    {[50, 100].map(w => (
                      <button
                        key={w}
                        onClick={() => setGramWeight(w)}
                        className={`flex-1 p-4 border rounded-xl text-center font-bold transition-all ${
                          gramWeight === w 
                            ? 'border-accent-500 bg-accent-100/10 text-brand-900 ring-1 ring-accent-500' 
                            : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        {w}g / 盒
                      </button>
                    ))}
                  </div>
                </div>
                <div className="bg-brand-50 border border-brand-100 p-5 rounded-xl flex items-center justify-between">
                   <span className="text-sm font-medium text-brand-700">预估包含根数</span>
                   <span className="text-2xl font-bold text-brand-900">
                     ~{Math.round(gramWeight * spec.rootsPerGram)} <span className="text-sm font-normal text-stone-500">根</span>
                   </span>
                </div>
              </div>
            )}
            
            <div className="mt-8 pt-6 border-t border-stone-100">
              <label className="block text-sm font-medium text-stone-500 mb-3 uppercase tracking-wide">数量</label>
              <div className="flex items-center gap-4">
                <div className="relative flex items-center w-40">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="absolute left-0 w-10 h-full text-stone-500 hover:text-brand-900 font-bold bg-stone-100 rounded-l-lg border-r border-stone-200"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
                    className="block w-full rounded-lg border-stone-300 text-center py-3 px-10 shadow-sm focus:border-accent-500 focus:ring-accent-500 text-xl font-bold text-brand-900"
                  />
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="absolute right-0 w-10 h-full text-stone-500 hover:text-brand-900 font-bold bg-stone-100 rounded-r-lg border-l border-stone-200"
                  >
                    +
                  </button>
                </div>
                <span className="text-lg font-medium text-stone-600">
                  {mode === 'bottle' && boxConfig > 1 ? '盒' : (mode === 'bottle' ? '瓶' : '盒')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Summary */}
      <div className="xl:col-span-1">
        <div className="bg-brand-900 rounded-2xl shadow-xl overflow-hidden sticky top-24 border border-brand-800 text-stone-100">
          <div className="px-6 py-5 border-b border-brand-800 flex justify-between items-center bg-black/20">
            <h3 className="text-lg font-bold text-white">费用预估</h3>
            <span className="text-xs font-medium bg-brand-800 text-accent-500 px-2 py-1 rounded border border-brand-700">{spec.name}</span>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="space-y-1">
              <p className="text-sm text-stone-400">总根数</p>
              <p className="text-4xl font-bold text-white tracking-tight">{calculated.totalRoots.toLocaleString()}</p>
            </div>
            
            <div className="pt-6 border-t border-brand-800 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-stone-400 text-sm">那曲成本 ({spec.costPrice})</span>
                <span className="font-medium text-stone-200">¥{calculated.totalCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-end">
                 <span className="text-accent-500 text-sm font-medium">建议零售总价</span>
                 <span className="text-2xl font-bold text-accent-500">¥{calculated.totalRetail.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-brand-800/50 p-4 rounded-xl text-xs text-stone-300 leading-relaxed border border-brand-700/50">
              {calculated.description}
            </div>

            <button
              onClick={handleAdd}
              className="w-full bg-accent-600 text-white py-4 px-4 rounded-xl font-bold hover:bg-accent-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 shadow-lg shadow-accent-900/20 transition-all transform active:scale-[0.98]"
            >
              加入待办列表
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};