import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { BskyAgent } from '@atproto/api'

export default function Profile() {
  const [service, setService] = useState<string>('')
  const [client, setClient] = useState<BskyAgent | null>(null)
  const [actor, setActor] = useState('')
  const [profile, setProfile] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const app = sessionStorage.getItem('atp.appview') ||
      process.env.NEXT_PUBLIC_ATP_APPVIEW || 'https://api.bsky.app'
    setService(app)
    setClient(new BskyAgent({ service: app }))
  }, [])

  const onLoad = async () => {
    if (!client || !actor) return
    setError(null)
    try {
      const res = await client.getProfile({ actor })
      setProfile(res.data)
    } catch (err: any) {
      setError(err?.message || 'Failed to load profile')
    }
  }

  return (
    <>
      <Head>
        <title>Profile — ATProto Demo</title>
      </Head>
      <main style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
        <h1>Profile</h1>
        <p>Service: {service}</p>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <input
            value={actor}
            onChange={(e) => setActor(e.target.value)}
            placeholder="handle or did:..."
            style={{ flex: 1 }}
          />
          <button onClick={onLoad}>Load</button>
        </div>
        {error && <p style={{ color: 'crimson' }}>{error}</p>}
        {profile && (
          <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 18 }}>
              {profile.displayName || profile.handle}
            </div>
            <div style={{ color: '#666' }}>@{profile.handle}</div>
            {profile.description && <p>{profile.description}</p>}
            <div style={{ color: '#666', fontSize: 12 }}>DID: {profile.did}</div>
          </div>
        )}
      </main>
    </>
  )
}
