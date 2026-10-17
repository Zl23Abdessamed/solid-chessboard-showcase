import { Title } from '@solidjs/meta';

export default function FunctionsAndTypes() {
  return (
    <main>
      <Title>Functions &amp; data types — solid-chessboard</Title>
      <h1 class="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
        Functions &amp; data types
      </h1>
      <p class="mt-5 max-w-3xl text-lg leading-relaxed text-slate-400">
        Complete public API for <code class="text-slate-200">solid-chessboard</code>: components, options, event payloads, types and utility functions exported from the library.
      </p>

      <section class="mt-12">
        <h2 class="text-2xl font-bold tracking-tight">Components</h2>
        <div class="mt-4 grid gap-4">
          <div class="rounded-2xl bg-white/[0.04] p-6 ring-1 ring-white/10">
            <h3 class="text-lg font-semibold text-slate-100">Chessboard</h3>
            <p class="mt-2 text-sm text-slate-400">Main board component. Accepts <code class="text-slate-200">options</code> prop.</p>
            <pre class="mt-3 overflow-x-auto text-xs text-slate-300"><code>{`import { Chessboard } from 'solid-chessboard';

<Chessboard options={{ position: 'startFen', allowDragging: true }} />
`}</code></pre>
          </div>
          <div class="rounded-2xl bg-white/[0.04] p-6 ring-1 ring-white/10">
            <h3 class="text-lg font-semibold text-slate-100">ChessboardProvider</h3>
            <p class="mt-2 text-sm text-slate-400">Provides shared board state to <code class="text-slate-200">Chessboard</code> and <code class="text-slate-200">SparePiece</code>. Used for spare pieces / setup.</p>
            <pre class="mt-3 overflow-x-auto text-xs text-slate-300"><code>{`<ChessboardProvider options={{ position, onPieceDrop }}>
  <SparePiece pieceType="wP" />
  <Chessboard />
</ChessboardProvider>
`}</code></pre>
          </div>
          <div class="rounded-2xl bg-white/[0.04] p-6 ring-1 ring-white/10">
            <h3 class="text-lg font-semibold text-slate-100">SparePiece</h3>
            <p class="mt-2 text-sm text-slate-400">Draggable palette piece. Requires a <code class="text-slate-200">ChessboardProvider</code>.</p>
            <pre class="mt-3 overflow-x-auto text-xs text-slate-300"><code>{`<SparePiece pieceType="wQ" />`}</code></pre>
          </div>
        </div>
      </section>

      <section class="mt-16">
        <h2 class="text-2xl font-bold tracking-tight">ChessboardOptions</h2>
        <p class="mt-3 max-w-3xl text-base leading-relaxed text-slate-400">
          Options passed to <code class="text-slate-200">Chessboard</code> / <code class="text-slate-200">ChessboardProvider</code>.
        </p>
        <div class="mt-6 rounded-2xl bg-white/[0.04] p-6 ring-1 ring-white/10">
          <pre class="overflow-x-auto text-xs text-slate-300"><code>{`type ChessboardOptions = {
  id?: string;
  pieces?: PieceRenderObject;
  position?: string | PositionDataType;
  boardOrientation?: 'white' | 'black';
  chessboardRows?: number;
  chessboardColumns?: number;
  boardStyle?: JSX.CSSProperties;
  squareStyle?: JSX.CSSProperties;
  squareStyles?: Record<string, JSX.CSSProperties>;
  darkSquareStyle?: JSX.CSSProperties;
  lightSquareStyle?: JSX.CSSProperties;
  dropSquareStyle?: JSX.CSSProperties;
  draggingPieceStyle?: JSX.CSSProperties;
  draggingPieceGhostStyle?: JSX.CSSProperties;
  darkSquareNotationStyle?: JSX.CSSProperties;
  lightSquareNotationStyle?: JSX.CSSProperties;
  alphaNotationStyle?: JSX.CSSProperties;
  numericNotationStyle?: JSX.CSSProperties;
  showNotation?: boolean;
  animationDurationInMs?: number;
  showAnimations?: boolean;
  allowDragging?: boolean;
  allowDragOffBoard?: boolean;
  allowAutoScroll?: boolean;
  dragActivationDistance?: number;
  allowDrawingArrows?: boolean;
  arrows?: Arrow[];
  arrowOptions?: typeof defaultArrowOptions;
  clearArrowsOnClick?: boolean;
  clearArrowsOnPositionChange?: boolean;
  canDragPiece?: ({ isSparePiece, piece, square }: PieceHandlerArgs) => boolean;
  onArrowsChange?: ({ arrows }: { arrows: Arrow[] }) => void;
  onMouseOutSquare?: ({ piece, square }: SquareHandlerArgs) => void;
  onMouseOverSquare?: ({ piece, square }: SquareHandlerArgs) => void;
  onPieceClick?: ({ isSparePiece, piece, square }: PieceHandlerArgs) => void;
  onPieceDrag?: ({ isSparePiece, piece, square }: PieceHandlerArgs) => void;
  onPieceDragCancel?: () => void;
  onPieceDrop?: ({ piece, sourceSquare, targetSquare }: PieceDropHandlerArgs) => boolean;
  onSquareClick?: ({ piece, square }: SquareHandlerArgs) => void;
  onSquareMouseDown?: ({ piece, square }: SquareHandlerArgs, e: MouseEvent) => void;
  onSquareMouseUp?: ({ piece, square }: SquareHandlerArgs, e: MouseEvent) => void;
  onSquareRightClick?: ({ piece, square }: SquareHandlerArgs) => void;
  squareRenderer?: SquareRenderer;
};`}</code></pre>
        </div>
      </section>

      <section class="mt-16">
        <h2 class="text-2xl font-bold tracking-tight">Types</h2>
        <div class="mt-6 grid gap-4">
          <div class="rounded-2xl bg-white/[0.04] p-6 ring-1 ring-white/10">
            <h3 class="text-lg font-semibold">Arrow</h3>
            <pre class="mt-2 overflow-x-auto text-xs text-slate-300"><code>{`type Arrow = {
  startSquare: string;
  endSquare: string;
  color: string;
};`}</code></pre>
          </div>
          <div class="rounded-2xl bg-white/[0.04] p-6 ring-1 ring-white/10">
            <h3 class="text-lg font-semibold">SquareDataType</h3>
            <pre class="mt-2 overflow-x-auto text-xs text-slate-300"><code>{`type SquareDataType = {
  squareId: string;
  isLightSquare: boolean;
};`}</code></pre>
          </div>
          <div class="rounded-2xl bg-white/[0.04] p-6 ring-1 ring-white/10">
            <h3 class="text-lg font-semibold">PieceDataType</h3>
            <pre class="mt-2 overflow-x-auto text-xs text-slate-300"><code>{`type PieceDataType = {
  pieceType: string; // e.g. "wP", "bK"
};`}</code></pre>
          </div>
          <div class="rounded-2xl bg-white/[0.04] p-6 ring-1 ring-white/10">
            <h3 class="text-lg font-semibold">DraggingPieceDataType</h3>
            <pre class="mt-2 overflow-x-auto text-xs text-slate-300"><code>{`type DraggingPieceDataType = {
  isSparePiece: boolean;
  position: string;
  pieceType: string;
};`}</code></pre>
          </div>
          <div class="rounded-2xl bg-white/[0.04] p-6 ring-1 ring-white/10">
            <h3 class="text-lg font-semibold">PositionDataType</h3>
            <pre class="mt-2 overflow-x-auto text-xs text-slate-300"><code>{`type PositionDataType = {
  [square: string]: PieceDataType;
};`}</code></pre>
          </div>
          <div class="rounded-2xl bg-white/[0.04] p-6 ring-1 ring-white/10">
            <h3 class="text-lg font-semibold">SquareHandlerArgs</h3>
            <pre class="mt-2 overflow-x-auto text-xs text-slate-300"><code>{`type SquareHandlerArgs = {
  piece: PieceDataType | null;
  square: string;
};`}</code></pre>
          </div>
          <div class="rounded-2xl bg-white/[0.04] p-6 ring-1 ring-white/10">
            <h3 class="text-lg font-semibold">PieceHandlerArgs</h3>
            <pre class="mt-2 overflow-x-auto text-xs text-slate-300"><code>{`type PieceHandlerArgs = {
  isSparePiece: boolean;
  piece: PieceDataType;
  square: string | null;
};`}</code></pre>
          </div>
          <div class="rounded-2xl bg-white/[0.04] p-6 ring-1 ring-white/10">
            <h3 class="text-lg font-semibold">PieceDropHandlerArgs</h3>
            <pre class="mt-2 overflow-x-auto text-xs text-slate-300"><code>{`type PieceDropHandlerArgs = {
  piece: DraggingPieceDataType;
  sourceSquare: string;
  targetSquare: string | null;
};`}</code></pre>
          </div>
          <div class="rounded-2xl bg-white/[0.04] p-6 ring-1 ring-white/10">
            <h3 class="text-lg font-semibold">SquareRenderer</h3>
            <pre class="mt-2 overflow-x-auto text-xs text-slate-300"><code>{`type SquareRenderer = ({
  piece,
  square,
  children,
}: SquareHandlerArgs & { children?: JSX.Element }) => JSX.Element;`}</code></pre>
          </div>
          <div class="rounded-2xl bg-white/[0.04] p-6 ring-1 ring-white/10">
            <h3 class="text-lg font-semibold">PieceRenderObject</h3>
            <pre class="mt-2 overflow-x-auto text-xs text-slate-300"><code>{`type PieceRenderObject = Record<string, (props?: {
  fill?: string;
  square?: string;
  svgStyle?: JSX.CSSProperties;
}) => JSX.Element>;`}</code></pre>
          </div>
          <div class="rounded-2xl bg-white/[0.04] p-6 ring-1 ring-white/10">
            <h3 class="text-lg font-semibold">ArrowModifiers</h3>
            <pre class="mt-2 overflow-x-auto text-xs text-slate-300"><code>{`type ArrowModifiers = {
  shiftKey: boolean;
  ctrlKey: boolean;
  altKey?: boolean;
  metaKey?: boolean;
};`}</code></pre>
          </div>
          <div class="rounded-2xl bg-white/[0.04] p-6 ring-1 ring-white/10">
            <h3 class="text-lg font-semibold">FenPieceString</h3>
            <pre class="mt-2 overflow-x-auto text-xs text-slate-300"><code>{`type FenPieceString = 'p'|'r'|'n'|'b'|'q'|'k'|'P'|'R'|'N'|'B'|'Q'|'K';`}</code></pre>
          </div>
        </div>
      </section>

      <section class="mt-16">
        <h2 class="text-2xl font-bold tracking-tight">Utility functions</h2>
        <p class="mt-3 max-w-3xl text-base leading-relaxed text-slate-400">
          Exported from <code class="text-slate-200">solid-chessboard</code> for position/board helpers.
        </p>
        <div class="mt-6 rounded-2xl bg-white/[0.04] p-6 ring-1 ring-white/10">
          <pre class="overflow-x-auto text-xs text-slate-300"><code>{`export function generateBoard(noOfRows: number, noOfColumns: number, boardOrientation: 'white' | 'black'): SquareDataType[][];
export function rowIndexToChessRow(row: number, noOfRows: number, boardOrientation: 'white' | 'black'): string;
export function columnIndexToChessColumn(column: number, noOfColumns: number, boardOrientation: 'white' | 'black'): string;
export function chessColumnToColumnIndex(column: string, noOfColumns: number, boardOrientation: 'white' | 'black'): number;
export function chessRowToRowIndex(row: string, noOfRows: number, boardOrientation: 'white' | 'black'): number;
export function fenStringToPositionObject(fen: string, noOfRows: number, noOfColumns: number): PositionDataType;
export function getPositionUpdates(oldPosition: PositionDataType, newPosition: PositionDataType, noOfColumns: number, boardOrientation: 'white' | 'black'): Record<string, string>;
export function getPromotionUpdates(oldPosition: PositionDataType, newPosition: PositionDataType, noOfRows: number, noOfColumns: number): Record<string, string>;
export function getRelativeCoords(boardOrientation: 'white' | 'black', boardWidth: number, chessboardColumns: number, chessboardRows: number, square: string): { x: number; y: number };
export function isTouchEndWithinSquare(id: string, squareId: string, e: TouchEvent): boolean;`}</code></pre>
        </div>
      </section>

      <section class="mt-16">
        <h2 class="text-2xl font-bold tracking-tight">Defaults</h2>
        <p class="mt-3 max-w-3xl text-base leading-relaxed text-slate-400">
          Style helpers and default piece set exported from the library.
        </p>
        <div class="mt-6 rounded-2xl bg-white/[0.04] p-6 ring-1 ring-white/10">
          <pre class="overflow-x-auto text-xs text-slate-300"><code>{`export function defaultBoardStyle(chessboardColumns: number): JSX.CSSProperties;
export const defaultSquareStyle: JSX.CSSProperties;
export const defaultDarkSquareStyle: JSX.CSSProperties;
export const defaultLightSquareStyle: JSX.CSSProperties;
export const defaultDropSquareStyle: JSX.CSSProperties;
export const defaultDarkSquareNotationStyle: JSX.CSSProperties;
export const defaultLightSquareNotationStyle: JSX.CSSProperties;
export const defaultAlphaNotationStyle: JSX.CSSProperties;
export const defaultNumericNotationStyle: JSX.CSSProperties;
export const defaultDraggingPieceStyle: JSX.CSSProperties;
export const defaultDraggingPieceGhostStyle: JSX.CSSProperties;
export const defaultArrowOptions: { colors: { default:string; shift:string; ctrl:string; alt:string; meta:string }; ... };
export const defaultPieces: PieceRenderObject;
`}</code></pre>
        </div>
      </section>
    </main>
  );
}
