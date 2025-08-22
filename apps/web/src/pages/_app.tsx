import type { AppProps } from 'next/app'
import { SessionProvider } from '../lib/session'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <Component {...pageProps} />
    </SessionProvider>
  )
}

