export interface UserContext {
  userId: string
  firstName: string | null
  lastName: string | null
  source: 'email' | 'google'
  type: 'admin' | 'agency'
  email: string
}

declare module 'express-serve-static-core' {
  interface Request extends Express.Request {
    context?: {
      user: UserContext
    }
  }
}
