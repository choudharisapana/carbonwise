const express =
require('express');

const router =
express.Router();

const {
    protect
} =
require(
'../middleware/authMiddleware'
);

const {

    exportPDF,

    exportCSV

} =
require(
'../controllers/exportController'
);

router.get(
    '/pdf/:id',
    protect,
    exportPDF
);

router.get(
    '/csv/:id',
    protect,
    exportCSV
);

module.exports =
router;