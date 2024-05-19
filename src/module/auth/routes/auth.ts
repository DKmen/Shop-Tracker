import express from 'express'
import { generateMegicLink, verifyMegicLink } from '../controller/auth'

const router = express.Router()

// user authentication
router.post('/email/login', generateMegicLink)
router.post('/token', verifyMegicLink)

export default router
