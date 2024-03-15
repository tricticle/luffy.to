import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [topAiringAnime, setTopAiringAnime] = useState([]);
  const [selectedAnime, setSelectedAnime] = useState(null);
  const [selectedServer, setSelectedServer] = useState([]);
  const [selectedEpisodeUrl, setSelectedEpisodeUrl] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [popularPage, setPopularPage] = useState(1);
  const [fetchingMoreData, setFetchingMoreData] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (searchQuery) {
          const response = await axios.get(`https://luffy-api.vercel.app/anime/gogoanime/${searchQuery}?page=1`
          );
          setSearchResults(response.data.results);
          console.log(response.data);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [searchQuery]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const fetchTopAiringAnime = async (page) => {
      const url = "https://luffy-api.vercel.app/anime/gogoanime/top-airing";
      try {
        const { data } = await axios.get(url, { params: { page } });
        if (page === 1) {
          setTopAiringAnime(data.results);
        } else {
          setTopAiringAnime((prevTopAiringAnime) => [...prevTopAiringAnime, ...data.results]);
        }
      } catch (error) {
        console.error("Error fetching top airing anime:", error);
      } finally {
        setFetchingMoreData(false);
      }
    };

    fetchTopAiringAnime(popularPage);
  }, [popularPage]);

  useEffect(() => {
    const handleIntersection = (entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && !fetchingMoreData) {
        setFetchingMoreData(true);
        setPopularPage((prevPage) => prevPage + 1);
      }
    };

    const observer = new IntersectionObserver(handleIntersection, { threshold: 0.1 });
    observer.observe(bottomRef.current);

    return () => {
      observer.disconnect();
    };
  }, [fetchingMoreData]);

  const fetchEpisodes = async (animeId) => {
    try {
      const response = await axios.get(
        `https://luffy-api.vercel.app/anime/gogoanime/info/${animeId}`
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
          `https://luffy-api.vercel.app/anime/gogoanime/servers/${episodeId}`
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
              <img
                src={anime.image}
                alt={anime.title}
                loading="lazy" // Add loading="lazy" here
              />
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
                <img
                  src={anime.image}
                  alt={anime.title}
                  loading="lazy" // Add loading="lazy" here
                />
                <div className='ani-detail'>
                  <h3>{anime.title.length > 30 ? anime.title.substring(0, 30) + '...' : anime.title}</h3>
                  <p>{anime.genres.slice(0, 3).join(', ')}</p>
                </div>
              </div>
            ))}
          </div>
          {fetchingMoreData && <p>Loading more anime...</p>}
          <div ref={bottomRef} style={{ height: '1px' }}></div>
        </section>
        {selectedAnime && (
          <section className="anime-episodes">
            <button className="close-button" onClick={() => setSelectedAnime(null)}> <i className="fas fa-close"></i></button>
            <div className='video'>
              <h2>{selectedAnime.title.length > 30 ? selectedAnime.title.substring(0, 30) + '...' : selectedAnime.title} episodes</h2>
              {selectedEpisodeUrl && (
                <iframe
                  title="Anime Episode"
                  src={selectedEpisodeUrl}
                  allowFullScreen
                  referrerpolicy="origin-when-cross-origin"
                />
              )}
            </div>
            <div className="episode-list">
              {selectedAnime.episodes.map((episode) => (
                <button
                  key={episode.id}
                  onClick={() => watchEpisode(episode.id)}>
                  Episode {episode.number}
                </button>
              ))}
            </div>
            {selectedServer.length > 0 && (
              <div className="server-list">
                <div className='server-btn'>
                  {selectedServer.map(server => (
                    <button
                      key={server.name}
                      onClick={() => setSelectedEpisodeUrl(server.url)}>
                      {server.name}
                      <i className="fa-solid fa-play"></i>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}
      </main>
      <footer className='about-page'>
        <p>&copy; 2023 luffy.to</p>
      </footer>
    </div>
  );
}

export default App;
