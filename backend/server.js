const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/admin', adminRoutes);

// Root Health Check Route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'مرحباً بك في الخادم الخلفي لنظام إدارة المدرسة المرتكز على الطالب (V1 MVP)',
    version: '1.0.0',
    status: 'Running'
  });
});

// Global 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'عذراً، المسار المطلوب غير موجود.' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'حدث خطأ غير متوقع في الخادم.'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
