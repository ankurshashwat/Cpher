import React, { createContext, useContext, useEffect, useState } from "react";
import Web3 from "web3";
import { contractAddress, contractABI } from "@/utils/constants";

interface CpherContextType {
  contract: any;
  account: string | null;
  reg: (data: FIR) => Promise<void>;
  ret: (uniqueId: string) => Promise<FIR>;
}

interface FIR {
  name: string;
  houseAddress: string;
  phoneNumber: string;
  natureOfOffense: string;
  dateAndTime: number;
  locationOfIncident: string;
  descriptionOfIncident: string;
  detailsOfAccused: string;
  evidence: string;
}

interface WindowWithEthereum extends Window {
  ethereum?: any;
}

const CpherContext = createContext<CpherContextType | undefined>(undefined);

export const useCpher = () => {
  const context = useContext(CpherContext);
  if (!context) {
    throw new Error("useCpher must be used within CpherProvider");
  }
  return context;
};

interface CpherProviderProps {
  children: React.ReactNode;
}

export const CpherProvider: React.FC<CpherProviderProps> = ({ children }) => {
  const [contract, setContract] = useState<any>(null);
  const [account, setAccount] = useState<string | null>(null);

  useEffect(() => {
    const initWeb3 = async () => {
      try {
        if ((window as WindowWithEthereum).ethereum) {
          await (window as WindowWithEthereum).ethereum.request({
            method: "eth_requestAccounts",
          });
          const web3 = new Web3((window as WindowWithEthereum).ethereum);
          const contract = new web3.eth.Contract(contractABI, contractAddress);
          setContract(contract);
          const accounts = await web3.eth.getAccounts();
          setAccount(accounts[0]);
        } else {
          throw new Error("no ethereum object found.");
        }
      } catch (err) {
        console.error("error init web3:", err);
      }
    };
    initWeb3();
  }, []);

  const reg = async (data: FIR) => {
    try {
      if (contract) {
        await contract.methods
          .register(
            data.name,
            data.houseAddress,
            data.phoneNumber,
            data.natureOfOffense,
            data.dateAndTime,
            data.locationOfIncident,
            data.descriptionOfIncident,
            data.detailsOfAccused,
            data.evidence
          )
          .send({ from: account });
      }
    } catch (error) {
      console.error("reg", error);
    }
  };

  const ret = async (uniqueId: string) => {
    try {
      if (contract) {
        const result = await contract.methods.retrieve(uniqueId).call();
        return result;
      }
    } catch (error) {
      console.error("ret", error);
    }
    return {} as FIR;
  };

  const contextValue: CpherContextType = {
    contract,
    account,
    reg,
    ret,
  };

  return (
    <CpherContext.Provider value={contextValue}>
      {children}
    </CpherContext.Provider>
  );
};
