export interface Portfolio {
  id: string;
  title: string;
  videos: string[];
  images: string[];
  texts: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePortfolioDto {
  title: string;
  videos: string[];
  images: string[];
  texts: string[];
}

export interface UploadPortfolioDto {
  title: string;
  texts: string[];
}

export interface PortfolioResponse {
  id: string;
  title: string;
  videos: string[];
  images: string[];
  texts: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PortfolioListResponse {
  portfolios: PortfolioResponse[];
} 