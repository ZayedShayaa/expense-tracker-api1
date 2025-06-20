'use strict';

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('expenses', [
      {
        user_id: 1, 
        amount: 50.00,
        category: 'Food',
        description: 'Lunch at  restaurant with myfriend',
        incurred_at: new Date('2025-06-01T12:00:00Z'),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 2, 
        amount: 120.00,
        category: 'Transportation',
        description: 'Monthly bus ',
        incurred_at: new Date('2025-06-02T09:00:00Z'),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('expenses', null, {});
  },
};
