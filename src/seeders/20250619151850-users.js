'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('users', [
      {
        email: 'user1@example.com',
        name: 'User One',
        password_hash: bcrypt.hashSync('password123', 10), // التشفير هنا
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: 'user2@example.com',
        name: 'User Two',
        password_hash: bcrypt.hashSync('securepass456', 10),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('users', null, {});
  },
};
