import express from 'express'

import report from './report'
import { authAccessToken } from '../../auth/middleware/authAccessToken'

const router = express.Router()

router.use('/:version/report', authAccessToken, report)

export default router
