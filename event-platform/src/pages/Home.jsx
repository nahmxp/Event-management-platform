import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  CircularProgress,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import axios from '../utils/axios';

const Home = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        const response = await axios.get('/events');
        setUpcomingEvents(response.data.slice(0, 6));
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingEvents();
  }, []);

  const categories = [
    'Music',
    'Sports',
    'Art',
    'Food',
    'Technology',
    'Business',
    'Other',
  ];

  return (
    <Box>
      {/* Banner */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom>
            Discover Amazing Events
          </Typography>
          <Typography variant="h5" gutterBottom>
            Find and join local events that match your interests
          </Typography>
          <Button
            component={RouterLink}
            to="/events"
            variant="contained"
            color="secondary"
            size="large"
            sx={{ mt: 3 }}
          >
            Browse Events
          </Button>
        </Container>
      </Box>

      {/* Categories */}
      <Container sx={{ py: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Categories
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
          {categories.map((category) => (
            <Chip
              key={category}
              label={category}
              component={RouterLink}
              to={`/events?category=${category}`}
              clickable
            />
          ))}
        </Box>
      </Container>

      {/* Upcoming Events */}
      <Container sx={{ py: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Upcoming Events
        </Typography>
        <Grid container spacing={4}>
          {loading ? (
            <Typography>Loading events...</Typography>
          ) : (
            upcomingEvents.map((event) => (
              <Grid item key={event._id} xs={12} sm={6} md={4}>
                <Card
                  component={RouterLink}
                  to={`/events/${event._id}`}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    textDecoration: 'none',
                  }}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={event.image}
                    alt={event.title}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {event.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(event.date).toLocaleDateString()} at {event.time}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {event.location}
                    </Typography>
                    <Chip
                      label={event.category}
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home; 