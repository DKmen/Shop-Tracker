import express from 'express'
import createShop from '../controller/createShop'
import updateShop from '../controller/updateShop'
import { auth } from '../../auth/middleware/auth'
import { authAccessToken } from '../../auth/middleware/authAccessToken'

const router = express.Router()

// shop routes
router.post('/create', auth, createShop)
router.patch('/update', authAccessToken, updateShop)

export default router
