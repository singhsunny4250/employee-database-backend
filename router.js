const express = require('express');
const router = express.Router();
const db = require('./db'); 

router.get('/employee', (req, res) => {
  const keyword = req.query.Name;
  if (keyword) {
    db.query('SELECT * FROM employees WHERE employeeName LIKE ?', [`%${keyword}%`], (err, results) => {
      if (err) {
        console.error('Error retrieving employees:', err.message);
        return res.status(500).json({ error: 'Failed to retrieve employees' });
      }
      return res.json(results);
    });
  } else {
    db.query('SELECT * FROM employees', (err, results) => {
      if (err) {
        console.error('Error retrieving employees:', err.message);
        return res.status(500).json({ error: 'Failed to retrieve employees' });
      }
      return res.json(results);
    });
  }
});

router.get('/employee/:id', (req, res) => {
  const employeeId = req.params.id;
  db.query('SELECT * FROM employees WHERE id = ?', [employeeId], (err, results) => {
    if (err) {
      console.error('Error retrieving employee:', err.message);
      return res.status(500).json({ error: 'Failed to retrieve employee' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    return res.json(results[0]);
  });
});

router.post('/employee', (req, res) => {
  const { employeeName, designation, experience } = req.body;
  db.query('INSERT INTO employees (employeeName, designation, experience) VALUES (?, ?, ?)', [employeeName, designation, experience], (err, results) => {
    if (err) {
      console.error('Error creating employee:', err.message);
      return res.status(500).json({ error: 'Failed to create employee' });
    }
    return res.json({ id: results.insertId, employeeName, designation, experience });
  });
});

router.put('/employee/:id', (req, res) => {
  const employeeId = req.params.id;
  const { employeeName, designation, experience } = req.body;
  db.query('UPDATE employees SET employeeName = ?, designation = ?, experience = ? WHERE id = ?', [employeeName, designation, experience, employeeId], (err, results) => {
    if (err) {
      console.error('Error updating employee:', err.message);
      return res.status(500).json({ error: 'Failed to update employee' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    return res.json({ id: employeeId, employeeName, designation, experience });
  });
});

router.delete('/employee/:id', (req, res) => {
  const employeeId = req.params.id;
  db.query('DELETE FROM employees WHERE id = ?', [employeeId], (err, results) => {
    if (err) {
      console.error('Error deleting employee:', err.message);
      return res.status(500).json({ error: 'Failed to delete employee' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    return res.json({ id: employeeId });
  });
});

router.delete('/employee', (req, res) => {
  db.query('DELETE FROM employees', (err, results) => {
    if (err) {
      console.error('Error deleting all employees:', err.message);
      return res.status(500).json({ error: 'Failed to delete all employees' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'No employees found to delete' });
    }
    return res.json({ message: 'All employees have been deleted successfully' });
  });
});

module.exports = router;
