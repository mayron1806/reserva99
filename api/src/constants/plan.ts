export type Plan = {
  id: number;
  name: string;
  price: number; // centavos
  limits: {
    user: number;
    wordsGenerated: number;
    topwordsSource: number;
    topwordCount: number;
    calculators: boolean;
  }
}

const starter: Plan = {
  id: 1,
  name: 'Starter',
  price: 5000, 
  limits: {
    user: 1,
    calculators: true,
    topwordCount: 10,
    topwordsSource: 1,
    wordsGenerated: 10000,
  },
}
const pro: Plan = {
  id: 2,
  name: 'Pro',
  price: 6000, 
  limits: {
    user: 5,
    calculators: true,
    topwordCount: 100,
    topwordsSource: 2,
    wordsGenerated: 50000,
  },
}
const proMax: Plan = {
  id: 2,
  name: 'Pro Max',
  price: 10000, 
  limits: {
    user: 20,
    calculators: true,
    topwordCount: 500,
    topwordsSource: 5,
    wordsGenerated: 100000,
  },
}
const enterprise: Plan = {
  id: 3,
  name: 'Enterprise',
  price: 20000, 
  limits: {
    user: null,
    calculators: true,
    topwordCount: null,
    topwordsSource: 10,
    wordsGenerated: 500000,
  },
}
export const plans = [enterprise, pro, proMax, starter];