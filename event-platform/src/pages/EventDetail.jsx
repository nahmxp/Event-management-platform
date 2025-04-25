import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuthStore();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: '',
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/events/${id}`);
        setEvent(response.data);
        setEditForm({
          title: response.data.title,
          description: response.data.description,
          date: new Date(response.data.date).toISOString().split('T')[0],
          time: response.data.time,
          location: response.data.location,
          category: response.data.category,
        });
        if (user) {
          setIsSaved(user.savedEvents.includes(response.data._id));
        }
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, user]);

  const handleSaveEvent = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/api/events/${id}/save`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIsSaved(!isSaved);
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleEdit = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/events/${id}`,
        editForm,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEvent({ ...event, ...editForm });
      setOpenEditDialog(false);
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await axios.delete(`http://localhost:5000/api/events/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        navigate('/events');
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!event) {
    return <Typography>Event not found</Typography>;
  }

  return (
    <Container sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardMedia
              component="img"
              height="400"
              image={event.image}
              alt={event.title}
            />
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" component="h1">
                  {event.title}
                </Typography>
                <Box>
                  {user && (
                    <>
                      {user._id === event.createdBy._id && (
                        <>
                          <IconButton onClick={() => setOpenEditDialog(true)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={handleDelete}>
                            <DeleteIcon />
                          </IconButton>
                        </>
                      )}
                      <IconButton onClick={handleSaveEvent}>
                        {isSaved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                      </IconButton>
                    </>
                  )}
                </Box>
              </Box>
              <Typography variant="body1" paragraph>
                {event.description}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Chip label={event.category} />
                <Chip label={event.location} />
              </Box>
              <Typography variant="body2" color="text.secondary">
                Date: {new Date(event.date).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Time: {event.time}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Created by: {event.createdBy.username}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Edit Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Event</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Title"
            fullWidth
            value={editForm.title}
            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={editForm.description}
            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Date"
            type="date"
            fullWidth
            value={editForm.date}
            onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            label="Time"
            type="time"
            fullWidth
            value={editForm.time}
            onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            label="Location"
            fullWidth
            value={editForm.location}
            onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Category"
            select
            fullWidth
            value={editForm.category}
            onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
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
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleEdit} variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EventDetail; 