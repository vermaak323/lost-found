# Lost & Found Items Web App

A web-based Lost & Found application designed to help users report and discover lost or found items in colleges, offices, and public spaces. The platform enables quick posting, browsing, and viewing of item details to improve item recovery efficiency.

---

## 🌐 Live Demo

🔗 https://lost-found-tjcv.onrender.com/

---

## 🎯 Problem Statement

In campuses and public places, lost and found items are often reported informally, leading to slow information flow and reduced chances of recovery. This application provides a centralized digital platform to streamline the lost & found process.

---

## 🚀 Features

- Add a **Lost Item** or **Found Item**
- View all reported items in a unified list
- View detailed information of each item
- Clear distinction between lost and found entries
- Responsive and user-friendly interface

---

## 🛠️ Tech Stack

**Frontend**
- HTML
- CSS
- JavaScript

**Backend**
- Node.js
- Express.js

**Database**
- MongoDB

**Deployment**
- Render

---

## 📂 Project Structure

lost-found/
│
├── public/
│ ├── styles.css # Main CSS file for styling
│ ├── images/ # Static images used in UI
│ └── uploads/ # Uploaded images for found/lost items
│
├── views/
│ ├── home.ejs # Homepage of the application
│ ├── add.ejs # Form to add lost/found item
│ ├── items.ejs # List of all lost & found items
│ └── detail.ejs # Detailed view of a single item
│
├── data/
│ └── items.json # Stores item data in JSON format
│
├── db.js # Database connection & configuration
├── database.db # Database file
├── app.js # Main Express server file
├── package.json # Project metadata & dependencies
├── package-lock.json # Dependency lock file
└── README.md # Project documentation


---

## 🧠 **Optional (sir ke liye extra strong)**
Agar thoda aur explanation chahiye **structure ke niche**, to ye bhi paste kar sakta hai 👇

```md
### 📌 Structure Explanation

- **public/**  
  Contains all static assets such as CSS files, images, and uploaded item photos.

- **views/**  
  Holds EJS templates used to render dynamic pages like home, item listing, and item details.

- **data/**  
  Used for temporary storage of lost and found item information.

- **db.js**  
  Manages database connection logic.

- **app.js**  
  Entry point of the application where routes, middleware, and server configuration are defined.
