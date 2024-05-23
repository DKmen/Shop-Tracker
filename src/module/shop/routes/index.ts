import express from 'express'

import shop from './shop'

const router = express.Router()

router.use('/:version/shop', shop)
export default router
