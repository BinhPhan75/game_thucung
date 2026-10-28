import React from 'react';
import assets from '../data/pictureAssets.json';

export function pictureUrl(symbol: string): string | undefined {
  const file = (assets as Record<string,string>)[symbol];
  return file ? `${import.meta.env?.BASE_URL ?? '/'}pictures/${file}.svg` : undefined;
}

// Local SVG files keep the illustration identical on Windows, iOS and Android.
export function GamePicture({ symbol }: { symbol: string }) {
  const src = pictureUrl(symbol);
  if (!src) return <>{symbol}</>;
  return <img className="game-picture" src={src} alt="" aria-hidden="true" draggable={false}/>;
}
