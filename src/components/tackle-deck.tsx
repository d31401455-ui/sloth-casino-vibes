import { useId } from 'react';
import { FishingHook as FishingRod, Info, Minus, Plus } from 'lucide-react';
import type { GameState } from '@/hooks/use-fishing-game';
import './tackle-deck.css';

export type TackleDeckProps = {
  /** Current round state. Drives which action button(s) are shown. */
  state: GameState;
  /** Bet as typed by the player (string so the field can hold "10." mid-edit). */
  bet: string;
  /** Bet locked in when the round started. */
  roundBet: number;
  /** Combined multiplier of everything hooked this round (0 when the line snapped). */
  multiplier: number;
  /** Demo wallet balance shown on the left HUD. */
  balance: number;
  /** Amount actually paid out on the last cash out. */
  lastWin: number;
  /** Change this key to replay the gold flash on the Last Win meter. */
  lastWinKey?: number | string;
  /** True while a round is in flight: bet field and shortcuts lock. */
  locked: boolean;
  /** False when the typed bet is outside min/max. */
  valid: boolean;
  /** Ambient animation on/off (the "Ambient motion" setting). */
  motion?: boolean;
  minBet?: number;
  maxBet?: number;
  onBetChange: (value: string) => void;
  /** Receives the new absolute amount; the parent clamps and formats it. */
  onAdjust: (value: number) => void;
  onCast: () => void;
  onCashOut: () => void;
  /** Omit to hide the info button. */
  onInfo?: () => void;
};

const ACTION_TEXT: Record<GameState, string> = {
  idle: 'CAST LINE',
  casting: 'CASTING…',
  waiting: 'WAITING FOR A BITE…',
  bite: 'FISH ON!',
  hooked: 'KEEP FISHING',
  snapped: 'CAST AGAIN',
  cashed: 'CAST AGAIN',
};

const IN_FLIGHT: GameState[] = ['casting', 'waiting', 'bite', 'hooked'];

const money = (value: number) =>
  `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export function TackleDeck({
  state,
  bet,
  roundBet,
  multiplier,
  balance,
  lastWin,
  lastWinKey,
  locked,
  valid,
  motion = true,
  minBet = 0.1,
  maxBet = 1000,
  onBetChange,
  onAdjust,
  onCast,
  onCashOut,
  onInfo,
}: TackleDeckProps) {
  const betId = useId();
  const win = roundBet * multiplier;
  const typed = Number(bet);

  return (
    <div className={`tackle-deck ${motion ? '' : 'still'}`}>
      <div className="deck-rim" aria-hidden="true" />

      <div className="deck-hud">
        <div className="hud-meter">
          <span className="hud-label">BALANCE <em>DEMO</em></span>
          <strong className="hud-value">{money(balance)}</strong>
        </div>
        <div className={`hud-meter hud-win ${lastWin > 0 ? 'has-win' : ''}`} key={lastWinKey}>
          <span className="hud-label">LAST WIN</span>
          <strong className="hud-value">{money(lastWin)}</strong>
        </div>
      </div>

      <div className="deck-bet">
        <label htmlFor={betId} className="hud-label">BET AMOUNT</label>
        <div className="bet-row">
          <div className="amount-field">
            <span className="coin-symbol">$</span>
            <input
              id={betId}
              aria-label="Bet amount"
              type="number"
              min={minBet.toFixed(2)}
              max={maxBet.toFixed(2)}
              step="0.10"
              value={bet}
              disabled={locked}
              onChange={event => onBetChange(event.target.value)}
            />
            <div className="amount-steppers">
              <button type="button" aria-label="Decrease bet" disabled={locked} onClick={() => onAdjust(typed - 1)}><Minus /></button>
              <button type="button" aria-label="Increase bet" disabled={locked} onClick={() => onAdjust(typed + 1)}><Plus /></button>
            </div>
          </div>
          <div className="bet-shortcuts">
            <button type="button" disabled={locked} onClick={() => onAdjust(typed / 2)}>½</button>
            <button type="button" disabled={locked} onClick={() => onAdjust(typed * 2)}>2×</button>
            <button type="button" disabled={locked} onClick={() => onAdjust(maxBet)}>MAX</button>
          </div>
        </div>
        {!valid && <span className="input-error">Enter {minBet.toFixed(2)}–{maxBet.toLocaleString('en-US')}, demo credits.</span>}
      </div>

      <div className="deck-action">
        {state === 'hooked' ? (
          <div className="decision-row">
            <button type="button" className="deck-btn btn-cashout" onClick={onCashOut}>
              <span className="btn-glow" />
              <span className="btn-text">CASH OUT</span>
              <small>{money(win)}</small>
            </button>
            <button type="button" className="deck-btn btn-keep" onClick={onCast}>
              <span className="btn-text"><FishingRod size={16} /> KEEP FISHING</span>
              <small>RISK IT</small>
            </button>
          </div>
        ) : (
          <button
            type="button"
            className={`deck-btn btn-cast ${state === 'bite' ? 'is-bite' : ''}`}
            disabled={IN_FLIGHT.includes(state) || !valid}
            onClick={onCast}
          >
            <span className="btn-glow" />
            <span className="btn-text">
              {state === 'waiting'
                ? <span className="waiting-dots"><i /><i /><i /></span>
                : <FishingRod size={20} />}
              {ACTION_TEXT[state]}
            </span>
          </button>
        )}
      </div>

      {onInfo && (
        <button type="button" className="deck-info" aria-label="Game info" title="Game info" onClick={onInfo}>
          <Info />
        </button>
      )}
    </div>
  );
}
