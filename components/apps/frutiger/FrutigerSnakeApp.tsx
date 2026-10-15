import React from 'react';
import { FrutigerPinballApp } from './FrutigerPinballApp';

// Re-export Pinball app for the game window
export const FrutigerSnakeApp: React.FC = () => {
  return <FrutigerPinballApp />;
};
