import React from 'react';
import { Character } from '../../api/types';

interface CharacterCardProps {
  character: Character;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ character }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'alive':
        return '#4ade80'; // green
      case 'dead':
        return '#ef4444'; // red
      case 'unknown':
        return '#6b7280'; // gray
      default:
        return '#6b7280';
    }
  };

  const getSpeciesIcon = (species: string) => {
    switch (species.toLowerCase()) {
      case 'human':
        return '👤';
      case 'alien':
        return '👽';
      case 'robot':
        return '🤖';
      case 'humanoid':
        return '🧑‍🤝‍🧑';
      case 'animal':
        return '🐾';
      case 'mythological creature':
        return '🐉';
      case 'disease':
        return '🦠';
      case 'cronenberg':
        return '🧬';
      case 'poopybutthole':
        return '💩';
      default:
        return '❓';
    }
  };

  return (
    <div className="character-card">
      <div className="character-image-container">
        <img 
          src={character.image} 
          alt={character.name}
          className="character-image"
        />
        <div 
          className="status-indicator"
          style={{ backgroundColor: getStatusColor(character.status) }}
        />
      </div>
      
      <div className="character-info">
        <h3 className="character-name">{character.name}</h3>
        
        <div className="character-details">
          <div className="detail-item">
            <span className="detail-label">Status:</span>
            <span 
              className="detail-value status"
              style={{ color: getStatusColor(character.status) }}
            >
              {character.status}
            </span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Species:</span>
            <span className="detail-value">
              {getSpeciesIcon(character.species)} {character.species}
            </span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Gender:</span>
            <span className="detail-value">{character.gender}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Origin:</span>
            <span className="detail-value">{character.origin.name}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Location:</span>
            <span className="detail-value">{character.location.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterCard;
