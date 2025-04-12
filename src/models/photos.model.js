const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT) || 5432,
    allowExitOnIdle: true
});

const getAllPhotos = async () => {
    const query = `SELECT * FROM macro_photos`;
    const result = await pool.query(query);
    return result.rows;
};

const getPhoto = async (id) => {
    const query = `SELECT * FROM macro_photos WHERE id = $1`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

const addPhoto = async (photoData) => {
    const { 
        title, 
        photographer,
        camera_model,
        lens_model,
        aperture,
        shutter_speed,
        iso,
        focal_length,
        magnification,
        subject,
        location,
        date_taken,
        description,
        tags
    } = photoData;

    const query = `
        INSERT INTO macro_photos (
            title, photographer, camera_model, lens_model, aperture,
            shutter_speed, iso, focal_length, magnification, subject,
            location, date_taken, description, tags
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING *
    `;
    
    const result = await pool.query(query, [
        title, photographer, camera_model, lens_model, aperture,
        shutter_speed, iso, focal_length, magnification, subject,
        location, date_taken, description, tags
    ]);
    
    return result.rows[0];
};

const updatePhoto = async (id, updateData) => {
    const setClause = Object.keys(updateData)
        .map((key, index) => `${key} = $${index + 1}`)
        .join(', ');
    
    const values = Object.values(updateData);
    values.push(id);
    
    const query = `
        UPDATE macro_photos
        SET ${setClause}
        WHERE id = $${values.length}
        RETURNING *
    `;
    
    const result = await pool.query(query, values);
    return result.rows[0];
};

const deletePhoto = async (id) => {
    const query = `DELETE FROM macro_photos WHERE id = $1 RETURNING *`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

module.exports = {
    getAllPhotos,
    getPhoto,
    addPhoto,
    updatePhoto,
    deletePhoto
};