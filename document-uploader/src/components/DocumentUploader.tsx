import React, { ChangeEvent, useState } from 'react';
import { storage, firestore } from '../firebase/config';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import {
  Button,
  LinearProgress,
  Typography,
  Box,
  Link,
  Paper,
  styled,
  IconButton,
} from '@mui/material';
import { v4 as uuidv4 } from 'uuid'; // Import uuid function
import CloudUploadIcon from '@mui/icons-material/CloudUpload'; // Icon for upload

// Styled components for enhanced design
const GradientBackground = styled('div')({
  background: 'linear-gradient(135deg, #f0f4ff, #dde7f9)', // Softer gradient background
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const UploadBox = styled(Paper)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '40px',
  width: '400px', // Fixed width
  height: '500px', // Fixed height
  borderRadius: '20px',
  boxShadow: '0px 15px 25px rgba(0, 0, 0, 0.1)', // Softer, larger shadow for depth
  backgroundColor: '#fff',
  textAlign: 'center',
});

const LinkUpload = styled(Link)({
  marginTop: '20px',
  fontSize: '16px',
  color: '#6C63FF',
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
});

const StyledButton = styled(Button)({
  backgroundColor: '#6C63FF',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#5750d6',
  },
  marginTop: '20px',
});

// DocumentUploader component
const DocumentUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  console.log('Firestore instance:', firestore);
  console.log('Storage instance:', storage);

  // Handle file selection with validation
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const fileType = selectedFile.type;
    const fileSize = selectedFile.size;

    // Validate file type (PDF or text)
    if (fileType !== 'application/pdf' && fileType !== 'text/plain') {
      setError('Only PDF or text files are allowed.');
      setFile(null);
      return;
    }

    // Validate file size (max 5MB)
    if (fileSize > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB.');
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setError('');
  };

  // Handle file upload to Firebase
  const handleUpload = () => {
    if (!file) {
      setError('Please select a valid file.');
      return;
    }

    const uniqueFileName = `${uuidv4()}_${file.name}`;
    const storageRef = ref(storage, `documents/${uniqueFileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      // Display progress of the upload
      'state_changed',
      (snapshot) => {
        const uploadProgress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(uploadProgress); // Update progress bar
      },
      (error) => {
        setError('File upload failed. Please try again.');
        console.error('Upload error:', error);
      },
      // Once the upload is complete, get the download URL and save it to Firestore
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log('Download URL obtained:', downloadURL);
      
          if (!firestore) {
            throw new Error('Firestore is not initialized');
          } else {
            console.log('Firestore is initialized');
          }
      
          const docRef = await addDoc(collection(firestore, 'documents'), {
            name: file.name,
            url: downloadURL,
            createdAt: new Date(),
          });
          console.log('Document written with ID: ', docRef.id);
          
          setSuccess(true);
          setProgress(0);
          setFile(null);
        } catch (error) {
          setError('Failed to save file URL in Firestore.');
          console.error('Firestore error:', error);
          if (error instanceof Error) {
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
          }
        }
      }
    );
  };

  return (
    // Styled component for the background with MUI
    <GradientBackground>
      <UploadBox>
        <CloudUploadIcon sx={{ fontSize: 60, color: '#6C63FF' }} />
        <Typography variant="h5" gutterBottom>
          Upload Your File
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Supports PDF and text files (Max size: 5MB)
        </Typography>

        <Button variant="outlined" component="label" sx={{ mt: 2 }}>
          Browse Files
          <input type="file" hidden onChange={handleFileChange} />
        </Button>

        {error && <Typography color="error" mt={2}>{error}</Typography>}

        {file && (
          <>
            <Typography mt={2}>{file.name}</Typography>
            <StyledButton variant="contained" onClick={handleUpload} sx={{ mt: 2 }}>
              Upload
            </StyledButton>
            {progress > 0 && (
              <Box mt={2} width="100%">
                <LinearProgress variant="determinate" value={progress} />
                <Typography variant="body2" mt={1}>
                  {Math.round(progress)}% uploaded
                </Typography>
              </Box>
            )}
          </>
        )}

        {success && (
          <Typography color="primary" mt={2}>
            File uploaded successfully!
          </Typography>
        )}
      </UploadBox>
    </GradientBackground>
  );
};

export default DocumentUploader;
