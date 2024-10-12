import React from 'react';
import { useDocuments } from '../hooks/useDocuments'; // Import the custom hook
import { Button, Card, CardContent, CardActions, Typography, Grid, Box, CircularProgress, Paper, styled } from '@mui/material';

// Styled components for enhanced design, matching the DocumentUploader
const GradientBackground = styled('div')({
  background: 'linear-gradient(135deg, #f0f4ff, #dde7f9)', // Softer gradient background
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
});

const DashboardBox = styled(Paper)({
  padding: '40px',
  width: '100%',
  maxWidth: '1200px',
  borderRadius: '20px',
  boxShadow: '0px 15px 25px rgba(0, 0, 0, 0.1)', // Softer, larger shadow for depth
  backgroundColor: '#fff',
  textAlign: 'center',
});

const StyledButton = styled(Button)({
  backgroundColor: '#6C63FF',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#5750d6',
  },
  marginTop: '20px',
});

// Define a fixed width and height for each card to ensure alignment
const DocumentCard = styled(Card)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '150px', // Fixed height for all cards
  width: '100%', // Ensure width consistency in Grid
  maxWidth: '600px', // Max width to avoid oversized cards
  margin: '0 auto', // Centering the card horizontally
  padding: '10px',
  boxSizing: 'border-box',
});

const TruncatedText = styled(Typography)({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis', // Truncate text with ellipsis
  maxWidth: '100%', // Make sure text does not overflow horizontally
});


const Dashboard: React.FC = () => {
  const { documents, loading, goToNextPage, goToPreviousPage, hasMore, currentPage } = useDocuments();

  const handleViewDocument = (url: string) => {
    window.open(url, '_blank');
  };

  const handleRefresh = () => {
    window.location.reload(); // Temporary solution for refreshing
  };

  const handleDownloadDocument = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = ''; // Optional: specify a filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  // Render the Dashboard component
  return (
    // Styled component for the background with MUI
    <GradientBackground>
      <DashboardBox>
        <Box sx={{ textAlign: 'center', mb: 4, mt: 5 }}>
          <Typography variant="h4" gutterBottom>
            Document Dashboard
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Manage your documents stored in Firebase (Real-time updates)
          </Typography>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="200px">
            <CircularProgress />
          </Box>
        ) : (
          // Display the documents in a grid
          <Grid container spacing={4}>
            {documents.length === 0 ? (
              <Grid item xs={12}>
                <Typography>No documents found.</Typography>
              </Grid>
            ) : ( // Display the documents in cards
              documents.map((doc) => (
                <Grid item xs={12} sm={6} md={4} key={doc.id}>
                  <DocumentCard elevation={3}>
                    <CardContent>
                      <TruncatedText variant="h6">
                        {doc.name}
                      </TruncatedText>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        Created at: {new Date(doc.createdAt.seconds * 1000).toLocaleString()}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        color="primary"
                        onClick={() => handleViewDocument(doc.url)}
                        style={{ marginRight: 'auto' }}
                      >
                        View
                      </Button>
                      <Button size="small" color="secondary" onClick={() => handleDownloadDocument(doc.url)}>
                        Download
                      </Button>
                    </CardActions>
                  </DocumentCard>
                </Grid>
              ))
            )}
          </Grid>
        )}

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            sx={{ mr: 2 }}
          >
            Previous
          </Button>
          <StyledButton
            variant="contained"
            onClick={goToNextPage}
            disabled={!hasMore}
          >
            Next
          </StyledButton>
        </Box>
        <Button variant="outlined" color="secondary" onClick={handleRefresh}>
           Refresh List
         </Button>

      </DashboardBox>
    </GradientBackground>
  );
};

export default Dashboard;
