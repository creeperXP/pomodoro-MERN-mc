import { create } from "zustand";

export const usePlaylists = create((set) => ({
	playlists: [],
	setPlaylists: (playlists) => set({ playlists }),

	createPlaylists: async (newPlaylist) => {
		if (!newPlaylist.name || !newPlaylist.url || !newPlaylist.spotifyId) {
			return { success: false, message: "Please fill in all fields." };
		}
		
		try {
			const res = await fetch("/api/playlists", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(newPlaylist),
			});
			
			const data = await res.json();
			
			// Check if the API call was successful
			if (!res.ok || !data.success) {
				return { success: false, message: data.message || "Failed to create playlist" };
			}
			
			// Update the state with the new playlist
			set((state) => ({ playlists: [...state.playlists, data.data] }));
			return { success: true, message: "Playlist created successfully" };
			
		} catch (error) {
			console.error("Error creating playlist:", error);
			return { success: false, message: "Network error. Please try again." };
		}
	},

	getPlaylists: async () => {
		try {
			const res = await fetch("/api/playlists");
			const data = await res.json();
			set({ playlists: data.data || [] });
		} catch (error) {
			console.error("Error fetching playlists:", error);
			set({ playlists: [] });
		}
	},

	deletePlaylists: async (pid) => {
		try {
			const res = await fetch(`/api/playlists/${pid}`, {
				method: "DELETE",
			});
			const data = await res.json();
			
			if (!data.success) return { success: false, message: data.message };

			// update the ui immediately, without needing a refresh
			set((state) => ({ playlists: state.playlists.filter((playlist) => playlist._id !== pid) }));
			return { success: true, message: data.message };
			
		} catch (error) {
			console.error("Error deleting playlist:", error);
			return { success: false, message: "Network error. Please try again." };
		}
	},

	updatePlaylists: async (pid, updatedPlaylist) => {
		try {
			const res = await fetch(`/api/playlists/${pid}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(updatedPlaylist),
			});
			const data = await res.json();
			
			if (!data.success) return { success: false, message: data.message };

			// update the ui immediately, without needing a refresh
			set((state) => ({
				playlists: state.playlists.map((playlist) => (playlist._id === pid ? data.data : playlist)),
			}));

			return { success: true, message: data.message };
			
		} catch (error) {
			console.error("Error updating playlist:", error);
			return { success: false, message: "Network error. Please try again." };
		}
	},
}));