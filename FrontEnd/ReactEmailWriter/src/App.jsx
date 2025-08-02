import { useState } from 'react';
import './App.css';
import { Container, Typography, TextField, Box, Button } from '@mui/material';

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateReply = () => {
    // Here you would call your API or logic to generate the email reply
    console.log('Generating reply...');
    setLoading(true);

    // Simulate a network request or call to generate email
    setTimeout(() => {
      setGeneratedReply('This is the generated reply to your email.');
      setLoading(false);
    }, 2000); // Simulate a delay for API call
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Email Reply Generator
      </Typography>

      <Box sx={{ mx: 3 }}>
        <TextField
          fullWidth
          multiline
          rows={6}
          variant="outlined"
          label="Original Email Content"
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          variant="outlined"
          label="Tone"
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleGenerateReply}
          sx={{ mb: 2 }}
        >
          Generate Reply
        </Button>

        {loading && <Typography>Loading...</Typography>}
        {generatedReply && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Generated Reply:</Typography>
            <Typography>{generatedReply}</Typography>
          </Box>
        )}
        {error && <Typography color="error">{error}</Typography>}
      </Box>
    </Container>
  );
}

export default App;
