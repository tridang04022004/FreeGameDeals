export interface Deal {
  dealID: string;
  gameID: string;
  storeID: string;
  title: string;
  salePrice: string;
  normalPrice: string;
  isOnSale: string;
  savings: string;
  dealRating: string;
  metacriticScore: string;
  steamRatingText: string;
  steamRatingPercent: string;
  steamRatingCount: string;
  steamAppID: string | null;
  thumb: string;
  releaseDate: number;
  lastChange: number;
  internalName: string;
}

export interface Store {
  storeID: string;
  storeName: string;
  isActive: number; // CheapShark returns 0 or 1 as a number
  images: {
    banner: string;
    logo: string;
    icon: string;
  };
}

export type SortOption = 'dealRating' | 'releaseDate' | 'title';

export interface DealsApiResponse {
  deals: Deal[];
  hasMore: boolean;
  fetchedAt: number;
}

export interface StoresApiResponse {
  stores: Store[];
  fetchedAt: number;
}

export interface StoreLink {
  url: string;
  label: string;
  type: 'direct' | 'search' | 'cheapshark';
}
