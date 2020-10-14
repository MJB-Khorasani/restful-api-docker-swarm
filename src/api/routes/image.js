const express = require('express');

const ImageController = require('../middlewares/image');
const ImageValidator = require('../validators/image');
const Auth = require('../middlewares/auth');

const router = express.Router();

router.route('/all')
    .get(ImageController.getImages);

router.route('/:name')
    .all(Auth.adminIsLoggedIn)
    .post(ImageValidator.postImage, ImageController.postImage)

router.route('/:id')
    .all(Auth.adminIsLoggedIn)
    .get(ImageValidator.getImage, ImageController.getImage)
    .patch(ImageValidator.patchImage, ImageController.patchImage)
    .delete(ImageValidator.deleteImage, ImageController.deleteImage);
    
module.exports = router;