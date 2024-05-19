import express from 'express'

import auth from './src/module/auth/routes'
const router = express.Router()

router.use(auth)
export default router
