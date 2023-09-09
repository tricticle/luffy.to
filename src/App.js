import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FullInset from './FullInset';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [topAiringAnime, setTopAiringAnime] = useState([]);
  const [selectedAnime, setSelectedAnime] = useState(null);
  const [selectedServer, setSelectedServer] = useState([]);
  const [selectedEpisodeUrl, setSelectedEpisodeUrl] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (searchQuery) {
          const response = await axios.get(
            `https://api.consumet.org/anime/gogoanime/${searchQuery}?page=1`
          );
          setSearchResults(response.data.results);
          console.log(response.data);
        } else {
          setSearchResults([]);
        }

        const topAiringResponse = await axios.get(
          "https://api.consumet.org/anime/gogoanime/top-airing",
          { params: { page: 1 } }
        );
        setTopAiringAnime(topAiringResponse.data.results);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [searchQuery]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const fetchEpisodes = async (animeId) => {
    try {
      const response = await axios.get(
        `https://api.consumet.org/anime/gogoanime/info/${animeId}`
      );
      setSelectedAnime(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching episodes:", error);
    }
  };

  const watchEpisode = async (episodeId) => {
    if (selectedAnime) {
      try {
        const response = await axios.get(
          `https://api.consumet.org/anime/gogoanime/servers/${episodeId}`
        );
        setSelectedServer(response.data);
        console.log(response.data);

        // Assuming the first server in the list has the episode URL
        if (response.data.length > 0) {
          setSelectedEpisodeUrl(response.data[0].url);
        }
      } catch (error) {
        console.error("Error fetching server:", error);
      }
    }
  };



    return (
      <BrowserRouter>
        <div>
            <section className="wrapper">
            <header className='header'>
                <h1>luffy.to</h1>
                <div className="search-bar">
                    <input
                        type="text"
                        id="searchInput"
                        placeholder="Search for anime..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="menu-btn">
  <button onClick={toggleMenu}>
    <i className="fas fa-bars"></i>
  </button>
  <div className={`dropdown ${isMenuOpen ? 'open' : ''}`}>
    <ul>
      <li>adding options soon</li>
    </ul>
  </div>
</div>

            </header>
            </section>

            <section className="search-results">
    <div className="anime-list">
        {searchResults.map((anime) => (
            <div key={anime.id} className="anime-card">
                <img src={anime.image} alt={anime.title} />
                <div className='ani-detail'>
 <h3>{anime.title.length > 30 ? anime.title.substring(0, 30) + '...' : anime.title}</h3>
                <p>{anime.subOrDub}</p>
                </div>
                <button onClick={() => fetchEpisodes(anime.id)}><i className="fa-solid fa-play"></i></button>
            </div>
        ))}
    </div>
</section>
            <main className='container'>
                <section className="top-airing">
                    <h2>Popular</h2>
                    <div className="anime-list">
                        {topAiringAnime.map((anime) => (
                            <div key={anime.id} className="anime-card" onClick={() => fetchEpisodes(anime.id)}>
                                <img src={anime.image} alt={anime.title} />
                                <div className='ani-detail'>
                                <h3>{anime.title.length > 30 ? anime.title.substring(0, 30) + '...' : anime.title}</h3>
                                <p>{anime.genres.slice(0, 3).join(', ')}</p>
                                </div>
                                
                            </div>
                        ))}
                    </div>
                </section>
      <Routes>y
      <Route path="/" element={<FullInset
          selectedAnime={selectedAnime}
          selectedEpisodeUrl={selectedEpisodeUrl}
          watchEpisode={watchEpisode}
          selectedServer={selectedServer}
          setSelectedAnime={setSelectedAnime}
          setSelectedEpisodeUrl={setSelectedEpisodeUrl}
        />} />
        </Routes>

            </main>
            <footer className='about-page'>
                <p>&copy; 2023 luffy.to</p>
            </footer>
        </div>
            </BrowserRouter>
    );
}

export default App;