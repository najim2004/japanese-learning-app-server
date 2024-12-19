const ImageKit = require("imagekit");

class ImageUploader {
  constructor() {
    this.imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    });
  }

  async uploadImage(filePath, folder = "") {
    // Added folder parameter
    try {
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(7)}`;
      const result = await this.imagekit.upload({
        file: filePath,
        fileName,
        folder: folder, // Add folder support
        useUniqueFileName: true, // Ensure unique names
        tags: ["upload"], // Add tags for better organization
      });

      return {
        url: result.url,
        public_id: result.fileId,
        fileName: result.name,
        size: result.size, // Additional metadata
      };
    } catch (error) {
      console.error("Error uploading image:", error.message);
      throw new Error(`Image upload failed: ${error.message}`);
    }
  }

  async deleteImage(fileId) {
    if (!fileId) {
      throw new Error("File ID is required");
    }

    try {
      const result = await this.imagekit.deleteFile(fileId);
      return result;
    } catch (error) {
      console.error("Error deleting image:", error.message);
      throw new Error(`Image deletion failed: ${error.message}`);
    }
  }

  async updateImage(fileId, filePath) {
    if (!fileId || !filePath) {
      throw new Error("Both fileId and filePath are required");
    }

    try {
      const newImage = await this.uploadImage(filePath);
      await this.deleteImage(fileId);
      return newImage;
    } catch (error) {
      console.error("Error updating image:", error.message);
      throw new Error(`Image update failed: ${error.message}`);
    }
  }

  // Add utility methods if needed
  async getImageInfo(fileId) {
    try {
      return await this.imagekit.getFileDetails(fileId);
    } catch (error) {
      throw new Error(`Failed to get image info: ${error.message}`);
    }
  }
}

module.exports = ImageUploader;
