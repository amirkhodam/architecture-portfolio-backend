import { ELanguages } from 'generated/prisma';

export type ITranslatedString = {
  [key in ELanguages]: string;
};

export type ITranslatedStrings = {
  [key in ELanguages]: Array<string>;
};
