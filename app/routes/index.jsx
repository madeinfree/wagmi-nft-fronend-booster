import { useProvider, useConnect, useAccount } from 'wagmi'
import AppBar from '../components/AppBar'
import MintBlock from '../components/MintBlock'

export default function Index() {
  /**
   * @dev workaround for avoid server side render.
   */
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div>
      <AppBar />
      <MintBlock />
    </div>
  )
}
