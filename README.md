# Library Management System

A full-stack library management system built with modern web technologies, featuring secure authentication and a responsive user interface.

## 🚀 Features

- **User Authentication**: Secure password hashing using bcrypt
- **Book Management**: Add, update, delete, and search for books
- **User Management**: Track library members and their borrowing history
- **Responsive Design**: Modern UI built with React and Tailwind CSS
- **RESTful API**: Clean and well-structured backend API
- **Database**: SQLite for lightweight and efficient data storage

## 🛠️ Tech Stack

### Frontend
- **React**: UI library for building interactive interfaces
- **Tailwind CSS**: Utility-first CSS framework for styling
- **JavaScript**: Core programming language

### Backend
- **Node.js**: JavaScript runtime environment
- **Express**: Web application framework
- **SQLite**: Lightweight SQL database
- **bcrypt**: Password hashing library for security

### Deployment
- **AWS EC2**: Cloud hosting platform
- **Nginx**: Web server and reverse proxy

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- Git

## 🔧 Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/library-management-system.git
cd library-management-system
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Install frontend dependencies**
```bash
cd ../frontend
npm install
```

4. **Initialize the database**
```bash
cd backend
npm run init-db
```

## 🚀 Running the Application

### Development Mode

1. **Start the backend server**
```bash
cd backend
npm run dev
```

2. **Start the frontend development server**
```bash
cd frontend
npm start
```

The application will be available at `http://localhost:3000`

### Production Mode

1. **Build the frontend**
```bash
cd frontend
npm run build
```

2. **Start the backend server**
```bash
cd backend
npm start
```

## 📦 Deployment on AWS EC2

### Prerequisites
- AWS EC2 instance running Ubuntu/Amazon Linux
- Domain name (optional)
- SSH access to your EC2 instance

### Deployment Steps

1. **Connect to your EC2 instance**
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

2. **Install Node.js and npm**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

3. **Install Nginx**
```bash
sudo apt-get update
sudo apt-get install nginx
```

4. **Clone and setup the application**
```bash
git clone https://github.com/yourusername/library-management-system.git
cd library-management-system
```

5. **Install dependencies and build**
```bash
cd backend && npm install
cd ../frontend && npm install && npm run build
```

6. **Configure Nginx**
```bash
sudo nano /etc/nginx/sites-available/library-system
```

Add the following configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        root /path/to/library-management-system/frontend/build;
        try_files $uri /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

7. **Enable the site and restart Nginx**
```bash
sudo ln -s /etc/nginx/sites-available/library-system /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

8. **Setup PM2 for process management**
```bash
sudo npm install -g pm2
cd backend
pm2 start server.js --name library-backend
pm2 startup
pm2 save
```

## 📊 Database Schema

The system includes pre-populated fake data for testing purposes, including:
- Sample books with various genres
- Test user accounts
- Sample borrowing records

## 🔐 Security Features

- Password hashing using bcrypt
- Environment variable configuration
- Input validation and sanitization

---
