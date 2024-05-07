import { useState } from "react";
import { Address } from "~/types/address";
const estadosBrasileiros = {
  AC: "Acre",
  AL: "Alagoas",
  AP: "Amapá",
  AM: "Amazonas",
  BA: "Bahia",
  CE: "Ceará",
  DF: "Distrito Federal",
  ES: "Espírito Santo",
  GO: "Goiás",
  MA: "Maranhão",
  MT: "Mato Grosso",
  MS: "Mato Grosso do Sul",
  MG: "Minas Gerais",
  PA: "Pará",
  PB: "Paraíba",
  PR: "Paraná",
  PE: "Pernambuco",
  PI: "Piauí",
  RJ: "Rio de Janeiro",
  RN: "Rio Grande do Norte",
  RS: "Rio Grande do Sul",
  RO: "Rondônia",
  RR: "Roraima",
  SC: "Santa Catarina",
  SP: "São Paulo",
  SE: "Sergipe",
  TO: "Tocantins"
};
export type CepResponse = {
  logradouro?: string;
  complemento?: string;
  bairro: string;
  localidade: string;
  uf: keyof typeof estadosBrasileiros;
}
export const useCep = () => {
  const [isLoading, setIsLoading] = useState(false);
  const getCepData = async (cep: string) => {
    setIsLoading(true)
    const url = `https://viacep.com.br/ws/${cep}/json/`;
    const res = await fetch(url);
    if (res.status === 200) {
      const cepResponse = await res.json() as CepResponse;
      setIsLoading(false);
      return {
        country: 'Brasil',
        state: estadosBrasileiros[cepResponse.uf],
        city: cepResponse.localidade,
        district: cepResponse.bairro,
        street: cepResponse.logradouro,
      } as Omit<Address, 'zipCode' | 'complement' | 'number'>;
    }
    setIsLoading(false);
    return undefined;
  }
  return { getCepData, isLoading };
}