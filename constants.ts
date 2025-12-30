import { AppData } from './types';

export const INITIAL_DATA: AppData = {
  specs: [
    { id: '900', name: '900', rootsPerJin: 900, rootsPerGram: 1.8, costPrice: 174, channelPrice: 247, minSalesPrice: 304, retailPrice: 380 },
    { id: '1000', name: '1000', rootsPerJin: 1000, rootsPerGram: 2.0, costPrice: 137, channelPrice: 195, minSalesPrice: 240, retailPrice: 300 },
    { id: '1200', name: '1200', rootsPerJin: 1200, rootsPerGram: 2.4, costPrice: 102, channelPrice: 146, minSalesPrice: 180, retailPrice: 225 },
    { id: '1400', name: '1400', rootsPerJin: 1400, rootsPerGram: 2.8, costPrice: 77, channelPrice: 108, minSalesPrice: 132, retailPrice: 165 },
    { id: '1500', name: '1500', rootsPerJin: 1500, rootsPerGram: 3.0, costPrice: 62, channelPrice: 91, minSalesPrice: 112, retailPrice: 140 },
    { id: '1600-1800', name: '1600-1800', rootsPerJin: 1700, rootsPerGram: 3.6, costPrice: 47, channelPrice: 65, minSalesPrice: 80, retailPrice: 100 },
    { id: '2000-2200', name: '2000-2200', rootsPerJin: 2100, rootsPerGram: 4.0, costPrice: 41, channelPrice: 52, minSalesPrice: 64, retailPrice: 80 },
    { id: '2200-2500', name: '2200-2500', rootsPerJin: 2350, rootsPerGram: 4.7, costPrice: 32, channelPrice: 45.5, minSalesPrice: 56, retailPrice: 70 },
    { id: '2500-3000', name: '2500-3000', rootsPerJin: 2750, rootsPerGram: 5.5, costPrice: 26, channelPrice: 39, minSalesPrice: 48, retailPrice: 60 },
  ],
  bottleRules: [
    { specId: '900', smallBottleCount: 5, mediumBottleCount: 12, smallBottlesPerBox: [8, 10], mediumBottlesPerBox: [5] },
    { specId: '1000', smallBottleCount: 5, mediumBottleCount: 12, smallBottlesPerBox: [8, 10], mediumBottlesPerBox: [5] }, 
    { specId: '1200', smallBottleCount: 5, mediumBottleCount: 15, smallBottlesPerBox: [8, 10], mediumBottlesPerBox: [5] },
    { specId: '1400', smallBottleCount: 5, mediumBottleCount: 15, smallBottlesPerBox: [8, 10], mediumBottlesPerBox: [5] },
    { specId: '1500', smallBottleCount: 5, mediumBottleCount: 15, smallBottlesPerBox: [8, 10], mediumBottlesPerBox: [5] },
    { specId: '1600-1800', smallBottleCount: 6, mediumBottleCount: 15, smallBottlesPerBox: [8, 10], mediumBottlesPerBox: [5] },
    { specId: '2000-2200', smallBottleCount: 8, mediumBottleCount: 20, smallBottlesPerBox: [8, 10], mediumBottlesPerBox: [5] },
    { specId: '2200-2500', smallBottleCount: 8, mediumBottleCount: 20, smallBottlesPerBox: [8, 10], mediumBottlesPerBox: [5] },
    { specId: '2500-3000', smallBottleCount: 8, mediumBottleCount: 20, smallBottlesPerBox: [8, 10], mediumBottlesPerBox: [5] },
  ]
};