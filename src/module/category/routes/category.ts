import express from 'express'

import createCategory from '../controller/addCategory'
import updateCategory from '../controller/updateCategory'

const router = express.Router()

// category routes
router.post('/create', createCategory)
router.patch('/update/:id', updateCategory)

export default router
