const ImageService = require('../../services/image');

class ImageController {
    static async postImage (req, res, next) {
        try {
            const { name } = req.params;
            const { picUrl, type, planName, versions } = req.body;
            const { image } = await ImageService.postImage({ name, picUrl, type, planName, versions });

            res.status(201).json({ image });
        } catch (error) { next(error) };
    };

    static async getImages (req, res, next) {
        try {
            const { images } = await ImageService.getImages();

            res.status(200).json({ images });
        } catch (error) { next(error) };
    };

    static async getImage (req, res, next) {
        try {
            const { id } = req.params;
            const { image } = await ImageService.getImage(id);
            
            res.status(200).json({ image });
        } catch (error) { next(error) };
    };

    static async patchImage (req, res, next) {
        try {
            const { id } = req.params;
            const { name, picUrl, type, planName, versions } = req.body;
            const { image } = await ImageService.patchImage({
                id, name, picUrl, type, planName, versions
            });

            res.status(200).json({ image });
        } catch (error) { next(error) };
    };

    static async deleteImage (req, res, next) {
        try {
            const { id } = req.params;
            const { image } = await ImageService.deleteImage(id);
            
            res.status(200).json({ image });
        } catch (error) { next(error) };
    };
};

module.exports = ImageController;