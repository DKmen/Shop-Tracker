import express from 'express'

import createProduct from '../controller/createProduct'
import getProduct from '../controller/getProduct'
import updateProduct from '../controller/updateProduct'
import listProduct from '../controller/listProduct'

const router = express.Router()

// product routes
router.post('/create', createProduct)
router.get('/:id', getProduct)
router.patch('/:id', updateProduct)
router.get('/', listProduct)


export default router
