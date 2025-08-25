const express = require('express');
const router = express.Router();

// Example Admin Route
// This will be accessible at GET /api/admin/
router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Admin API!' });
});

// Add other admin-specific routes here...
// For example:
// router.get('/users', (req, res) => { ... });
// router.post('/products', (req, res) => { ... });


// Don't forget to export the router
module.exports = router;
