import express from 'express';
import * as roomController from '../controllers/room.controller';
import { protect } from '../middlewares/auth.middleware';
// import { authorizeAdmin } from '../middlewares/authorize.middleware';

const router = express.Router();

// router.get('/', roomController.getAll);
router.get('/', (req, res) => {
    console.log("Fetching all rooms");
    roomController.getAll(req, res);
});

router.get('/search', (req, res) => { 
    roomController.search(req, res);
});

// router.get('/filter', (req, res) => {
//     roomController.filter(req, res);
// });

router.get('/:id', roomController.getById);

// router.get('/:id/availability', roomController.getAvailable);

// // Protected admin routes
router.post('/create', (req, res) => {
    roomController.create(req, res);
});

router.put('/update/:id', (req, res) => { 
    roomController.update(req, res);
});

router.delete('/delete/:id', (req, res) => {
     roomController.remove(req, res);
});

export default router;