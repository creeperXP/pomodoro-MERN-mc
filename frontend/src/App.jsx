import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Box } from "@chakra-ui/react"
import { Text } from "@chakra-ui/react"

import { Image, Flex } from "@chakra-ui/react"
import Timer from "./components/Timer.jsx"
//import background1 from './assets/mc-background-2.jpg';
import background1 from './assets/mc-background-2.jpg';
import creeperImg from './assets/creeperfaceremove.png';
import backgroundVideo from './assets/rainy-live-mc-background.mp4';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Box position="relative" minH="100vh" overflow="hidden"> {/* need this for no white screen */}
        <Box
          as="video"
          src={backgroundVideo}
          autoPlay
          loop
          muted
          position="fixed"
          top="0"
          left="0"
          width="100vw"
          height="100vh"
          objectFit="cover"
          zIndex="-1"
        />
              <Box position="absolute" top="7" left="20" p={4}> {/* absolute: nearest ancestor/viewport */}
                <Flex align="center" gap={2}> {/* div with css display: flex, arrange in row or col*/ /*center = align objects vertically even but horizontal placement*/}
                  <Text fontSize="xl" fontWeight="bold" color="white">
                    creeperXP
                  </Text>
                  <Image 
                    src={creeperImg} //where import
                    alt="creeperXP's face" //alternative text
                    boxSize="24px"  // controls width & height
                    objectFit="contain" //whole image fits inside box without crop (preserve aspect ratio)
                  />
                </Flex>
              </Box>

              <Timer />      {/* This renders above because it's after and has default zIndex */}

    </Box>
  )
}

export default App

{/*    <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
    */}

{/*    image bckgd
  <Box
              bgImage={`url(${background1})`} //expects css URL. 
              bgPosition="center"
              bgRepeat="no-repeat"
              bgSize="cover"
              minH="100vh"
              w="100vw"
            >*/
}