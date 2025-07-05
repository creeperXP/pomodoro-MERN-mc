import React, { useState } from 'react';

// Modal components
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/modal';

// Input + FormControl components (from sub-packages)
import {
  FormControl,
  FormLabel,
} from '@chakra-ui/form-control';

import {
  NumberInput,
  NumberInputField,
} from '@chakra-ui/number-input';

import {
  Input,
} from '@chakra-ui/react';

// Only get Button from chakra/react
import { Button, VStack, HStack, Box, Text, IconButton, useToast } from '@chakra-ui/react';

import { Select } from '@chakra-ui/react'; //for dropdown menu
import { 
  Menu, 
  MenuButton, 
  MenuList, 
  MenuItem, 
  MenuDivider 
} from '@chakra-ui/react'; //more accessible 

import { FiTrash2, FiPlus } from 'react-icons/fi';

import {usePlaylists} from '../playlist_js/playlist.js'; //for playlist state

const SettingsPopup = ({ 
  isOpen, 
  onClose, 
  modes, 
  updateModes, 
  selectedPlaylistId, 
  updateSelectedPlaylist 
}) => {
  const toast = useToast();

  // Get Zustand store functions and state
  const { 
    playlists, 
    createPlaylists, 
    deletePlaylists 
  } = usePlaylists();

  // Local state for the form inputs
  const [pomodoroMinutes, setPomodoroMinutes] = useState(modes.pomodoro / 60);
  const [shortBreakMinutes, setShortBreakMinutes] = useState(modes.short / 60);
  const [longBreakMinutes, setLongBreakMinutes] = useState(modes.long / 60);

  // Local playlist state for adding new playlists
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistUrl, setNewPlaylistUrl] = useState('');

  // Update local state when modal opens with current values
  React.useEffect(() => {
    if (isOpen) {
      setPomodoroMinutes(modes.pomodoro / 60);
      setShortBreakMinutes(modes.short / 60);
      setLongBreakMinutes(modes.long / 60);
    }
  }, [isOpen, modes]);

  const handleSave = () => {
    // Convert minutes to seconds and update the modes
    const newModes = {
      pomodoro: pomodoroMinutes * 60,
      short: shortBreakMinutes * 60,
      long: longBreakMinutes * 60,
    };
    updateModes(newModes);
    onClose();
  };

  // Extract Spotify playlist ID from URL
  const extractSpotifyId = (url) => {
    const match = url.match(/playlist\/([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
  };

  const handleAddPlaylist = async () => {
    if (newPlaylistName.trim() && newPlaylistUrl.trim()) {
      const spotifyId = extractSpotifyId(newPlaylistUrl);
      if (spotifyId) {
        const newPlaylist = {
          name: newPlaylistName.trim(),
          url: newPlaylistUrl.trim(),
          spotifyId: spotifyId,
        };
        
        const result = await createPlaylists(newPlaylist);
        if (result.success) {
          // Reset form inputs
          setNewPlaylistName('');
          setNewPlaylistUrl('');
          
          // Show success notification
          toast({
            title: "Success",
            description: "Playlist added successfully!",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        } else {
          toast({
            title: "Error",
            description: result.message || 'Failed to add playlist',
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      } else {
        toast({
          title: "Invalid URL",
          description: "Please enter a valid Spotify playlist URL",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: "Missing Information",
        description: "Please fill in both playlist name and URL",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeletePlaylist = async (playlistId) => {
    const result = await deletePlaylists(playlistId);
    if (result.success) {
      // If the deleted playlist was selected, reset to first playlist or empty
      if (selectedPlaylistId === playlistId) {
        const remainingPlaylists = playlists.filter(p => p._id !== playlistId);
        const newSelectedId = remainingPlaylists.length > 0 ? remainingPlaylists[0]._id : '';
        updateSelectedPlaylist(newSelectedId);
      }
      
      toast({
        title: "Success",
        description: "Playlist deleted successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Error",
        description: result.message || 'Failed to delete playlist',
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handlePlaylistChange = (playlistId) => {
    updateSelectedPlaylist(playlistId);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Settings</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={6} align="stretch">
            {/* Timer Settings */}
            <Box>
              <Text fontSize="lg" fontWeight="bold" mb={4}>Timer Settings</Text>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Pomodoro Duration (minutes)</FormLabel>
                  <NumberInput 
                    min={1} 
                    value={pomodoroMinutes}
                    onChange={(value) => setPomodoroMinutes(Number(value))}
                  >
                    <NumberInputField />
                  </NumberInput>
                </FormControl>
                <FormControl>
                  <FormLabel>Short Break (minutes)</FormLabel>
                  <NumberInput 
                    min={1} 
                    value={shortBreakMinutes}
                    onChange={(value) => setShortBreakMinutes(Number(value))}
                  >
                    <NumberInputField />
                  </NumberInput>
                </FormControl>
                <FormControl>
                  <FormLabel>Long Break (minutes)</FormLabel>
                  <NumberInput 
                    min={1} 
                    value={longBreakMinutes}
                    onChange={(value) => setLongBreakMinutes(Number(value))}
                  >
                    <NumberInputField />
                  </NumberInput>
                </FormControl>
              </VStack>
            </Box>

            {/* Playlist Settings */}
            <Box>
              <Text fontSize="lg" fontWeight="bold" mb={4}>Playlist Settings</Text>
              <VStack spacing={4}>
                {/* Current Playlist Selection */}
                <FormControl>
                  <FormLabel>Select Active Playlist</FormLabel>
                  <Select 
                    value={selectedPlaylistId} 
                    onChange={(e) => handlePlaylistChange(e.target.value)}
                    placeholder="Choose a playlist"
                  >
                    {playlists.map(playlist => (
                      <option key={playlist._id} value={playlist._id}>
                        {playlist.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                {/* Playlist List */}
                {playlists.length > 0 && (
                  <Box w="100%">
                    <Text fontSize="md" fontWeight="semibold" mb={2}>Your Playlists</Text>
                    <VStack spacing={2}>
                      {playlists.map(playlist => (
                        <HStack key={playlist._id} w="100%" justify="space-between" p={2} borderWidth={1} borderRadius="md">
                          <Text>{playlist.name}</Text>
                          <IconButton
                            icon={<FiTrash2 />}
                            size="sm"
                            colorScheme="red"
                            variant="ghost"
                            onClick={() => handleDeletePlaylist(playlist._id)}
                            aria-label="Delete playlist"
                          />
                        </HStack>
                      ))}
                    </VStack>
                  </Box>
                )}

                {/* Add New Playlist */}
                <Box w="100%">
                  <Text fontSize="md" fontWeight="semibold" mb={2}>Add New Playlist</Text>
                  <VStack spacing={3}>
                    <FormControl>
                      <FormLabel>Playlist Name</FormLabel>
                      <Input
                        value={newPlaylistName}
                        onChange={(e) => setNewPlaylistName(e.target.value)}
                        placeholder="e.g., Study Beats"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Spotify Playlist URL</FormLabel>
                      <Input
                        value={newPlaylistUrl}
                        onChange={(e) => setNewPlaylistUrl(e.target.value)}
                        placeholder="https://open.spotify.com/playlist/..."
                      />
                    </FormControl>
                    <Button
                      leftIcon={<FiPlus />}
                      colorScheme="green"
                      onClick={handleAddPlaylist}
                      isDisabled={!newPlaylistName.trim() || !newPlaylistUrl.trim()}
                    >
                      Add Playlist
                    </Button>
                  </VStack>
                </Box>
              </VStack>
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSave}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SettingsPopup;