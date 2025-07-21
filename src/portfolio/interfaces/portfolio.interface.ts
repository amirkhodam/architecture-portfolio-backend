import { Media } from 'generated/prisma';
import { ITranslatedString, ITranslatedStrings } from 'src/app.interface';

export interface AddMediaDto {
  name: string;
  path: string;
  type: string;
}

export interface IPorfolioCreate {
  title: ITranslatedString;
  texts: ITranslatedStrings;
}

export type PortfolioBaseDto = IPorfolioCreate & {
  media: Media[];
};
export type Portfolio = PortfolioBaseDto & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};

export interface PortfolioListResponse {
  portfolios: Portfolio[];
}
