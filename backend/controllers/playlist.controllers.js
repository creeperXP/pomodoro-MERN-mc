// //control each method: get, put, etc
import mongoose from "mongoose";
import Playlist from "../models/playlist.model.js";

export const getPlaylist = async (req, res) => {
	try {
		const playlists = await Playlist.find({});
		res.status(200).json({ success: true, data: playlists });
	} catch (error) {
		console.log("error in fetching Playlists:", error.message);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const createPlaylist = async (req, res) => {
    const playlist = req.body;

    // More descriptive validation
    const requiredFields = ['name', 'url', 'spotifyId'];
    const missingFields = requiredFields.filter(field => !playlist[field]);
    
    if (missingFields.length > 0) {
        return res.status(400).json({ 
            success: false, 
            message: `Missing required fields: ${missingFields.join(', ')}` 
        });
    }

    try {
        const newPlaylist = new Playlist(playlist);
        await newPlaylist.save();
        res.status(201).json({ success: true, data: newPlaylist });
    } catch (error) {
        // Handle duplicate key errors
        if (error.code === 11000) {
            return res.status(409).json({ 
                success: false, 
                message: "Playlist already exists" 
            });
        }
        console.error("Error in Create Playlist:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const updatePlaylist = async (req, res) => {
    const { id } = req.params;
    const playlist = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid Playlist Id" });
    }

    try {
        const updatedPlaylist = await Playlist.findByIdAndUpdate(id, playlist, { new: true });
        if (!updatedPlaylist) {
            return res.status(404).json({ success: false, message: "Playlist not found" });
        }
        res.status(200).json({ success: true, data: updatedPlaylist });
    } catch (error) {
        console.log("error in updating playlist:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const deletePlaylist = async (req, res) => {
	const { id } = req.params;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ success: false, message: "Invalid Playlist Id" });
	}

	try {
		await Playlist.findByIdAndDelete(id);
		res.status(200).json({ success: true, message: "Playlist deleted" });
	} catch (error) {
		console.log("error in deleting playlist:", error.message);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};
