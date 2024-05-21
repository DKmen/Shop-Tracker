import express from 'express'

import auth from './src/module/auth/routes'
import shop from './src/module/shop/routes'

const router = express.Router()

router.use(auth)
router.use(shop)

export default router
