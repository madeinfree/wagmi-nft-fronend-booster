import { RemixBrowser } from '@remix-run/react'
import { hydrate } from 'react-dom'
import { providers } from 'ethers'
import { Provider } from 'wagmi'

const provider = () => {
  return new providers.InfuraProvider(
    process.env.NODE_ENV === 'development' ? 4 : 1,
    window.ENV.INFURA_ID
  )
}

hydrate(
  <Provider provider={provider}>
    <RemixBrowser />
  </Provider>,
  document
)
