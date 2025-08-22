import React, { createContext, useContext, useMemo, useState } from 'react'
import { BskyAgent } from '@atproto/api'

type Session = {
  client: BskyAgent
  did?: string
}

const SessionContext = createContext<Session | null>(null)

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [did, setDid] = useState<string | undefined>(undefined)
  const client = useMemo(() => {
    const service =
      process.env.NEXT_PUBLIC_ATP_SERVICE || 'https://api.bsky.app'
    return new BskyAgent({ service })
  }, [])

  // A very simple in-memory session; for demo only.
  const value = useMemo(() => ({ client, did }), [client, did])
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  )
}

export function useSession() {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('Missing SessionProvider')
  return ctx
}
