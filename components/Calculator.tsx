import React, { useState, useEffect } from 'react';
import { AppData, ProductionItem, ProductSpec, BottleRule } from '../types';

interface CalculatorProps {
  data: AppData;
  onAddItem: (item: ProductionItem) => void;
}

type PackageType = 'small-small' | 'small-large' | 'medium';

const IMAGES = {
  smallSmall: "https://img.lenyiin.com/app/hide.php?key=Sk0xQmpKK25rUnFjeVFUdmRpNWFkVTVncmc1Q1ZhZkZPR2c4dUg0PQ==",
  smallLarge: "https://img.lenyiin.com/app/hide.php?key=SkdQT1c1eG15ZU9qM2ZDS08zMWphVTVncmc1Q1ZhZkZPR2c4dUg1S3R3PT0=",
  medium: "https://img.lenyiin.com/app/hide.php?key=V1lIdWhxaHl3L29BRFZrbHN1ZEpPVTVncmc1Q1ZhZkZPR2c4dUg0PQ==",
  box: "https://img.lenyiin.com/app/hide.php?key=R3YwWURBK0ptd2VQQXNENEIrOWo3VTVncmc1Q1ZhZkZPR2c4dUg1S3R3PT0="
};

const PACKAGING_COLORS = {
  gold: {
    id: 'gold',
    name: '帝王金',
    range: '900-1500规格',
    desc: '高端奢华 · 尊贵首选',
    img: "https://img.lenyiin.com/app/hide.php?key=UDYyVkpiaUI2R2dGTXFDbzhzcG1yRTVncmc1Q1ZhZkZPR2c4dUg1S3R3PT0=",
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-900",
    badge: "bg-amber-100 text-amber-700"
  },
  green: {
    id: 'green',
    name: '松石绿',
    range: '1600-2200规格',
    desc: '清新典雅 · 自然纯粹',
    img: "https://img.lenyiin.com/app/hide.php?key=bGd2aHZDaWhTVnFLVXlpRjZpVE9KMDVncmc1Q1ZhZkZPR2c4dUg0PQ==",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-900",
    badge: "bg-emerald-100 text-emerald-700"
  },
  red: {
    id: 'red',
    name: '朱砂红',
    range: '2200-3000规格',
    desc: '喜庆吉祥 · 礼赠佳品',
    img: "https://img.lenyiin.com/app/hide.php?key=QzhRdEE3cmVGMFBHRVo1cFlRMmczMDVncmc1Q1ZhZkZPR2c4dUg1S3R3PT0=",
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-900",
    badge: "bg-red-100 text-red-700"
  }
};

export const Calculator: React.FC<CalculatorProps> = ({ data, onAddItem }) => {
  const [selectedSpecId, setSelectedSpecId] = useState<string>(data.specs[0]?.id || '');
  const [mode, setMode] = useState<'bottle' | 'box'>('bottle');
  
  // Bottle Mode State
  const [packageType, setPackageType] = useState<PackageType>('small-small');
  const [boxConfig, setBoxConfig] = useState<number>(0); 
  const [quantity, setQuantity] = useState<number>(1);
  
  // Box/Gram Mode State
  const [gramWeight, setGramWeight] = useState<number>(50);
  const [customGram, setCustomGram] = useState<string>('');

  // UI State for copy feedback
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  // Derived State
  const spec = data.specs.find(s => s.id === selectedSpecId);
  const bottleRule = data.bottleRules.find(r => r.specId === selectedSpecId);

  useEffect(() => {
    if (bottleRule && mode === 'bottle') {
      let options: number[] = [];
      if (packageType === 'small-small') {
        options = bottleRule.smallBottlesSmallBox;
      } else if (packageType === 'small-large') {
        options = bottleRule.smallBottlesLargeBox;
      } else {
        options = bottleRule.mediumBottlesPerBox;
      }

      if (options && options.length > 0) {
        setBoxConfig(options[0]);
      } else {
        setBoxConfig(1);
      }
    }
  }, [selectedSpecId, packageType, mode, bottleRule]);

  if (!spec || !bottleRule) return <div className="p-8 text-center text-stone-500">正在加载数据...</div>;

  const currentWeight = customGram ? parseFloat(customGram) || 0 : gramWeight;

  // Formatting roots per gram
  const rootsPerGramText = spec.rootsPerGramMin === spec.rootsPerGramMax 
    ? `${spec.rootsPerGramMin}` 
    : `${spec.rootsPerGramMin}-${spec.rootsPerGramMax}`;

  const avgRootsPerGram = (spec.rootsPerGramMin + spec.rootsPerGramMax) / 2;

  // Determine packaging color based on roots per jin
  const recoColor = spec.rootsPerJin <= 1500 
    ? PACKAGING_COLORS.gold 
    : spec.rootsPerJin <= 2200 
      ? PACKAGING_COLORS.green 
      : PACKAGING_COLORS.red;

  // Calculation
  let calculated = {
    totalRoots: 0,
    totalNagquPrice: 0,
    totalChannelPrice: 0,
    totalRetail: 0,
    description: ''
  };

  if (mode === 'bottle') {
    const isSmallBottle = packageType.startsWith('small');
    const rootsPerBottle = isSmallBottle ? bottleRule.smallBottleCount : bottleRule.mediumBottleCount;
    const bottlesPerUnit = boxConfig; 
    const totalBottles = quantity * bottlesPerUnit;
    
    calculated.totalRoots = totalBottles * rootsPerBottle;
    calculated.totalNagquPrice = calculated.totalRoots * spec.nagquPrice;
    calculated.totalChannelPrice = calculated.totalRoots * spec.channelPrice;
    calculated.totalRetail = calculated.totalRoots * spec.retailPrice;
    
    let typeName = '';
    if (packageType === 'small-small') typeName = '小瓶小包装';
    if (packageType === 'small-large') typeName = '小瓶大包装';
    if (packageType === 'medium') typeName = '中瓶';

    const boxText = boxConfig > 1 ? `(共${quantity}盒, 每盒${boxConfig}瓶)` : `(${quantity}瓶散装)`;
    calculated.description = `规格:${spec.name}(${rootsPerGramText}根/克) - ${typeName} (${rootsPerBottle}根/瓶) x ${totalBottles}瓶 ${boxText} [总根数:${calculated.totalRoots}]`;
  } else {
    const rootsPerBox = Math.round(currentWeight * avgRootsPerGram);
    calculated.totalRoots = rootsPerBox * quantity;
    calculated.totalNagquPrice = calculated.totalRoots * spec.nagquPrice;
    calculated.totalChannelPrice = calculated.totalRoots * spec.channelPrice;
    calculated.totalRetail = calculated.totalRoots * spec.retailPrice;
    calculated.description = `规格:${spec.name}(${rootsPerGramText}根/克) - ${currentWeight}克礼盒 (约${rootsPerBox}根) x ${quantity}盒 [总根数:${calculated.totalRoots}]`;
  }

  // E-commerce Content Generation
  const ecommerceTitle = `藏境扎塔奇-那曲野生冬虫夏草约${avgRootsPerGram.toFixed(1)}根/g约${calculated.totalRoots}根高端虫草礼盒营养品生日寿礼送人`;
  
  let ecommerceSpec = '';
  if (mode === 'bottle') {
     let typeName = '';
     if (packageType === 'small-small') typeName = '小瓶小包装';
     if (packageType === 'small-large') typeName = '小瓶大包装';
     if (packageType === 'medium') typeName = '中瓶';
     
     const isSmallBottle = packageType.startsWith('small');
     const rootsPerBottle = isSmallBottle ? bottleRule.smallBottleCount : bottleRule.mediumBottleCount;
     const totalBottles = quantity * boxConfig;

     ecommerceSpec = `${spec.name}规格(${rootsPerGramText}根/克) ${typeName} (${rootsPerBottle}根/瓶)x${totalBottles}瓶`;
  } else {
     ecommerceSpec = `${spec.name}规格(${rootsPerGramText}根/克) 礼盒装 (${currentWeight}克/盒)x${quantity}盒`;
  }

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyFeedback(type);
      setTimeout(() => setCopyFeedback(null), 2000);
    });
  };

  const handleAdd = () => {
    let rootsPerBottleVal = 0;
    let totalBottlesVal = 0;
    let bottleTypeVal = '-';
    let boxTypeVal = '-';
    
    if (mode === 'bottle') {
       const isSmallBottle = packageType.startsWith('small');
       rootsPerBottleVal = isSmallBottle ? bottleRule.smallBottleCount : bottleRule.mediumBottleCount;
       totalBottlesVal = quantity * boxConfig;
       
       if (packageType === 'medium') {
         bottleTypeVal = '中瓶';
       } else {
         bottleTypeVal = '小瓶';
       }

       if (boxConfig === 1) {
         boxTypeVal = '散装';
       } else if (packageType === 'small-small') {
         boxTypeVal = '小包装';
       } else if (packageType === 'small-large') {
         boxTypeVal = '大包装';
       } else {
         boxTypeVal = '普通盒装';
       }
    } else {
      boxTypeVal = '礼盒';
    }

    onAddItem({
      id: Math.random().toString(36).substr(2, 9),
      specName: spec.name,
      rootsPerGram: rootsPerGramText,
      rootsPerBottle: rootsPerBottleVal,
      bottleCount: totalBottlesVal,
      bottleType: bottleTypeVal,
      boxType: boxTypeVal,
      packagingColor: recoColor.name,
      ecommerceSpec: ecommerceSpec,
      type: mode,
      details: calculated.description,
      totalRoots: calculated.totalRoots,
      totalNagquPrice: calculated.totalNagquPrice,
      totalChannelPrice: calculated.totalChannelPrice,
      totalRetail: calculated.totalRetail,
      timestamp: Date.now(),
    });
  };

  const bottleOptions = [
    { 
      id: 'small-small' as const, 
      label: '小瓶 (小包装)', 
      sub: '2-4瓶/盒',
      count: bottleRule.smallBottleCount,
      img: IMAGES.smallSmall
    },
    { 
      id: 'small-large' as const, 
      label: '小瓶 (大包装)', 
      sub: '8-10瓶/盒',
      count: bottleRule.smallBottleCount,
      img: IMAGES.smallLarge
    },
    { 
      id: 'medium' as const, 
      label: '中瓶', 
      sub: '2-5瓶/盒',
      count: bottleRule.mediumBottleCount,
      img: IMAGES.medium
    },
  ];

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
                <span className={`text-[10px] ${selectedSpecId === s.id ? 'text-accent-400' : 'text-stone-400'}`}>
                  {s.rootsPerGramMin === s.rootsPerGramMax ? s.rootsPerGramMin : `${s.rootsPerGramMin}-${s.rootsPerGramMax}`} 根/克
                </span>
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
                  <label className="block text-sm font-medium text-stone-500 mb-2 uppercase tracking-wide">瓶型包装</label>
                  <div className="grid grid-cols-3 gap-3">
                    {bottleOptions.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setPackageType(opt.id)}
                        className={`relative p-2 border rounded-xl flex flex-col items-center gap-2 text-center transition-all overflow-hidden ${
                          packageType === opt.id 
                            ? 'border-accent-500 bg-accent-50/50 ring-1 ring-accent-500' 
                            : 'border-stone-200 hover:border-stone-300'
                        }`}
                      >
                         <div className="w-full aspect-[4/3] rounded-lg overflow-hidden bg-stone-100 mb-1">
                           <img src={opt.img} alt={opt.label} className="w-full h-full object-cover" />
                         </div>
                         <div className="px-1 pb-1">
                            <div className="font-bold text-brand-900 text-sm leading-tight">{opt.label}</div>
                            <div className="text-[10px] text-stone-500 mt-1">{opt.sub}</div>
                            <div className="text-[10px] text-accent-600 font-medium mt-0.5">{opt.count} 根/瓶</div>
                         </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-500 mb-2 uppercase tracking-wide">装箱规格</label>
                  <select
                    value={boxConfig}
                    onChange={(e) => setBoxConfig(Number(e.target.value))}
                    className="block w-full rounded-xl border-stone-300 bg-stone-50 py-3 px-4 shadow-sm focus:border-accent-500 focus:ring-accent-500 text-brand-900"
                  >
                    {packageType === 'small-small' && bottleRule.smallBottlesSmallBox.map(num => (
                      <option key={num} value={num}>{num} 瓶 / 盒</option>
                    ))}
                    {packageType === 'small-large' && bottleRule.smallBottlesLargeBox.map(num => (
                      <option key={num} value={num}>{num} 瓶 / 盒</option>
                    ))}
                    {packageType === 'medium' && bottleRule.mediumBottlesPerBox.map(num => (
                      <option key={num} value={num}>{num} 瓶 / 盒</option>
                    ))}
                    <option value={1}>散装单瓶</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                   <label className="block text-sm font-medium text-stone-500 mb-2 uppercase tracking-wide">礼盒预览</label>
                   <div className="w-full aspect-[21/9] rounded-xl overflow-hidden bg-stone-100 mb-4 border border-stone-200">
                      <img src={IMAGES.box} alt="礼盒包装" className="w-full h-full object-cover" />
                   </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-500 mb-2 uppercase tracking-wide">每盒克重</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[50, 100].map(w => (
                      <button
                        key={w}
                        onClick={() => {
                          setGramWeight(w);
                          setCustomGram('');
                        }}
                        className={`p-4 border rounded-xl text-center font-bold transition-all ${
                          gramWeight === w && !customGram
                            ? 'border-accent-500 bg-accent-100/10 text-brand-900 ring-1 ring-accent-500' 
                            : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        {w}g
                      </button>
                    ))}
                    <div className="relative">
                      <input 
                        type="number"
                        placeholder="自定义(g)"
                        value={customGram}
                        onChange={(e) => {
                          setCustomGram(e.target.value);
                          setGramWeight(0);
                        }}
                        className={`w-full h-full p-4 border rounded-xl text-center font-bold outline-none transition-all ${
                          customGram 
                            ? 'border-accent-500 bg-accent-100/10 text-brand-900 ring-1 ring-accent-500' 
                            : 'border-stone-200 hover:border-stone-300'
                        }`}
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-brand-50 border border-brand-100 p-5 rounded-xl flex items-center justify-between">
                   <div className="flex flex-col">
                      <span className="text-sm font-medium text-brand-700">预估包含根数</span>
                      <span className="text-[10px] text-stone-400">基于 {rootsPerGramText} 根/克 计算</span>
                   </div>
                   <span className="text-2xl font-bold text-brand-900">
                     ~{Math.round(currentWeight * avgRootsPerGram)} <span className="text-sm font-normal text-stone-500">根</span>
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
      <div className="xl:col-span-1 space-y-6">
        <div className="bg-brand-900 rounded-2xl shadow-xl overflow-hidden border border-brand-800 text-stone-100">
          <div className="px-6 py-5 border-b border-brand-800 flex justify-between items-center bg-black/20">
            <h3 className="text-lg font-bold text-white">费用预估</h3>
            <span className="text-xs font-medium bg-brand-800 text-accent-500 px-2 py-1 rounded border border-brand-700">{spec.name}</span>
          </div>
          
          <div className="p-6 space-y-5">
            <div className="space-y-1">
              <p className="text-sm text-stone-400">总根数</p>
              <p className="text-4xl font-bold text-white tracking-tight">{calculated.totalRoots.toLocaleString()}</p>
            </div>
            
            <div className="pt-5 border-t border-brand-800 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-stone-400 text-xs">那曲发货价 ({spec.nagquPrice})</span>
                <span className="font-medium text-stone-200 text-sm">¥{calculated.totalNagquPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-400 text-xs">藏境发货价 ({spec.channelPrice})</span>
                <span className="font-medium text-stone-200 text-sm">¥{calculated.totalChannelPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-end pt-2">
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

        {/* Packaging Color Recommendation - Only for Bottle Mode */}
        {mode === 'bottle' && (
          <div className={`rounded-2xl shadow-sm border overflow-hidden ${recoColor.bg} ${recoColor.border}`}>
             <div className={`px-6 py-4 border-b flex justify-between items-center ${recoColor.border} bg-white/50`}>
                <h3 className={`text-base font-bold ${recoColor.text}`}>包装辅助标志推荐</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${recoColor.badge}`}>
                   {recoColor.name}
                </span>
             </div>
             <div className="p-4 flex gap-4 items-center">
                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border border-black/5 bg-white">
                   <img src={recoColor.img} alt={recoColor.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 space-y-1">
                   <div className={`font-bold text-sm ${recoColor.text}`}>{recoColor.range}</div>
                   <div className="text-xs text-stone-500">{recoColor.desc}</div>
                   <div className="text-[10px] text-stone-400 mt-1">适用于小瓶包装系列</div>
                </div>
             </div>
          </div>
        )}

        {/* E-commerce Content Generator */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
           <div className="px-6 py-4 border-b border-stone-200 bg-stone-50">
              <h3 className="text-base font-bold text-brand-900">推荐电商内容</h3>
           </div>
           <div className="p-6 space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                   <label className="text-xs font-bold text-stone-500 uppercase">商品标题</label>
                   <button 
                      onClick={() => handleCopy(ecommerceTitle, 'title')}
                      className="text-xs text-accent-600 hover:text-accent-700 font-medium"
                   >
                     {copyFeedback === 'title' ? '已复制!' : '复制'}
                   </button>
                </div>
                <div className="bg-stone-50 p-3 rounded-lg text-sm text-stone-700 break-all leading-relaxed border border-stone-200">
                   {ecommerceTitle}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                   <label className="text-xs font-bold text-stone-500 uppercase">规格名称</label>
                   <button 
                      onClick={() => handleCopy(ecommerceSpec, 'spec')}
                      className="text-xs text-accent-600 hover:text-accent-700 font-medium"
                   >
                     {copyFeedback === 'spec' ? '已复制!' : '复制'}
                   </button>
                </div>
                <div className="bg-stone-50 p-3 rounded-lg text-sm text-stone-700 break-all leading-relaxed border border-stone-200">
                   {ecommerceSpec}
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};