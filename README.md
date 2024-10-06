# Blog App Mern
![Blog App Mern](https://res.cloudinary.com/dhd52zju0/image/upload/v1728200431/Screenshot_2024-10-06_124009_bew0rr.png)

## Technologies Used
- **Frontend:** React, Redux, Tailwindcss, PrimeReact
- **Backend:** Node.js, Express
- **Database:** MongoDB

This is a full-stack blog application built using the **MERN** stack (MongoDB, Express, React, Node.js). It allows users to create, manage, and interact with blog posts while providing robust user authentication and authorization.

## Features
- **User Authentication & Authorization:**
  - User registration
  - Secure login and logout
  - Email verification
  - Password reset and update
  - Role-based access control (Admin, Creator, User)

- **User Management:**
  - User profile update and retrieval
  - User account deactivation
  - Creator role request

- **Blog Management:**
  - Blog creation, retrieval (single and multiple), update, and deletion
  - Blog filtering and sorting
  - Blog Like, Dislike, View, Comment

- **Comment System:**
  - Comment creation, retrieval, update, and deletion
  - Comment liking and replying to comments

- **File Handling:**
  - Image upload (for user avatars and blog cover images)
  - File deletion from Cloudinary

- **Email Services:**
  - Sending verification, password reset, and role request emails
  - Creator request approval and rejection email

- **Admin Functions:**
  - Handling role requests and user management

- **Responsive UI:** 
  - Intuitive and adaptable user interface for various devices

- **Weekly Improvements:** 
  - The project is continuously being updated with new features and bug fixes, including enhanced reporting and optimized performance.


## Getting Started


### Prerequisites

Make sure you have the following installed on your machine:

- **Node.js** 
- **MongoDB** (you can use a local installation or MongoDB Atlas)
- **Git** (for cloning the repository)

 -**Installation:**
To get a local copy up and running, follow these simple steps:

1. **Clone the repo:**
   ```bash
   git clone https://github.com/mohdsaadshaikh/blog-app-mern.git

2. **Navigate to the project directories:** make sure open two terminals

   ```bash
   cd client
   cd server
   ```

3. **Install dependencies:**

   ```bash
   npm install
   ```

4. **Set up environment variables:**

   - Create a `.env` file in both the `/client` and `/server` directories and add these with the variables as shown below.
   - Want env file? contact me on [Muhammad Saad Shaikh](mailto:mohammadsaad925s4s@gmail.com). or whatsapp [Message me on WhatsApp](https://wa.me/923192340879)
     
    **Client**

      ```plaintext
      VITE_SERVER_URL=your_server_url
      ```

    **Server**

      ```plaintext
      PORT=your_port_value
      NODE_ENV=production
      MONGODB_URI=your-mongodb-uri
      JWT_SECRET=your-jwt-secret
      JWT_EXPIRES_IN=30d
      JWT_COOKIE_EXPIRES_IN=90
      EMAIL_FROM=your-email@example.com
      BREVO_HOST=your-smtp-host
      BREVO_PORT=your-smtp-port
      BREVO_USER=your-smtp-user
      BREVO_PASS=your-smtp-password
      CLOUDINARY_NAME=your-cloudinary-name
      CLOUDINARY_APIKEY=your-cloudinary-apikey 
      CLOUDINARY_SECRET=your-cloudinary-secret
      ```

5. **Run the application:**

   **Client**
   ```bash
   npm run dev
   ```
   **Server**
   ```bash
   npm start
   ```

 **Usage**
- Register or log in to start using blog.

 **Contributing**
 
  Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.
