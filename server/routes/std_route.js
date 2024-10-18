const express = require('express');
const router = express.Router();
const { saveStudentData,getStudentById,getAllStudents,deleteStudent,updateStudent     } = require('../controllers/std_controller'); // Adjust path as needed
const { authenticateToken, roleAuthorization } = require('../middlewares/auth_middlewares'); // Adjust the path
// Route to handle form submission
router.post('/submit',saveStudentData);
router.get('/read/:std_id', getStudentById);
router.get('/reads', getAllStudents);
router.delete('/del/:std_id', authenticateToken, roleAuthorization(['1', '2']), deleteStudent);
router.put('/edit/:std_id', authenticateToken, roleAuthorization(['1', '2']), updateStudent);

module.exports = router;
