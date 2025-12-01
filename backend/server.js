// ⚙️ backend/server.js - CÓDIGO FINAL CON ROLES, CATEGORÍAS Y SUBIDA DE IMAGEN 
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const fsp = require('fs/promises');

require('dotenv').config();

const { verifyToken } = require('./middleware/auth'); 
const { verifyRole } = require('./middleware/role'); 

const app = express();
const port = 3001; 

// =========================================================
// CONFIGURACIÓN DE MULTER PARA SUBIDA DE IMAGEN
// =========================================================
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, 'uploads', 'services');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

app.use(cors());
app.use(express.json());
app.use('/uploads/services', express.static(path.join(__dirname, 'uploads', 'services')));

// --- Conexión y Configuración ---
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE 
});
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
const pool = db.promise(); 

// ==================================================================
// AUTENTICACIÓN
// ==================================================================
app.post('/api/auth/register', async (req, res) => {
    const { name, email, password, phone, address } = req.body; 
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiresAt = new Date(Date.now() + 3600000); 

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = `
            INSERT INTO users 
            (name, email, password, phone, address, verification_token, token_expires_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [name, email, hashedPassword, phone || null, address || null, verificationToken, tokenExpiresAt];
        await pool.query(query, values); 

        const verificationUrl = `http://localhost:${port}/api/auth/verify?token=${verificationToken}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verifica tu cuenta de El Oráculo Verde',
            html: `
                <h2>¡Bienvenido, ${name}!</h2>
                <p>Gracias por registrarte. Haz clic en el siguiente enlace para verificar tu correo:</p>
                <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; border-radius: 5px;">Verificar mi Email</a>
            `,
        };
        await transporter.sendMail(mailOptions);
        res.status(201).json({ message: 'Registro exitoso. Revisa tu email para verificar tu cuenta.' });
    } catch (error) {
        console.error("Error en el registro:", error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'El email ya está registrado.' });
        }
        res.status(500).json({ message: 'Error en el servidor.' });
    }
});

app.get('/api/auth/verify', async (req, res) => {
    const { token } = req.query;
    const frontendRedirectUrl = 'http://localhost:5173/login'; 

    try {
        const [rows] = await pool.query(
            'SELECT id FROM users WHERE verification_token = ? AND token_expires_at > NOW()',
            [token]
        );

        if (rows.length === 0) {
            return res.redirect(`${frontendRedirectUrl}?verification=expired`);
        }

        const userId = rows[0].id;
        await pool.query('UPDATE users SET is_verified = 1, verification_token = NULL, token_expires_at = NULL WHERE id = ?', [userId]);

        res.redirect(`${frontendRedirectUrl}?verification=success`);

    } catch (error) {
        console.error("Error en la verificación:", error);
        res.redirect(`${frontendRedirectUrl}?verification=error`);
    }
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        const user = rows[0];
        if (!user) return res.status(401).json({ message: 'Credenciales inválidas.' });
        if (user.is_verified === 0) return res.status(403).json({ message: 'Verifica tu email antes de iniciar sesión.' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Credenciales inválidas.' });

        const token = jwt.sign(
            { id: user.id, email: user.email, name: user.name, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, phone: user.phone, address: user.address, role: user.role } });
    } catch (error) {
        console.error("Error en el login:", error);
        res.status(500).json({ message: 'Error en el servidor.' });
    }
});

// ==================================================================
// SERVICIOS CRUD
// ==================================================================
app.get('/api/services', async (req, res) => {
    const categoryId = req.query.category_id; 
    try {
        let query = `
            SELECT s.id, s.name, s.description, s.price, s.image_url, c.name AS category_name, c.id AS category_id
            FROM services s LEFT JOIN categories c ON s.category_id = c.id
        `;
        const values = [];
        if (categoryId) {
            query += ' WHERE s.category_id = ?';
            values.push(categoryId);
        }
        query += ' ORDER BY s.id DESC';
        const [services] = await pool.query(query, values);
        res.json(services);
    } catch (error) {
        console.error("Error al obtener servicios:", error);
        res.status(500).json({ message: 'Error al obtener la lista de servicios.' });
    }
});

app.post('/api/services', verifyToken, verifyRole(['admin', 'developer']), upload.single('image'), async (req, res) => { 
    const imagePath = req.file ? `/uploads/services/${req.file.filename}` : null;
    const { name, description, price, category_id } = req.body;
    if (!name || !price || !imagePath) {
        if (req.file) await fs.unlink(req.file.path).catch(()=>{});
        return res.status(400).json({ message: 'Faltan campos obligatorios o la imagen falló al subir.' });
    }

    try {
        const query = 'INSERT INTO services (name, description, price, image_url, category_id) VALUES (?, ?, ?, ?, ?)';
        const result = await pool.query(query, [name, description, price, imagePath, category_id || null]);
        res.status(201).json({ message: 'Servicio creado exitosamente.', serviceId: result[0].insertId, imageUrl: imagePath });
    } catch (error) {
        if (req.file) await fs.unlink(req.file.path).catch(()=>{});
        res.status(500).json({ message: 'Fallo al crear el servicio.' });
    }
});

// ==================================================================
// CATEGORÍAS
// ==================================================================
app.get('/api/categories', async (req, res) => {
    try {
        const [categories] = await pool.query('SELECT id, name FROM categories ORDER BY name');
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error al cargar categorías.' });
    }
});

app.post('/api/categories', verifyToken, verifyRole(['admin', 'developer']), async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'El nombre de la categoría es requerido.' });
    try {
        await pool.query('INSERT INTO categories (name) VALUES (?)', [name]);
        res.status(201).json({ message: 'Categoría creada exitosamente.' });
    } catch (error) {
        res.status(500).json({ message: 'Fallo al crear la categoría.' });
    }
});

// ==================================================================
// PROMOVER USUARIOS A ADMIN
// ==================================================================
app.put('/api/admin/promote/:userId', verifyToken, verifyRole(['developer']), async (req, res) => {
    const { userId } = req.params;
    try {
        const [result] = await pool.query('UPDATE users SET role = ? WHERE id = ? AND role = ?', ['admin', userId, 'user']);
        if (result.affectedRows === 0) {
            const [rows] = await pool.query('SELECT role FROM users WHERE id = ?', [userId]);
            if (rows.length === 0) return res.status(404).json({ message: 'Usuario no encontrado.' });
            if (rows[0].role !== 'user') return res.status(409).json({ message: `El usuario ya tiene el rol ${rows[0].role}.` });
        }
        res.json({ message: `Usuario con ID ${userId} promovido a rol 'admin' exitosamente.` });
    } catch (error) {
        res.status(500).json({ message: 'Fallo al actualizar el rol del usuario.' });
    }
});

// ==================================================================
// NUEVO ENDPOINT: ASIGNAR CUALQUIER ROL (user, admin, developer)
// ==================================================================
app.put('/api/users/:id/role', verifyToken, verifyRole(['admin', 'developer']), async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    try {
        if (!['user', 'admin', 'developer'].includes(role)) {
            return res.status(400).json({ message: 'Rol no válido. Usa: user, admin o developer.' });
        }
        const [rows] = await pool.query('SELECT id, role FROM users WHERE id = ?', [id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Usuario no encontrado.' });
        if (rows[0].role === role) return res.status(409).json({ message: `El usuario ya tiene el rol '${role}'.` });
        const [result] = await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, id]);
        if (result.affectedRows === 0) return res.status(400).json({ message: 'No se pudo actualizar el rol.' });
        res.json({ message: `Rol del usuario ${id} actualizado a '${role}'.` });
    } catch (error) {
        res.status(500).json({ message: 'Error interno al asignar rol.' });
    }
});

// ==================================================================
// INICIO DEL SERVIDOR
// ==================================================================
app.listen(port, () => {
    console.log(`Servidor de la API escuchando en http://localhost:${port}`);
});
