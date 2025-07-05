import express from "express";

import { getPlaylist, createPlaylist, deletePlaylist, updatePlaylist} from "../controllers/playlist.controllers.js";

const router = express.Router();

router.get("/", getPlaylist);
router.post("/", createPlaylist);

// //console.log(process.env.MONGO_URL); //cannot access by default, must import

router.put("/:id", updatePlaylist);
router.delete("/:id", deletePlaylist);

export default router;
// //use async to allow waiting for database operations to finish
