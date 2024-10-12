'use client'

import { useAuthStore } from "../store/authStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { Button, Text, VStack, Box, Heading, useToast } from "@chakra-ui/react";
import Confetti from "react-confetti"; // Import the confetti package
import { useWindowSize } from "react-use"; // Optional: for responsive confetti size

export default function Home() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const toast = useToast();
  const { width, height } = useWindowSize(); // Get window size for confetti
  const [showConfetti, setShowConfetti] = useState<boolean>(true); // State to control confetti

  useEffect(() => {
    if (!user) {
      console.log("No user found, redirecting to login..."); // Check Zustand user state
      router.push("/login");
    } else {
      console.log("User found:", user); // Log current user data
      // Confetti animation runs for 5 seconds when the user logs in
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [user]);

  // Logout function
  const handleLogout = async () => {
    try {
      await signOut(auth);
      logout(); // Clear user state
      toast({
        title: "Logged out successfully",
        status: "success",
        duration: 10000,
        isClosable: true,
      });
      router.push("/login");
    } catch (error) {
      toast({
        title: "Logout failed",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (!user) return null; // Render nothing if no user

  return (
    <Box
      bgGradient="linear(to-r, teal.400, blue.500)"
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      position="relative"
    >
      {/* Confetti animation */}
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          numberOfPieces={1000} // Adjust this for more/less confetti
        />
      )}
      <Box
        maxWidth="400px"
        p={8}
        borderWidth={1}
        borderRadius="lg"
        boxShadow="2xl"
        bg="whiteAlpha.900"
        textAlign="center"
        zIndex={1} // Ensure the content is on top of the confetti
      >
        <VStack spacing={6}>
          <Heading size="lg" fontWeight="extrabold" color="blue.700">
            Welcome
          </Heading>
          <Text fontSize="lg" color="gray.600">
            Hello, {user?.email}
          </Text>
          <Button
            bg="blue.600"
            color="white"
            width="full"
            _hover={{ bg: "blue.700" }}
            _focus={{ boxShadow: "outline", borderColor: "blue.500" }}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </VStack>
      </Box>
    </Box>
  );
}
