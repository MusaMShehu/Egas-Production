import API from '../api/ImageUploadApi';

class ImageUploadService {
    // Upload profile image
    static uploadProfileImage = async (file) => {
        const formData = new FormData();
        formData.append('image', file);
        
        const response = await API.post('/users/upload-profile', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    };

    // Upload product images
    static uploadProductImages = async (files) => {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('images', file);
        });
        
        const response = await API.post('/products/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    };

    // Upload support images
    static uploadSupportImages = async (files) => {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('images', file);
        });
        
        const response = await API.post('/support/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    };

    // Delete product image
    static deleteProductImage = async (productId, publicId) => {
        return await API.delete(`/products/${productId}/image/${publicId}`);
    };
}

export default ImageUploadService;