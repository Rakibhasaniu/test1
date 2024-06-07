# Flat Finder 
## Server

### Server Side Url: https://flatfinder-chi.vercel.app/api

- ### Application Summary
- ##### Flat Finder server built with Node.js Express application with TypeScript as the programming language and PostgreSQL with Prisma. It utilizes PostgreSQL through Prisma for data storage. use incorporates JSON web token for user authentication.
  
##### Technology Used: ```Node, Express, TypeScript, Prisma, PostgreSQL, ```


- Anyone can Register on this application.
- Anyone can view all the information.
- User can add a flat.
- User can Edit and Update a flat.
- User can do a Flat Share Request.
- User can Update and edit his flat.
- User can get his profile information.
- User can Update his profile.

- ### Local Setup Instructions
- Clone the repository
  `https://github.com/jubayer44/flat-finder-server.git`
- Navigate to the project directory
  `cd your-folder`
- Install dependencies
  `npm install`
- Create a`.env` file in the root of the project and set the following environment variables

```
NODE_ENV="Development"
PORT = 5000
DATABASE_URL = your postgres_url
JWT_SECRET= your secret
EXPIRES_IN = 30m
REFRESH_TOKEN_SECRET = your refresh secret
REFRESH_TOKEN_EXPIRES_IN = 30d
```

##### Running the application

- Development Mode
  `npm run dev`
- Production Mode

```
npm run build
npm start
```


#### **Models**

This Application has 3 models.

1. User Model
2. Flat Model
3. Flat Share Model

### **1. User Model:**

- **Fields:**
    - **id (String):** A distinctive identifier for each user.
    - **username (String):** username of the user.
    - **email (String):** The email address of the user.
    - **password (String):** The hashed password of the user.
    - **status (String):** The status of the user.
    - **createdAt (DateTime):** The timestamp indicates when the user was created.
    - **updatedAt (DateTime):** The timestamp indicates when the user was last updated.

### **2. Flat Model:**

- **Fields:**
    - **id (String):** A distinctive identifier for each flat.
    - **bedrooms(Integer):** Number of bedrooms (e.g. 1/2/3/4/5/6).
    - **location (String):** The location where the flat is currently located (e.g. holding number, street, area, city).
    - **description (String):** A description of the flat (e.g. Master bed room size(square feet), others room size(square feet), open space, veranda, terrace space etc. ).
    - **rentAmount (Integer):** Rent Amount.
    - **advanceAmount (Integer):** Advance amount.
    - **postBy (String):** User id.
    - **createdAt (DateTime):** The timestamp indicates when flat was created.
    - **updatedAt (DateTime):** The timestamp indicates when the flat was last updated.

  ### **3. Flat Share Request Model:**

- **Fields:**
    - **id (String):** A distinctive identifier for each user profile.
    - **userId (String):** A reference to the user associated with the user.
    - **flatId (String):** A reference to the user associated with the flat.
    - **status (String):** Request Status.
    - **space (Int):** Total space for sharing.
    - **message (String):** A brief bio or message of the user.
    - **createdAt (DateTime):** The timestamp indicates when the user profile was created.
    - **updatedAt (DateTime):** The timestamp indicates when the user profile was last updated.



## Thank You
