"use client";

import { useState, FormEvent, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/authStore"; // Zustand store for authentication
import { auth } from "../firebase/config";
import {
  Button,
  Input,
  VStack,
  Box,
  Heading,
  Text,
  useToast,
  InputGroup,
  InputLeftElement,
  Link,
} from "@chakra-ui/react";
import { EmailIcon, LockIcon } from "@chakra-ui/icons";
import NextLink from 'next/link'; // Import Next.js Link component

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const toast = useToast();

  // Set mounted state to handle hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Login function
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      console.log("User after login:", userCredential.user); // Log user data to check Zustand store

      // Toast notification
      toast({
        title: "Login successful",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      router.push("/home");
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Render the login form
  return (
    <Box
      bgGradient="linear(to-r, blue.500, teal.400)"
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      {/* Render the form only after the component has mounted */}
      {isMounted && ( // Only render the form after component has mounted
        <Box
          maxWidth="400px"
          p={8}
          borderWidth={1}
          borderRadius="lg"
          boxShadow="2xl"
          bg="whiteAlpha.900"
        >
          <VStack spacing={6} align="stretch">
            <Heading size="lg" textAlign="center" fontWeight="extrabold" color="blue.700">
              Login to Your Account
            </Heading>
            <Text textAlign="center" color="gray.600" fontSize="md">
              Enter your credentials below
            </Text>
            <form onSubmit={handleLogin}>
              {/* Form fields */}
              <VStack spacing={4}>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <EmailIcon color="gray.300" />
                  </InputLeftElement>
                  <Input
                    placeholder="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    focusBorderColor="blue.500"
                    _hover={{ borderColor: "blue.300" }}
                  />
                </InputGroup>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <LockIcon color="gray.300" />
                  </InputLeftElement>
                  <Input
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    focusBorderColor="blue.500"
                    _hover={{ borderColor: "blue.300" }}
                  />
                </InputGroup>
                {/* Forgot password link */}
                <Text textAlign="right" width="full" color="blue.600" fontSize="sm" cursor="pointer">
                  Forgot Password?
                </Text>
                <Button
                  type="submit"
                  bg="blue.600"
                  color="white"
                  width="full"
                  _hover={{ bg: "blue.700" }}
                  _focus={{ boxShadow: "outline", borderColor: "blue.500" }}
                  isLoading={loading}
                  loadingText="Logging in"
                >
                  Login
                </Button>
              </VStack>
            </form>
            
            {/* Add this section for users who haven't signed up */}
            <Text textAlign="center" color="gray.500">
              Don't have an account?{" "}
              <NextLink href="/signup" passHref>
                <Link color="blue.600" fontWeight="bold" _hover={{ color: "blue.800" }}>
                  Sign Up
                </Link>
              </NextLink>
            </Text>
          </VStack>
        </Box>
      )}
    </Box>
  );
}
