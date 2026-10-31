A multi-user blog built with Express, MongoDB (Mongoose) and Edge templates.
Users can register, log in and publish posts with a cover image.

Requires Node.js 18+ and a MongoDB database.

To run in development mode:
1. npm install
2. Start MongoDB, e.g. `docker run -d --name blog-mongo -p 27017:27017 mongo:8`
3. `cp .env.example .env` and adjust the values
   (Cloudinary is optional - without it, uploaded images are saved to public/posts)
4. npm run dev
5. Open http://localhost:4000 (or the PORT set in .env)
