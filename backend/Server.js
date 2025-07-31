const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const punchRouter = require('./routes/Punch');
const authRouter = require('./routes/auth');
const employeeRouter = require('./routes/employee');

const app = express();
const PORT = 5000;

// ✅ Allow all origins with CORS
app.use(cors()); // <--- This allows all origins

// If you want to allow credentials with specific headers (optional):
// app.use(cors({
//   origin: '*',
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// }));

app.use(bodyParser.json({ limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/auth', authRouter);
app.use('/punchtime', punchRouter);
app.use('/employee', employeeRouter);

app.listen(PORT, () => {
  console.log(`✅ Server running at http://192.168.1.24:${PORT}`);
});
