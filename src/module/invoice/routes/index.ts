import express from 'express'

import { authAccessToken } from '../../auth/middleware/authAccessToken'
import { customerRouter, invoiceRouter } from './invoice'

const router = express.Router()

router.use('/:version/invoice', authAccessToken, invoiceRouter)
router.use('/:version/customer', authAccessToken, customerRouter)

export default router
