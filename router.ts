import express from 'express'

import auth from './src/module/auth/routes'
import shop from './src/module/shop/routes'
import category from './src/module/category/routes'
import product from './src/module/product/routes'
import invoice from './src/module/invoice/routes'

const router = express.Router()

router.use(auth)
router.use(shop)
router.use(category)
router.use(product)
router.use(invoice)

export default router
