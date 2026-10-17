import type { PieceRenderObject } from 'solid-chessboard';

export const PIECE_TYPES = [
  'wP',
  'wN',
  'wB',
  'wR',
  'wQ',
  'wK',
  'bP',
  'bN',
  'bB',
  'bR',
  'bQ',
  'bK',
];

export const PIECE_SETS = [
  'alpha',
  'anarcandy',
  'caliente',
  'california',
  'cardinal',
  'cburnett',
  'celtic',
  'chess7',
  'chessnut',
  'companion',
  'cooke',
  'disguised',
  'dubrovny',
  'fantasy',
  'firi',
  'fresca',
  'gioco',
  'governor',
  'horsey',
  'icpieces',
  'kiwen-suwi',
  'kosal',
  'leipzig',
  'letter',
  'maestro',
  'merida',
  'minimal-warmth',
  'monarchy',
  'mono',
  'mpchess',
  'papercut',
  'pirouetti',
  'pixel',
  'reillycraig',
  'rhosgfx',
  'riohacha',
  'shahi-ivory-brown',
  'shapes',
  'spatial',
  'staunty',
  'tatiana',
  'totoy',
  'xkcd',
];

/** Build a `pieces` option from `/piece/<set>/*.svg` sprite files. */
export function buildPieceSet(set: string): PieceRenderObject {
  const pieces: PieceRenderObject = {};
  for (const t of PIECE_TYPES) {
    pieces[t] = () => (
      <img
        src={`/piece/${set}/${t}.svg`}
        alt={t}
        draggable={false}
        style={{ width: '100%', height: '100%', 'user-select': 'none' }}
      />
    );
  }
  return pieces;
}
