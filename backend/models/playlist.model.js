import mongoose from "mongoose";

//blueprint for playlist
/*
types: 
    name: 'Lo-fi Study',
    url: 'https://open.spotify.com/playlist/37i9dQZF1DX9sIqqvKsjG8',
    spotifyId: '37i9dQZF1DX9sIqqvKsjG8'
*/
const playlistSchema = new mongoose.Schema({
    // Use MongoDB's _id instead of custom id field
    // Remove the custom id field unless you specifically need it
    name: {
        type: String,
        required: true,
        trim: true, // Remove whitespace
        maxlength: 200 // Reasonable limit
    },
    url: {
    type: String,
    required: true,
    validate: {
        validator: function(v) {
        return /^https:\/\/open\.spotify\.com\/embed\/playlist\/[a-zA-Z0-9]+(\?.+)?$/.test(v);
        },
        message: 'Please enter a valid Spotify embed playlist URL'
    }
    },
    spotifyId: {
        type: String,
        required: true,
        unique: true, // Prevent duplicate playlists
        trim: true
    }
}, {
    timestamps: true
});


const Playlist = mongoose.model("Playlist", playlistSchema);
//mongoose maps this to playlist collection in MongoDB

export default Playlist;//allow import Product model in other files


//qY4M29U0cQZqdhPF