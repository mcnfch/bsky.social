import Head from 'next/head'
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { BskyAgent } from '@atproto/api'

export default function Login() {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [service, setService] = useState(
    process.env.NEXT_PUBLIC_ATP_PDS || 'https://bsky.social',
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const client = new BskyAgent({ service })
      const res = await client.login({ identifier, password })
      if (res && res.data?.did) {
        // naive persistence for demo
        sessionStorage.setItem('atp.did', res.data.did)
        sessionStorage.setItem('atp.handle', res.data.handle)
        sessionStorage.setItem('atp.accessJwt', res.data.accessJwt)
        sessionStorage.setItem('atp.refreshJwt', res.data.refreshJwt)
        const pds = (client.pdsUrl || new URL(service)).toString()
        sessionStorage.setItem('atp.pds', pds)
        // Keep the original public PDS service used at login for browser CORS
        sessionStorage.setItem('atp.loginService', service)
        sessionStorage.setItem(
          'atp.appview',
          process.env.NEXT_PUBLIC_ATP_APPVIEW || 'https://api.bsky.app',
        )
        router.push('/timeline')
      } else {
        setError('Login failed: no DID returned')
      }
    } catch (err: any) {
      const msg = err?.message || 'Login failed'
      if (/XRPCNotSupported/i.test(msg) || /not supported/i.test(msg)) {
        setError(
          'Login endpoint not supported on this service. Use your PDS, e.g. https://bsky.social',
        )
      } else {
        setError(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Login — ATProto Demo</title>
      </Head>
      <main style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
        <h1>Login (App Password)</h1>
        <form onSubmit={onSubmit} style={{ maxWidth: 480, display: 'grid', gap: 12 }}>
          <label>
            Service
            <input
              value={service}
              onChange={(e) => setService(e.target.value)}
              placeholder="https://bsky.social"
              style={{ width: '100%' }}
            />
          </label>
          <label>
            Handle or DID
            <input
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="your.handle.bsky.social"
              style={{ width: '100%' }}
            />
          </label>
          <label>
            App Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="xxxx-xxxx-xxxx-xxxx"
              style={{ width: '100%' }}
            />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
          {error && <p style={{ color: 'crimson' }}>{error}</p>}
        </form>
      </main>
    </>
  )
}
