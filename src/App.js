import React, { useState, useEffect } from 'react';
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
  const [popularPage, setPopularPage] = useState(0); // Initialize popularPage to 0
  const [fetchedFirstPage, setFetchedFirstPage] = useState(false); // Boolean flag

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

        // Increment popularPage by 1 when fetching data,
        // but only if the first page has been fetched
        if (fetchedFirstPage) {
          const currentPage = popularPage + 1;

          // Fetch top airing anime for the current page
          const response = await axios.get(
            `https://api.consumet.org/anime/gogoanime/top-airing`,
            { params: { page: currentPage } }
          );
          const newTopAiringAnime = response.data.results;

          // Append the new data to the existing list of top airing anime
          setTopAiringAnime((prevTopAiringAnime) => [
            ...prevTopAiringAnime,
            ...newTopAiringAnime,
          ]);

          // Update popularPage after successfully fetching data
          setPopularPage(currentPage);
        } else {
          // If the first page hasn't been fetched yet, set the flag
          setFetchedFirstPage(true);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [searchQuery, popularPage, fetchedFirstPage]); // Include popularPage in the dependency array

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

  // Function to handle scrolling and trigger fetch when reaching the bottom
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      // User has reached the bottom, so fetch more data
      setPopularPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    // Add a scroll event listener to the window
    window.addEventListener("scroll", handleScroll);

    // Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

// ... Rest of your code ...

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
      </section>
      <div className='inset'>
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
      </div>
    </main>
    <footer className='about-page'>
      <p>&copy; 2023 luffy.to</p>
    </footer>
  </div>
);
}

export default App;
