import User from "./src/models/user"


declare module 'express-serve-static-core' {
  interface Request extends Express.Request {
    context?: {
      user: User
    }
  }
}
