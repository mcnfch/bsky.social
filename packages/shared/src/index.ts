import { BskyAgent, type AppBskyFeedPost } from '@atproto/api'

export class AtpClient {
  agent: BskyAgent

  constructor(service: string) {
    this.agent = new BskyAgent({ service })
  }

  async loginWithAppPassword(identifier: string, password: string) {
    return this.agent.login({ identifier, password })
  }

  async logout() {
    try {
      await this.agent.com.atproto.server.logout()
    } catch {}
  }

  async getProfile(didOrHandle: string) {
    return this.agent.getProfile({ actor: didOrHandle })
  }

  async getTimeline(limit = 25, cursor?: string) {
    return this.agent.getTimeline({ limit, cursor })
  }

  async createPost(text: string, facets?: AppBskyFeedPost.Record['facets']) {
    const record: Partial<AppBskyFeedPost.Record> & Omit<AppBskyFeedPost.Record, 'createdAt'> = {
      text,
      facets,
    }
    return this.agent.post(record as any)
  }
}
