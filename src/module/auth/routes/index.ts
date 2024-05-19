// impliment router varification and export the router for the auth module
import express from 'express'

import auth from './auth'
const router = express.Router()

router.use('/:version/auth', auth)
export default router
