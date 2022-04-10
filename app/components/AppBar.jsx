import { useAccount } from 'wagmi'
import ConnectorButton from '../components/ConnectorButton.jsx'

export default function AppBar() {
  const [{ data: accountData }, disconnect] = useAccount()
  return (
    <div
      style={{
        backgroundColor: '#ccc',
        padding: 14,
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ cursor: 'pointer' }}>LOGO</div>
      <div>
        {accountData?.address ? (
          <div
            style={{ cursor: 'pointer' }}
            key={accountData.address}
            onClick={disconnect}
          >
            {accountData.ens ? accountData.ens.name : accountData.address}
          </div>
        ) : (
          <ConnectorButton />
        )}
      </div>
    </div>
  )
}
