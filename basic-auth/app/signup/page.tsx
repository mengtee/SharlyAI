'use client'

import { useState, FormEvent, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/authStore";
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
  Link
} from "@chakra-ui/react";
import { EmailIcon, LockIcon } from "@chakra-ui/icons";
import NextLink from 'next/link'; // For linking to the login page

// Signup page component
export default function SignUp() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const toast = useToast();

  // Set mounted state
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Signup function
  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user); // Save user to global state
      toast({
        title: "Sign up successful",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      router.push("/"); // Redirect to home page after signup
    } catch (error: any) {
      console.error("Sign up error:", error); // Log the error details
      let errorMessage = "An error occurred during sign up.";
      if (error.code === 'auth/weak-password') {
        errorMessage = "The password is too weak.";
      } else if (error.code === 'auth/email-already-in-use') {
        errorMessage = "This email is already in use.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "The email address is not valid.";
      }
      
      // Toast notification
      toast({
        title: "Sign up failed",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Render the signup form
  return (
    <Box
      bgGradient="linear(to-r, teal.400, blue.500)"
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      {isMounted && (
        <Box
          maxWidth="400px"
          p={8}
          borderWidth={1}
          borderRadius="lg"
          boxShadow="2xl"
          bg="whiteAlpha.900"
        >
          {/* Form fields */}
          <VStack spacing={6} align="stretch">
            <Heading size="lg" textAlign="center" fontWeight="extrabold" color="blue.700">
              Sign Up
            </Heading>
            <Text textAlign="center" color="gray.600" fontSize="md">
              Create an account to get started
            </Text>
            <form onSubmit={handleSignUp}>
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
                <Button
                  type="submit"
                  bg="blue.600"
                  color="white"
                  width="full"
                  _hover={{ bg: "blue.700" }}
                  _focus={{ boxShadow: "outline", borderColor: "blue.500" }}
                  isLoading={loading}
                  loadingText="Signing up"
                >
                  Sign Up
                </Button>
              </VStack>
            </form>

            {/* Add this section for users who already have an account */}
            <Text textAlign="center" color="gray.500">
              Already have an account?{" "}
              <NextLink href="/login" passHref>
                <Link color="blue.600" fontWeight="bold" _hover={{ color: "blue.800" }}>
                  Login
                </Link>
              </NextLink>
            </Text>
          </VStack>
        </Box>
      )}
    </Box>
  );
}
