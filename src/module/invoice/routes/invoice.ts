import express from 'express'
import createInvoice from '../controller/createInvoice'
import getInvoice from '../controller/getInvoice'
import listInvoice from '../controller/listInvoice'
import createCustomer from '../controller/createCustomer'
import getCustomer from '../controller/getCustomer'
import listCustomer from '../controller/listCustomer'


const invoiceRouter = express.Router()
const customerRouter = express.Router()

// invoice routes
invoiceRouter.post('/create', createInvoice)
invoiceRouter.get('/:id', getInvoice)
invoiceRouter.get('/', listInvoice)

// customer routes
customerRouter.post('/create', createCustomer)
customerRouter.get('/:id', getCustomer)
customerRouter.get('/', listCustomer)


export { invoiceRouter, customerRouter }
