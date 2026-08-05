const express=require('express');

const router=express.Router();

const {protect}
=require('../middleware/authMiddleware');

const {
    addRepository,
    getRepositories
} = require('../controllers/repositoryController');
router.post(
    '/',
    protect,
    addRepository
);
router.get('/', protect, getRepositories);

module.exports=router;