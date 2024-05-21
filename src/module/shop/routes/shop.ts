import express from 'express'
import createShop from '../controller/createShop'
import updateShop from '../controller/updateShop'
import listShop from '../controller/listShop'
import getShop from '../controller/getShop'

const router = express.Router()

// shop routes
router.post('/create', createShop)
router.patch('/update/:id', updateShop)
router.get('/list', listShop)
router.get('/:id', getShop)

export default router
