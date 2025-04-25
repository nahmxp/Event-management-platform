import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Tabs,
  Tab,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, token } = useAuthStore();
  const [tabValue, setTabValue] = useState(0);
  const [myEvents, setMyEvents] = useState([]);
  const [savedEvents, setSavedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: '',
    image: 'https://via.placeholder.com/300x200',
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchEvents = async () => {
      try {
        setLoading(true);
        const [myEventsRes, savedEventsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/events', {
            params: { createdBy: user._id },
          }),
          axios.get('http://localhost:5000/api/events', {
            params: { saved: true },
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setMyEvents(myEventsRes.data);
        setSavedEvents(savedEventsRes.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user, token, navigate]);

  const handleCreateEvent = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/events',
        createForm,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMyEvents([...myEvents, response.data]);
      setOpenCreateDialog(false);
      setCreateForm({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        category: '',
        image: 'https://via.placeholder.com/300x200',
      });
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await axios.delete(`http://localhost:5000/api/events/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMyEvents(myEvents.filter((event) => event._id !== eventId));
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const renderEvents = (events) => {
    if (loading) {
      return <Typography>Loading...</Typography>;
    }

    if (events.length === 0) {
      return <Typography>No events found</Typography>;
    }

    return (
      <Grid container spacing={4}>
        {events.map((event) => (
          <Grid item key={event._id} xs={12} sm={6} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={event.image}
                alt={event.title}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {event.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(event.date).toLocaleDateString()} at {event.time}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {event.location}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Button
                    size="small"
                    onClick={() => navigate(`/events/${event._id}`)}
                  >
                    View Details
                  </Button>
                  {tabValue === 0 && (
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteEvent(event._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" component="h1">
          My Dashboard
        </Typography>
        {tabValue === 0 && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenCreateDialog(true)}
          >
            Create Event
          </Button>
        )}
      </Box>

      <Tabs
        value={tabValue}
        onChange={(e, newValue) => setTabValue(newValue)}
        sx={{ mb: 4 }}
      >
        <Tab label="My Events" />
        <Tab label="Saved Events" />
      </Tabs>

      {tabValue === 0 ? renderEvents(myEvents) : renderEvents(savedEvents)}

      {/* Create Event Dialog */}
      <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)}>
        <DialogTitle>Create New Event</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Title"
            fullWidth
            value={createForm.title}
            onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={createForm.description}
            onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Date"
            type="date"
            fullWidth
            value={createForm.date}
            onChange={(e) => setCreateForm({ ...createForm, date: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            label="Time"
            type="time"
            fullWidth
            value={createForm.time}
            onChange={(e) => setCreateForm({ ...createForm, time: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            label="Location"
            fullWidth
            value={createForm.location}
            onChange={(e) => setCreateForm({ ...createForm, location: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Category"
            select
            fullWidth
            value={createForm.category}
            onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
          >
            <MenuItem value="Music">Music</MenuItem>
            <MenuItem value="Sports">Sports</MenuItem>
            <MenuItem value="Art">Art</MenuItem>
            <MenuItem value="Food">Food</MenuItem>
            <MenuItem value="Technology">Technology</MenuItem>
            <MenuItem value="Business">Business</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateEvent} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard; 