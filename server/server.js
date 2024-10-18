const express = require("express");
const mongoose = require('mongoose'); 
const cors = require('cors');
const app = express();

const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env._PORT || 27015;

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000', // Allow requests from your frontend
    methods: ['GET', 'POST','DELETE','PUT'], // Specify allowed methods
    credentials: true, // Allow cookies to be sent
}));
const MyStd = require('./routes/std_route');
const auth = require('./routes/auth_route');
const user = require('./routes/user_route');
app.use('/std', MyStd);
app.use('/auth', auth);
app.use('/user', user);



mongoose.connect(process.env.MONGO_DB_URI)
    .then(() => { console.log("MONGO DB connected") })
    .catch(err => console.log(err));



app.listen(PORT, '0.0.0.0', () => {
    console.log("Server running on " +"http://localhost:" + (PORT));
});