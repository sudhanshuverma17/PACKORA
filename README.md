# PACKORA 

PACKORA is a full-stack e-commerce web application built using Node.js, Express.js, MongoDB, EJS, and Tailwind CSS. It provides a modern shopping experience with secure authentication, cart management, payment integration, and an admin dashboard for managing products.

---

##  Live Features

###  User Features

* User Registration & Login
* Secure Session-based Authentication
* Forgot Password via Email Reset Link
* Browse Products
* Filter & Sort Products
* Add to Cart / Remove from Cart
* Update Product Quantity
* Razorpay Payment Integration
* Order Placement & Order History
* Responsive Mobile-Friendly UI

###  Admin Features

* Add New Products
* Upload Product Images
* Edit Product Details
* Delete Products
* Manage Product Listing

---

##  Tech Stack

### Frontend

* EJS
* Tailwind CSS
* JavaScript

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas
* Mongoose

### Integrations

* Razorpay Payment Gateway
* Nodemailer (Password Reset Emails)

---

##  Folder Structure

```txt id="xvxj1z"
PACKORA/
│── config/
│── controllers/
│── middlewares/
│── models/
│── public/
│── routes/
│── views/
│── .env
│── app.js
│── package.json
```

---

##  Environment Variables

Create a `.env` file in root folder:

```env id="4l8rql"
PORT=3000
NODE_ENV=development

MONGO_URI=your_mongodb_connection_string

EXPRESS_SESSION_SECRET=your_secret_key

RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

BASE_URL=http://localhost:3000
```

---

##  Run Locally

```bash id="x8vk9n"
git clone https://github.com/yourusername/packora.git
cd packora
npm install
npm start
```

Visit:

```txt id="8xg7yq"
http://localhost:3000
```

---

 

##  Security Features

* Secure Sessions
* Password Hashing using bcrypt
* Protected Routes
* Payment Verification
* Rate Limiting Ready
* Helmet Security Headers Ready

---

##  Future Enhancements

* Product Search
* Wishlist
* Order Tracking
* Admin Analytics Dashboard
* Product Reviews & Ratings
* Coupon System

---

##  Author

Sudhanshu Verma

---

##  If You Like This Project

Give this repository a star on GitHub!
