import { Router } from 'express';
import { create, findByID, listByUser, remove, update } from '../controllers/RecurringExpense';


const router = Router();

router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);
router.get('/:userID', listByUser);
router.get('/:id', findByID);

export default router;
