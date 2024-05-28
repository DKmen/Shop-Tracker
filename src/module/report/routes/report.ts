import express from 'express'
import createReport from '../controller/createReport'
import listReport from '../controller/listReport'

const router = express.Router()

// report routes
router.post('/create', createReport)
router.get('/list', listReport)

export default router
