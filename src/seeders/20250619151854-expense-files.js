'use strict';

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('expense_files', [
      {
        expense_id: 1,
        filename: 'zayed1.pdf',
        file_url: 'https://rest.com/files/zayed1.pdf',
        uploaded_at: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        expense_id: 2,
        filename: 'invoice2.jpg',
        file_url: 'https://rest.com/files/invoice2.jpg',
        uploaded_at: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('expense_files', null, {});
  },
};
