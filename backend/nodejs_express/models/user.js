
const db = require('../config/config');
const bcrypt = require('bcryptjs');

const User = {};

// LISTAR USUARIOS
User.findAll = (result) => {
  const sql = `
    SELECT id, email, name, lastname, phone, image, role,
           created_at, updated_at
    FROM users
  `;

  db.query(sql, (err, users) => {
    if (err) return result(err, null);
    result(null, users);
  });
};

// BUSCAR USUARIO POR ID
User.findById = (id, result) => {
  const sql = `
    SELECT id, email, name, lastname, image, phone, role, password
    FROM users WHERE id = ?
  `;

  db.query(sql, [id], (err, users) => {
    if (err) return result(err, null);
    result(null, users[0] || null);
  });
};

// BUSCAR USUARIO POR CORREO
User.findByEmail = (email, result) => {
  const sql = `
    SELECT id, email, name, lastname, image, phone, role, password
    FROM users WHERE email = ?
  `;

  db.query(sql, [email], (err, users) => {
    if (err) return result(err, null);
    result(null, users[0] || null);
  });
};

// CREAR USUARIO
User.create = async (user, result) => {
  try {
    const hash = await bcrypt.hash(user.password, 10);
    const validRoles = ['admin', 'seller', 'customer', 'user'];
    const role = validRoles.includes(user.role) ? user.role : 'user';

    const sql = `
      INSERT INTO users (
        name, lastname, email, password, phone, image,
        role, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [
      user.name,
      user.lastname,
      user.email,
      hash,
      user.phone || null,
      user.image || null,
      role,
      new Date(),
      new Date()
    ], (err, response) => {
      if (err) return result(err, null);

      result(null, {
        id: response.insertId,
        ...user,
        role
      });
    });
  } catch (err) {
    result(err, null);
  }
};

// ACTUALIZAR USUARIO
User.update = async (user, result) => {
  try {
    const fields = [];
    const values = [];

    if (user.password) {
      const hash = await bcrypt.hash(user.password, 10);
      fields.push('password = ?');
      values.push(hash);
    }

    const allowedFields = [
      'email',
      'name',
      'lastname',
      'phone',
      'image',
      'role'
    ];

    allowedFields.forEach((field) => {
      if (user[field] !== undefined) {
        fields.push(`${field} = ?`);
        values.push(user[field]);
      }
    });

    if (fields.length === 0) {
      return result(new Error('No hay datos para actualizar'), null);
    }

    fields.push('updated_at = ?');
    values.push(new Date());
    values.push(user.id);

    const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;

    db.query(sql, values, (err, response) => {
      if (err) return result(err, null);
      result(null, response);
    });
  } catch (err) {
    result(err, null);
  }
};

// ELIMINAR USUARIO
User.delete = (id, result) => {
  const sql = 'DELETE FROM users WHERE id = ?';

  db.query(sql, [id], (err, response) => {
    if (err) return result(err, null);
    result(null, response);
  });
};

module.exports = User;
