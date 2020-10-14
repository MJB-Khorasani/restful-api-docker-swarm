const ImageModel = require('../models/image');

class ImageService {
    static async postImage ({ name, picUrl, type, planName, versions }) {
        try {
            const image = await ImageModel.create({ name, picUrl, type, planName, versions });

            return { image };
        } catch (error) { throw error };
    };

    static async getImages () {
        try {
            const images = await ImageModel.findAll();
            
            return { images };
        } catch (error) { throw error };
    };

    static async getImage (id) {
        try {
            const image = await ImageModel.findByPk(id);
            
            return { image };
        } catch (error) { throw error };
    };

    static async patchImage ({ id, name, picUrl, type, planName, versions }) {
        try {
            const image = await ImageModel.findByPk(id);

            await image.update({ name, picUrl, type, planName, versions });

            return { image };
        } catch (error) { throw error };
    };

    static async deleteImage (id) {
        try {
            const image = await ImageModel.findByPk(id);

            await image.destroy();
    
            return { image };
        } catch (error) { throw error };
    };
};

module.exports = ImageService;