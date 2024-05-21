import express from 'express'

import shop from './shop'
import { auth } from '../../auth/middleware/auth'

const router = express.Router()

router.use('/:version/shop', auth, shop)
export default router
