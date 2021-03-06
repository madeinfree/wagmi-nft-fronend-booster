import { useMemo, useState, useEffect } from 'react'
import { useAccount, useProvider, useWaitForTransaction } from 'wagmi'
import { utils } from 'ethers'

import WAGMINFB from '../abi/wagmi-nfb'
import { mintErrorFormat } from '../utils/errorFormat'
import { readContract, writeContract } from '../utils/contract/helper'

import ConnectorButton from '../components/ConnectorButton'

export default function MintBlock() {
  const provider = useProvider()
  const [isMintSuccess, setIsMintSuccess] = useState(false)
  const [isMintFailed, setIsMintFailed] = useState(false)
  const [{ data: accountData }] = useAccount()

  const [{ data: contractReadData }, read] = readContract({
    method: 'balanceOf',
    provider,
    abi: WAGMINFB,
    args: accountData?.address,
  })

  const [{ data: totalSupply }, readTotalSupply] = readContract({
    method: 'totalSupply',
    provider,
    abi: WAGMINFB,
  })

  const [{ data: transactionResponse, error, loading }, write] = writeContract({
    method: 'mint',
    provider,
    abi: WAGMINFB,
  })

  const [{ data: transactionData, loading: transactionLoading }] =
    useWaitForTransaction({
      hash: transactionResponse?.hash,
    })

  useEffect(() => {
    if (transactionLoading) return
    read()
    readTotalSupply()
  }, [accountData?.address, transactionLoading])

  useMemo(() => {
    switch (transactionData?.status) {
      case 0:
        return setIsMintFailed(true)
      case 1:
        return setIsMintSuccess(true)
    }
  }, [transactionData])

  const handleMintNFT = () => {
    setIsMintSuccess(false)
    setIsMintFailed(false)
    if (transactionLoading) return
    write({
      overrides: {
        value: utils.parseEther('0.03'),
      },
    })
  }

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
              ????????????
              {contractReadData
                ? utils.formatUnits(contractReadData, 0)
                : '?????????'}
            </div>
            <div style={{ marginTop: 20 }}>
              {loading || transactionLoading ? (
                '?????????...'
              ) : (
                <button onClick={handleMintNFT}>????????????</button>
              )}
            </div>
            {isMintFailed ? (
              <div style={{ marginTop: 20, color: 'green' }}>????????????!</div>
            ) : null}
            {isMintSuccess ? (
              <div style={{ marginTop: 20, color: 'green' }}>????????????!</div>
            ) : null}
            {error ? (
              <div style={{ marginTop: 20, color: 'red' }}>
                {error ? mintErrorFormat(error) : null}
              </div>
            ) : null}
            <div style={{ marginTop: 20 }}>
              ?????????????????????
              {totalSupply ? utils.formatUnits(totalSupply, 0) : '?????????...'}
            </div>
          </div>
        ) : (
          <div>
            <ConnectorButton customText="??????????????????" />
          </div>
        )}
      </div>
    </div>
  )
}
