const StdDetails = require('../models/std_details_tbl'); // Adjust path as needed
const StdSchool = require('../models/std_school_tbl');   // Adjust path as needed
const Std = require('../models/std_tbl');                // Adjust path as needed

// Controller function to handle saving data
exports.saveStudentData = async (req, res) => {
    try {
        // Extract data from request body
        const {
            std_id,
            std_father_name,
            std_father_tel,
            std_mother_name,
            std_mother_tel,
            std_parent_name,
            std_parent_tel,
            std_parent_rela,
            allergic_things,
            allergic_drugs,
            allergic_condition,
            sch_name,
            sch_province,
            prefix,
            std_Fname,
            std_Lname,
            std_nickname,
            std_religion,
            major,
            std_tel
        } = req.body;

        // Log the received data
        console.log('Received data:', req.body);

        // Create new instances of the models
        const studentDetails = new StdDetails({
            std_id,
            std_father_name,
            std_father_tel,
            std_mother_name,
            std_mother_tel,
            std_parent_name,
            std_parent_tel,
            std_parent_rela,
            allergic_things,
            allergic_drugs,
            allergic_condition
        });

        const studentSchool = new StdSchool({
            std_id,
            sch_name,
            sch_province
        });

        const student = new Std({
            std_id,
            prefix,
            std_Fname,
            std_Lname,
            std_nickname,
            std_religion,
            major,
            std_tel
        });

        // Save the instances to the database
        await studentDetails.save();
        await studentSchool.save();
        await student.save();

        // Send success response
        res.status(201).json({ message: 'Student data saved successfully' });
    } catch (error) {
        // Handle errors
        console.error('Error saving student data:', error);
        res.status(500).json({ message: 'Failed to save student data' });
    }
};

// Controller function to handle reading a single student's data
exports.getStudentById = async (req, res) => {
    try {
        const { std_id } = req.params;

        // Find student data by ID
        const student = await Std.findOne({ std_id });
        const studentDetails = await StdDetails.findOne({ std_id });
        const studentSchool = await StdSchool.findOne({ std_id });

        if (!student || !studentDetails || !studentSchool) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Combine the data
        const studentData = {
            student,
            studentDetails,
            studentSchool
        };

        // Send the response
        res.status(200).json(studentData);
    } catch (error) {
        // Handle errors
        console.error('Error reading student data:', error);
        res.status(500).json({ message: 'Failed to retrieve student data' });
    }
};

// Controller function to handle reading all students' data
exports.getAllStudents = async (req, res) => {
    try {
        // Find all student data
        const students = await Std.find();
        const studentDetails = await StdDetails.find();
        const studentSchools = await StdSchool.find();

        // Combine the data
        const studentData = students.map(student => {
            return {
                student,
                studentDetails: studentDetails.find(detail => detail.std_id === student.std_id),
                studentSchool: studentSchools.find(school => school.std_id === student.std_id)
            };
        });

        // Send the response
        res.status(200).json(studentData);
    } catch (error) {
        // Handle errors
        console.error('Error reading all students data:', error);
        res.status(500).json({ message: 'Failed to retrieve students data' });
    }
};


// Controller function to handle deleting student data
exports.deleteStudent = async (req, res) => {
    try {
        const { std_id } = req.params;

        // Delete student data from each collection
        await Std.deleteOne({ std_id });
        await StdDetails.deleteOne({ std_id });
        await StdSchool.deleteOne({ std_id });

        // Send success response
        res.status(200).json({ message: 'Student data deleted successfully' });
    } catch (error) {
        // Handle errors
        console.error('Error deleting student data:', error);
        res.status(500).json({ message: 'Failed to delete student data' });
    }
};


// Controller function to handle updating student data
exports.updateStudent = async (req, res) => {
    try {
        const { std_id } = req.params;
        const {
            std_father_name,
            std_father_tel,
            std_mother_name,
            std_mother_tel,
            std_parent_name,
            std_parent_tel,
            std_parent_rela,
            allergic_things,
            allergic_drugs,
            allergic_condition,
            sch_name,
            sch_province,
            prefix,
            std_Fname,
            std_Lname,
            std_nickname,
            std_religion,
            major,
            std_tel
        } = req.body;

        // Update student data in each collection
        await Std.updateOne({ std_id }, {
            prefix,
            std_Fname,
            std_Lname,
            std_nickname,
            std_religion,
            major,
            std_tel
        });
        
        await StdDetails.updateOne({ std_id }, {
            std_father_name,
            std_father_tel,
            std_mother_name,
            std_mother_tel,
            std_parent_name,
            std_parent_tel,
            std_parent_rela,
            allergic_things,
            allergic_drugs,
            allergic_condition
        });

        await StdSchool.updateOne({ std_id }, {
            sch_name,
            sch_province
        });

        // Send success response
        res.status(200).json({ message: 'Student data updated successfully' });
    } catch (error) {
        // Handle errors
        console.error('Error updating student data:', error);
        res.status(500).json({ message: 'Failed to update student data' });
    }
};
