const supertest = require('supertest');
const app = require('../src/index');
const photosModel = require('../src/models/photos.model');

// Mock data
const mockPhotos = [
    {
        id: "1",
        title: "Dewdrops on Spiderweb",
        photographer: "Jane Doe",
        camera_model: "Canon EOS 5D Mark IV",
        lens_model: "Canon MP-E 65mm f/2.8 1-5x Macro",
        aperture: "f/8",
        shutter_speed: "1/200",
        iso: 200,
        focal_length: "65mm",
        magnification: "2x",
        subject: "Spiderweb",
        location: "Backyard",
        date_taken: "2023-05-15",
        description: "Morning dew on a spiderweb",
        tags: ["nature", "macro", "spider"]
    }
];

// Mock implementation
jest.mock('../src/models/photos.model', () => ({
    getAllPhotos: jest.fn(() => Promise.resolve(mockPhotos)),
    getPhoto: jest.fn((id) => Promise.resolve(mockPhotos.find(p => p.id === id))),
    addPhoto: jest.fn((photoData) => {
        const newPhoto = { id: "2", ...photoData };
        mockPhotos.push(newPhoto);
        return Promise.resolve(newPhoto);
    }),
    updatePhoto: jest.fn((id, updateData) => {
        const photo = mockPhotos.find(p => p.id === id);
        if (photo) {
            Object.assign(photo, updateData);
            return Promise.resolve(photo);
        }
        return Promise.resolve(null);
    }),
    deletePhoto: jest.fn((id) => {
        const index = mockPhotos.findIndex(p => p.id === id);
        if (index !== -1) {
            const [deleted] = mockPhotos.splice(index, 1);
            return Promise.resolve(deleted);
        }
        return Promise.resolve(null);
    })
}));

describe('Macro Photography API', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('GET /api/photos - should return all photos', async () => {
        const response = await supertest(app).get('/api/photos');
        expect(response.status).toBe(200);
        expect(response.body.status).toBe("success");
        expect(Array.isArray(response.body.payload)).toBe(true);
    });

    it('GET /api/photos/:id - should return a specific photo', async () => {
        const response = await supertest(app).get('/api/photos/1');
        expect(response.status).toBe(200);
        expect(response.body.payload.title).toBe("Dewdrops on Spiderweb");
    });

    it('POST /api/photos - should add a new photo', async () => {
        const newPhoto = {
            title: "Butterfly Wing Scales",
            photographer: "John Smith",
            camera_model: "Nikon D850",
            lens_model: "Laowa 100mm 2x Ultra Macro",
            aperture: "f/11",
            shutter_speed: "1/250",
            iso: 400
        };
        
        const response = await supertest(app)
            .post('/api/photos')
            .send(newPhoto);
            
        expect(response.status).toBe(201);
        expect(photosModel.addPhoto).toHaveBeenCalledWith(newPhoto);
    });

    it('PUT /api/photos/:id - should update a photo', async () => {
        const updates = {
            title: "Updated Spiderweb",
            description: "Updated description"
        };
        
        const response = await supertest(app)
            .put('/api/photos/1')
            .send(updates);
            
        expect(response.status).toBe(200);
        expect(photosModel.updatePhoto).toHaveBeenCalledWith("1", updates);
    });

    it('DELETE /api/photos/:id - should delete a photo', async () => {
        const response = await supertest(app).delete('/api/photos/1');
        expect(response.status).toBe(200);
        expect(photosModel.deletePhoto).toHaveBeenCalledWith("1");
    });
});