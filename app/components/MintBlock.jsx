import { useMemo, useState } from 'react'
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useProvider,
  useWaitForTransaction,
} from 'wagmi'
import { utils } from 'ethers'
import MoarABI from '../abi/moar'
import { mintErrorFormat } from '../utils/errorFormat'

import ConnectorButton from '../components/ConnectorButton'

export default function MintBlock() {
  const provider = useProvider()
  const [isMintSuccess, setIsMintSuccess] = useState(false)
  const [isMintFailed, setIsMintFailed] = useState(false)
  const [{ data: accountData }] = useAccount()
  const [{ data: contractReadData }, read] = useContractRead(
    {
      addressOrName: window.ENV.CONTRACT_ADDRESS,
      contractInterface: MoarABI,
      signerOrProvider: provider,
    },
    'balanceOf',
    {
      args: accountData?.address,
    }
  )

  const [{ data: transactionResponse, error, loading }, write] =
    useContractWrite(
      {
        addressOrName: window.ENV.CONTRACT_ADDRESS,
        contractInterface: MoarABI,
        signerOrProvider: provider,
      },
      'privateMint',
      {
        args: [[accountData?.address]],
      }
    )

  const [{ data: transactionData, loading: transactionLoading }] =
    useWaitForTransaction({
      hash: transactionResponse?.hash,
    })

  useMemo(() => {
    if (transactionLoading) return
    read()
  }, [accountData?.address, transactionLoading])

  useMemo(() => {
    switch (transactionData?.status) {
      case 0:
        return setIsMintFailed(true)
      case 1:
        return setIsMintSuccess(true)
    }
  }, [transactionData])

  return (
    <div
      style={{
        backgroundColor: '#ccf',
        padding: 14,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          border: '1px solid #000',
          borderRadius: 4,
          padding: 24,
        }}
      >
        {accountData ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div>
              已擁有：
              {contractReadData
                ? utils.formatUnits(contractReadData, 0)
                : '讀取中'}
            </div>
            <div style={{ marginTop: 20 }}>
              {loading || transactionLoading ? (
                '鑄造中...'
              ) : (
                <button onClick={() => write()}>進行鑄造</button>
              )}
            </div>
            {isMintFailed ? (
              <div style={{ marginTop: 20, color: 'green' }}>鑄造失敗!</div>
            ) : null}
            {isMintSuccess ? (
              <div style={{ marginTop: 20, color: 'green' }}>鑄造成功!</div>
            ) : null}
            {error ? (
              <div style={{ marginTop: 20, color: 'red' }}>
                {error ? mintErrorFormat(error) : null}
              </div>
            ) : null}
          </div>
        ) : (
          <div>
            <ConnectorButton customText="請先連接錢包" />
          </div>
        )}
      </div>
    </div>
  )
}
