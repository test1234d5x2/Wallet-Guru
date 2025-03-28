import { Router } from 'express'
import { create, findByID, listByUser, remove, update } from '../controllers/RecurringIncome'

const router = Router()

router.post('/', create)
router.put('/:id', update)
router.delete('/:id', remove)
router.get('/', listByUser)
router.get('/:id', findByID)

export default router