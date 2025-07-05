import React from 'react'
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  HStack,
  VStack,
  Text,
  IconButton,
} from "@chakra-ui/react";
import Repeat from '../assets/repeat-icon.png'
import Settings from '../assets/settings-icon.png'
import { Image } from "@chakra-ui/react"; //wrap image with this component
import { FiRepeat, FiSettings } from "react-icons/fi";
import { useDisclosure } from '@chakra-ui/react';

import SettingsPopup from "./Settings.jsx";
import { usePlaylists } from '../playlist_js/playlist.js'; //for playlist state

const Timer = () => {
    // Get Zustand store functions and state
    const { playlists, getPlaylists } = usePlaylists();

    // Make MODES dynamic with state
    const [modes, setModes] = useState({
        pomodoro: 25 * 60,
        short: 5 * 60,
        long: 15 * 60,
    });

    const [mode, setMode] = useState("pomodoro");
    const [timeLeft, setTimeLeft] = useState(modes[mode]);
    const [isRunning, setIsRunning] = useState(false);
    
    const [selectedPlaylistId, setSelectedPlaylistId] = useState('');

    const { isOpen, onOpen, onClose } = useDisclosure();

    // Load playlists on component mount
    useEffect(() => {
        getPlaylists();
    }, [getPlaylists]);

    // Set default selected playlist when playlists load
    useEffect(() => {
        if (playlists.length > 0 && !selectedPlaylistId) {
            setSelectedPlaylistId(playlists[0]._id);
        }
    }, [playlists, selectedPlaylistId]);

    // Function to update the modes from settings
    const updateModes = (newModes) => {
        setModes(newModes);
    };

    // Function to update selected playlist
    const updateSelectedPlaylist = (playlistId) => {
        setSelectedPlaylistId(playlistId);
    };

    // Get current playlist
    const currentPlaylist = playlists.find(p => p._id === selectedPlaylistId);

    useEffect(() => {
        setTimeLeft(modes[mode]); //set new timer and stop it
        setIsRunning(false);
    }, [mode, modes]); // Add modes to dependency array

    useEffect(() => { //if timer running, count down by 1 second every second
        if (!isRunning) return;
        const interval = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, [isRunning]);

    const formatTime = (s) =>
        `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

    return (
        <VStack spacing={8} justify="center" minH="100vh" color="white" pb="152px">
            <HStack spacing={4}>
                {/* Use modes state instead of MODES constant */}
                {Object.keys(modes).map((key) => ( 
                    <Button
                        key={key}
                        variant={mode === key ? "solid" : "outline"}
                        colorScheme={mode === key ? undefined : "whiteAlpha"}
                        borderColor="white"
                        color={mode === key ? "black" : "white"}
                        bg={mode === key ? "white" : "transparent"}
                        _hover={{ bg: "white", color: "black" }}
                        _active={{ bg: "white", color: "black" }}
                        borderRadius="full"
                        onClick={() => setMode(key)}
                    >
                        {key === "pomodoro" ? "pomodoro" : `${key} break`}
                    </Button>
                    ))}

            </HStack>

            <Text fontSize="6xl" fontWeight="bold">
                {formatTime(timeLeft)}
            </Text>

            <HStack spacing={4}>
                <Button 
                        onClick={() => setIsRunning(!isRunning)}
                        variant="outline"
                        borderColor="white"
                        color="white"
                        _hover={{ bg: 'white', color: 'black' }}
                        _active={{ bg: 'white', color: 'black' }}
                        borderRadius="full"
                    >
                    {isRunning ? "pause" : "start"}
                </Button>
        
                <Box
                    onClick={() => setTimeLeft(modes[mode])} // Use modes state
                    cursor="pointer"
                    color="white"
                    fontSize="24px"
                    role="button"
                    aria-label="reset"
                    _hover={{ color: "black", bg: "white", borderRadius: "full", p: 1 }}
                >
                    <FiRepeat />
                </Box>

                <Box
                    onClick={onOpen}
                    cursor="pointer"
                    color="white"
                    fontSize="24px"
                    role="button"
                    aria-label="settings"
                    _hover={{ color: "black", bg: "white", borderRadius: "full", p: 1 }}
                >
                    <FiSettings />
                </Box>

            </HStack>

            <SettingsPopup 
                isOpen={isOpen} 
                onClose={onClose} 
                modes={modes} 
                updateModes={updateModes}
                selectedPlaylistId={selectedPlaylistId}
                updateSelectedPlaylist={updateSelectedPlaylist}
            />

            {/* Spotify Widget - Responsive with Dynamic Playlist */}
            <Box
                position={{ base: "static", lg: "fixed" }}
                bottom={{ base: "auto", lg: "200" }}
                left={{ base: "auto", lg: "200" }}
                height="50"
                mt={{ base: 8, lg: 0 }} //increase lg to move it down
                width={{ base: "100%", lg: "auto" }}
                maxW={{ base: "400px", lg: "none" }}
                mx={{ base: "auto", lg: "initial" }}
                opacity={0.5}
            >
                {currentPlaylist ? (
                    <iframe
                        src={`https://open.spotify.com/embed/playlist/${currentPlaylist.spotifyId}?utm_source=generator`}
                        width="100%"
                        height="152"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                        title={`Spotify Playlist - ${currentPlaylist.name}`}
                    />
                ) : (
                    <Box 
                        width="100%" 
                        height="152" 
                        bg="gray.800" 
                        display="flex" 
                        alignItems="center" 
                        justifyContent="center"
                        borderRadius="md"
                    >
                        <Text color="white" opacity={0.7}>No playlist selected</Text>
                    </Box>
                )}
            </Box>
        </VStack>
        
    );
}

export default Timer