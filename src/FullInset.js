import React from 'react';

function FullInset({ selectedAnime, selectedEpisodeUrl, watchEpisode, selectedServer, setSelectedAnime, setSelectedEpisodeUrl }) {
  return (
    <div className='inset'>
      {selectedAnime && (
        <section className="anime-episodes">
          <button className="close-button" onClick={() => setSelectedAnime(null)}>
            <i className="fas fa-close"></i>
          </button>
          <h2>{selectedAnime.title.length > 30 ? selectedAnime.title.substring(0, 30) + '...' : selectedAnime.title} episodes</h2>
          <div className="episode-list">
            <div className='video'>
              {selectedEpisodeUrl && (
                <iframe
                  title="Anime Episode"
                  src={selectedEpisodeUrl}
                  allowFullScreen="true" marginWidth="0" marginHeight="0" scrolling="no" frameBorder="0"
                />
              )}
            </div>
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
  );
}

export default FullInset;
