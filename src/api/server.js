const express = require('express');
const axios = require('axios');
const app = express();
const path = require('path');
const port = 8080; // Choose a port for your server

app.use(express.static(path.join(__dirname, 'build')));

app.use(express.json());

app.get('/search/:query', async (req, res) => {
    const searchQuery = req.params.query;
  
    if (!searchQuery) {
      return res.status(400).json({ error: 'Missing search query' });
    }
  
    try {
      const response = await axios.get(
        `https://api.consumet.org/anime/gogoanime/${searchQuery}?page=1`
      );
      res.json(response.data);
    } catch (error) {
      console.error('Error fetching search data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });  

app.get('/top-airing', async (req, res) => {
  try {
    const response = await axios.get(
      'https://api.consumet.org/anime/gogoanime/top-airing',
      { params: { page: 1 } }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching top airing data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/anime/:animeId', async (req, res) => {
    const animeId = req.params.animeId;
  
    if (!animeId) {
      return res.status(400).json({ error: 'Missing anime ID' });
    }
  
    try {
      const response = await axios.get(
        `https://api.consumet.org/anime/gogoanime/info/${animeId}`
      );
      res.json(response.data);
    } catch (error) {
      console.error('Error fetching anime details:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
app.get('/servers/:episodeId', async (req, res) => {
  const episodeId = req.params.episodeId;

  if (!episodeId) {
    return res.status(400).json({ error: 'Missing episode ID' });
  }

  try {
    const response = await axios.get(
      `https://api.consumet.org/anime/gogoanime/servers/${episodeId}`
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching server data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
