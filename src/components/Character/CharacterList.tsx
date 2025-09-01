import React from 'react';
import CharacterCard from './CharacterCard';
import { Character } from '../../api/types';

interface CharacterListProps {
  characters: Character[];
  loading?: boolean;
  loadingMore?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

const CharacterList: React.FC<CharacterListProps> = ({ 
  characters, 
  loading = false, 
  loadingMore = false,
  onLoadMore,
  hasMore = false 
}) => {
  if (loading && characters.length === 0) {
    return (
      <div className="character-list-loading">
        <div className="loading-spinner">🌀</div>
        <p>Loading characters from the multiverse...</p>
      </div>
    );
  }

  return (
    <div className="character-list-container">
      <div className="character-list">
        {characters.map((character) => (
          <CharacterCard key={character.id} character={character} />
        ))}
      </div>
      
      {loadingMore && characters.length > 0 && (
        <div className="character-list-loading-more">
          <div className="loading-spinner">🌀</div>
          <p>Loading more characters...</p>
        </div>
      )}
      
      {hasMore && !loading && !loadingMore && onLoadMore && (
        <div className="character-list-actions">
          <button 
            className="load-more-btn"
            onClick={onLoadMore}
          >
            Load More Characters
          </button>
        </div>
      )}
    </div>
  );
};

export default CharacterList;
