import express from "express";
import dotenv from "dotenv";
import path from "path"; //to connect back/front under same domain (node module)

import { connectDB } from "./config/db.js";

import playlistRoutes from "./routes/playlist.routes.js";

dotenv.config();

const app = express(); //with listen
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve(); //absolute path of cur working dir

app.use(express.json()); // allows us to accept JSON data in the req.body


// Add this after your middleware setup

app.use("/api/playlists", playlistRoutes);


if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));
	// Make the catch-all route more specific - only catch non-API routes
	
    app.get("*", (req, res) => {
        // Don't serve index.html for API routes
        if (req.url.startsWith('/api/')) {
            return res.status(404).json({ error: 'API endpoint not found' });
        }
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    });
}

app.listen(PORT, () => {
	connectDB(); //add this from config
	console.log("Server started at http://localhost:" + PORT);
});

//Static assets are files that don’t change per request and can be served "as-is" by the backend: make frontend folder static

