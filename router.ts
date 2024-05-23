import express from 'express'

import auth from './src/module/auth/routes'
import shop from './src/module/shop/routes'
import category from './src/module/category/routes'

const router = express.Router()

router.use(auth)
router.use(shop)
router.use(category)

export default router
