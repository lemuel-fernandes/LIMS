# 🧪 LIMS - Laboratory Information Management System

A web-based Laboratory Information Management System (LIMS) designed to streamline equipment issuance, lab activity tracking, and inventory management. Built with HTML, CSS, JavaScript (Frontend) and Node.js + Express + MongoDB (Backend).

## 🔧 Features

- 📊 Lab Instructor Dashboard  
- 🧾 Issue Equipment Form (with floating modal UI)  
- 📚 Equipment Inventory Table with pagination and status tags  
- 🔍 Search and sort functionality  
- 🧠 Backend APIs to manage equipment data (CRUD)  
- 🔒 Future Scope: Authentication for lab instructors and admins  

---

## 🚀 Tech Stack

### Frontend:
- HTML5 / CSS3 / Vanilla JavaScript  
- Font Awesome Icons  

### Backend:
- Node.js  
- Express.js  
- MongoDB (via Mongoose)  

---


## 🔌 API Endpoints

| Method | Endpoint              | Description                 |
|--------|-----------------------|-----------------------------|
| POST   | `/api/equipment`      | Add new equipment           |
| GET    | `/api/equipment`      | Fetch all equipment records |
| PUT    | `/api/equipment/:id`  | Update equipment details    |
| DELETE | `/api/equipment/:id`  | Delete equipment record     |

---

## 📦 Installation

### 1. Clone the repo
```bash
git clone https://github.com/your-username/lims.git
cd lims
```

### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

### 3. Set up `.env` in `/backend`
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/lims
```

### 4. Start the Server
```bash
node server.js
```

### 5. Open the frontend
Open `frontend/index.html` in your browser (or serve it via Live Server).

---

## ✅ Future Enhancements

- User login for lab instructors & admins  
- Analytics dashboard for inventory trends  
- Export data as CSV/PDF  
- Multi-lab and department support  

---

## 🙌 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

---

## 📄 License

This project is open source.

---

## 👨‍💻 Developed By

**Lemuel Fernandes**  
[LinkedIn](https://www.linkedin.com/in/lemuel-fernandes)

**Aiswarya**
[LinkedIn]

**Vyshak**
[LinkedIn]

**Jon**
[LinkedIn]

**Sarah**
[LinkedIn]
