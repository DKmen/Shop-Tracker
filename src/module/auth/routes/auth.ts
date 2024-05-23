import express from 'express'
import { generateAccessToken, generateMegicLink, verifyMegicLink } from '../controller/auth'

const router = express.Router()

// user authentication
router.post('/email/login', generateMegicLink)
router.post('/token', verifyMegicLink)
router.post('/access-token', generateAccessToken)

export default router
