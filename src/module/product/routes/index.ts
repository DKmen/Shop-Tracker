import express from 'express'

import product from './product'
import { authAccessToken } from '../../auth/middleware/authAccessToken'

const router = express.Router()

router.use('/:version/product', authAccessToken, product)

export default router
