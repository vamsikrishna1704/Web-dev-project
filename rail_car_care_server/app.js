require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Complaint=require('./models/Complaint');
const Assignment=require('./models/Assignment');
const User=require('./models/User');
const Order=require('./models/Order');
const TrainDetail = require('./models/TrainDetail')
const Train=require('./models/Train');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const session = require('express-session')


const app = express();
// Middleware to parse JSON and form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:3000'  // Adjust this if your frontend origin is different
}));

app.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true
}));

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.USER,
    pass: process.env.PASS
  }
});

// MongoDB Atlas connection URI
const dbURI = 'mongodb+srv://vkNaidu:pv2mVzMnOTG9UaoO@cluster0.69pfljh.mongodb.net/railcarcaredb?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });

// API endpoint to handle form submission
app.post('/submit-complaint', async (req, res) => {

  try {
    const newComplaint = new Complaint(req.body);
    const savedComplaint = await newComplaint.save();
    res.status(201).json(savedComplaint); // Sending back the saved complaint as a JSON response
  } catch (error) {
    console.error('Error submitting complaint:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/create-employee', async (req, res) => {
  const user = req.body;
  try {
    // Create a new employee instance
    const newEmployee = new User(user);

    // Save the new employee to the database
    const data = await newEmployee.save();

    // Send a welcome email to the employee
    const mailOptions = {
      from: process.env.USER,
      to: newEmployee.email,
      subject: 'Welcome to the Company!',
      text: `Dear ${newEmployee.empFirstName},\n\nWelcome to our company! Your employee ID is ${newEmployee.empId} and password: ${newEmployee.password}.\n\nBest regards,\nThe Company Team`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    // Respond with the created employee
    res.status(200).send(newEmployee);
  } catch (error) {
    console.error('Error creating employee:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/assign-order', async (req, res) => {
  try {
    const newAssignment = new Assignment(req.body);
    const savedAssignment = await newAssignment.save();
    res.status(201).json(savedAssignment); // Sending back the saved complaint as a JSON response
  } catch (error) {
    console.error('Error submitting complaint:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/add-order', async (req, res) => {
  try {
    const order = new Order(req.body);
    const savedOrder = await order.save();
    res.status(201).json(savedOrder); // Sending back the saved complaint as a JSON response
  } catch (error) {
    console.error('Error submitting complaint:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/get-assigned-tasks', async (req, res) => {
  try {
    const assignments = await Assignment.find();
    res.json(assignments);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/get-orders', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/get-orders-emp', async (req, res) => {
  const {user} =req.body;
  try {
    const orders = await Order.find({empId: {$eq: user}});
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/get-complaints', async (req, res) => {
  try {
    const complaints = await Complaint.find();
    res.json(complaints);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/get-unassigned-complaints', async (req, res) => {
  try {
    const complaints = await Complaint.find({status: {$eq: 'open'}});
    res.json(complaints);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/get-technicians', async (req, res) => {
  const {user} = req.body;
  try {
    const users = await User.find({assignstatus: {$eq: 'unassign'}, manager:{$eq: user}});
    res.json(users);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/update-complaint-assign', async (req, res) => {
  try {
    const {trainNo, compartment, status} = req.body;


    // Find the user by ID and update the specified fields
    const updatedComplaint = await Complaint.findOneAndUpdate(
      { trainNo: {$eq : trainNo}, compartment: {$eq: compartment}},
      { $set: {status: status} },
      { new: true }
    );

    if (updatedComplaint) {
      res.json(updatedComplaint);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/update-profile', async (req, res) => {
  const { empId, profileData } = req.body;

  if (!empId || !profileData) {
      return res.status(400).send('Missing empId or profile data');
  }

  try {
      const updatedUser = await User.findOneAndUpdate(
          { empId: empId },
          {
              $set: {
                  empFirstName: profileData.empFirstName,
                  empLastName: profileData.empLastName,
                  phone: profileData.phone,
                  email: profileData.email,
                  birthDate: profileData.birthDate
              }
          },
          { new: true } // This option returns the document after update
      );

      if (!updatedUser) {
          return res.status(404).send('User not found');
      }

      res.status(200).json(updatedUser);
  } catch (error) {
      console.error('Error updating user profile:', error);
      res.status(500).send('Error updating user profile');
  }
});

app.post('/update-user-assign', async (req, res) => {
  try {
    const {empId, status} = req.body;

    // Find the user by ID and update the specified fields
    const updatedUser = await User.findOneAndUpdate(
      { empId: {$eq : empId}},
      { $set: { assignstatus: status} },
      { new: true }
    );

    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/update-order', async (req, res) => {
  try {
    const {_id, status} = req.body;
    // Find the user by ID and update the specified fields
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: {$eq : _id}},
      { $set: { status: status} },
      { new: true }
    );

    if (updatedOrder) {
      res.json(updatedOrder);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/get-employee', async (req, res) => {
  const { user } = req.body;
  try {
    const employees = await User.findOne({empId: {$eq : user}})
    res.json(employees);
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/get-employees', async (req, res) => {
  const { user } = req.body;
  try {
    const employees = await User.find({manager: {$eq : user}})
    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/get-trains', async (req, res) => {
  const trains = await Train.find();
  res.json(trains);
});

app.post('/get-train', async (req, res) => {
  const { trainNo } = req.body;
  try {
    const trainType = await Train.findOne({trainNo: {$eq : trainNo}})
    const trainDetails = await TrainDetail.findOne({traintype: {$eq: trainType.traintype}});
    res.json(trainDetails);
  } catch (error) {
    console.error('Error fetching trains:', error);
    res.status(500).send('Internal Server Error');
  }

});

// API endpoint to delete a complaint by ID
app.delete('/delete-complaint/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Complaint.findByIdAndDelete(id);
    res.send('Complaint deleted successfully');
  } catch (error) {
    console.error('Error deleting complaint:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.delete('/delete-order/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Order.findByIdAndDelete(id);
    res.send('Order deleted successfully');
  } catch (error) {
    console.error('Error deleting complaint:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.delete('/delete-assignment/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Assignment.findByIdAndDelete(id);
    res.send('Assignment deleted successfully');
  } catch (error) {
    console.error('Error deleting complaint:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/login', async (req, res) => {
  const { empId, password, role } = req.body;

  const user = await User.findOne({ empId, role });

  if (!user) {
      return res.status(400).json({ message: 'User not found' });
  }

  const hashedPassword = await bcrypt.hash(user.password, 10);
  const isMatch = await bcrypt.compare(password, hashedPassword);

  if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
  }
  req.session.user = { empId, role: role };
  // Generate JWT Token
  const secret = process.env.JWT_SECRET
  const token = jwt.sign({ id: user._id, role: user.role }, secret, { expiresIn: '1h' });

  // Successful login
  return res.status(200).json({ message: 'Logged successfully', token });
});

const authenticate = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  } else {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

 // Applying middleware to /home route
app.use('/home', authenticate);
app.use('/complaints', authenticate);
app.use('/orders', authenticate);// Applying middleware to /manager route

let otpStore = {};

app.post('/request-password-reset', async (req, res) => {
  const {empId, email} = req.body;
  const otp = crypto.randomBytes(3).toString('hex').toUpperCase();
  
  otpStore[email] = { otp, expires: new Date().getTime() + 60 }; // 1 minutes expiry

  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: email,
    subject: 'Password Reset OTP',
    text: `Your OTP is ${otp}`
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
      res.status(500).send('Error sending email');
    } else {
      console.log('Email sent: ' + info.response);
      res.send('OTP sent to email');
    }
  });
});

app.post('/reset-password', async(req, res) => {
  const { empId, email, otp, password } = req.body;

  const storedOtp = otpStore[email];

  try{

    if (!storedOtp || storedOtp.expires > new Date().getTime()) {
      delete otpStore[email]; // Clear the used OTP
      return res.status(400).send('OTP expired or invalid');
    }
    
    if (storedOtp.otp !== otp) {
      delete otpStore[email]; // Clear the used OTP
      return res.status(400).send('Invalid OTP');
    }
    

  // Proceed to reset password logic (e.g., update in database)
  // Remember to hash the new password before storing
  const updatePassword = await User.findOneAndUpdate(
    { empId: {$eq : empId}, email: {$eq : email}},
    { $set: { password: password } },
    { new: true }
  );

  if (updatePassword) {
    console.log('Password updated successfully:', updatePassword);
  } else {
    console.log('User not found with the provided email.');
  }
 } catch (error) {
  console.error('Error updating password:', error);
}
  // Clear the used OTP
  delete otpStore[email];

  res.send('Password reset successfully');
});

app.get('/logout', (req, res) => {

  req.session.destroy((err) => {
      if (err) {
          res.status(400).json({message:'Logout failed.'})
          console.error(err);
      } else {
          res.status(200).json({ success: true });
      }
  });
});


// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
