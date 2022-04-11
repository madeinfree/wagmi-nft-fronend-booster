import { useContractRead, useContractWrite } from 'wagmi'

export function readContract({ method, abi, provider, args }) {
  return useContractRead(
    {
      addressOrName: window.ENV.CONTRACT_ADDRESS,
      contractInterface: abi,
      signerOrProvider: provider,
    },
    method,
    {
      args,
    }
  )
}

export function writeContract({ method, abi, provider, args }) {
  return useContractWrite(
    {
      addressOrName: window.ENV.CONTRACT_ADDRESS,
      contractInterface: abi,
      signerOrProvider: provider,
    },
    method,
    {
      args,
    }
  )
}
