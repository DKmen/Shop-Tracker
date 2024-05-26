import express from 'express'

import createProduct from '../controller/createProduct'
import getProduct from '../controller/getProduct'
import updateProduct from '../controller/updateProduct'
import listProduct from '../controller/listProduct'
import uploadCSVProduct from '../controller/uploadCSV'

const router = express.Router()

// product routes
router.post('/create', createProduct)
router.get('/generate-csv', uploadCSVProduct)
router.get('/:id', getProduct)
router.patch('/:id', updateProduct)
router.get('/', listProduct)

export default router
