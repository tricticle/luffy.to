import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [topAiringAnime, setTopAiringAnime] = useState([]);
  const [selectedAnime, setSelectedAnime] = useState(null);
  const [selectedServer, setSelectedServer] = useState('');

  useEffect(() => {
      const fetchData = async () => {
          try {
              if (searchQuery) {
                  const response = await axios.get(
                      `https://api.consumet.org/anime/gogoanime/${searchQuery}?page=1`
                  );
                  setSearchResults(response.data.results);
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

  const fetchEpisodes = async (animeId) => {
      try {
          const response = await axios.get(
              `https://api.consumet.org/anime/gogoanime/info/${animeId}`
          );
          setSelectedAnime(response.data);
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
            setSelectedServer(response.data); // Store server data
        } catch (error) {
            console.error("Error fetching server:", error);
        }
    }
};
useEffect(() => {
    if (selectedServer && selectedServer.length > 0) {
        // Generate and open watch links for each server
        selectedServer.forEach(server => {
            const watchLink = `${server.url}?server=gogocdn`;
            window.open(watchLink, '_blank');
        });
    }
}, [selectedServer]);


    return (
        <div>
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
                    <button id="searchButton"><i className="fas fa-magnifying-glass"></i></button>
                </div>
            </header>

            <section className="search-results">
    <div className="anime-list">
        {searchResults.map((anime) => (
            <div key={anime.id} className="anime-card">
                <img src={anime.image} alt={anime.title} />
                <div className='ani-detail'>
                <h3>{anime.title}</h3>
                <p>language: {anime.subOrDub}</p>
                </div>
                <button onClick={() => fetchEpisodes(anime.id)}><i class="fa-solid fa-play"></i></button>
            </div>
        ))}
    </div>
</section>
            <main className='container'>

                <section className="top-airing">
                    <h2>Top Airing Now</h2>
                    <div className="anime-list">
                        {topAiringAnime.map((anime) => (
                            <div key={anime.id} className="anime-card">
                                <img src={anime.image} alt={anime.title} />
                                <div className='ani-detail'>
                                <h3>{anime.title}</h3>
                                <p>Genres: {anime.genres.join(', ')}</p>
                                </div>
                                <button onClick={() => fetchEpisodes(anime.id)}>watch now</button>
                            </div>
                        ))}
                    </div>
                </section>
                {selectedAnime && (
                    <section className="anime-episodes">
    <h2>{selectedAnime.title} Episodes</h2>
    <div className="episode-list">
        {selectedAnime.episodes.map((episode) => (
            <button
                key={episode.id}
                onClick={() => watchEpisode(episode.id)}>
                Episode {episode.number}
            </button>
        ))}
    </div>
    {selectedServer && selectedServer.length > 0 && (
        <div className="server-list">
            <h3>Server List</h3>
            <ul>
                {selectedServer.map(server => (
                    <li key={server.name}>
                        <a href={`${server.url}?server=gogocdn`} target="_blank" rel="noopener noreferrer">
                            {server.name}
                        </a>
                    </li>
                ))}
            </ul>
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
