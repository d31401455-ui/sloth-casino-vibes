import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from 'react';
import { ArrowDownRight, ArrowLeft, Check, ChevronDown, Fish, FishingHook as FishingRod, History, Info, Maximize, Minus, Plus, Settings2, Volume2, VolumeX, Waves, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFishingGame, type OutcomeMode } from '@/hooks/use-fishing-game';
import lake from '@/assets/fishing_lake.jpg';
import sloth from '@/assets/sloth_boat.png';

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Sloth’s Fishing Hole | Housebets Originals" },
    { name: 'description', content: 'A little patience. A nice catch. Explore the Housebets sloth fishing game in a free-play interactive demo.' },
    { property: 'og:title', content: 'Sloth’s Fishing Hole | Housebets Originals' },
    { property: 'og:description', content: 'Cast your line and unwind with the Housebets sloth. A free-play fishing game demo.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: Index,
});

function Index() {
  const game = useFishingGame();
  const [sound, setSound] = useState(false);
  const [motion, setMotion] = useState(true);
  const [modal, setModal] = useState<'info' | 'settings' | null>(null);
  const [tab, setTab] = useState<'recent' | 'catches'>('recent');
  const [expanded, setExpanded] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const stageRef = useRef<HTMLElement>(null);
  const audioRef = useRef<AudioContext | null>(null);
  const active = ['casting', 'waiting', 'bite', 'reeling'].includes(game.state);
  const result = game.state === 'win' || game.state === 'loss';
  const actionText = { idle: 'CAST LINE', casting: 'CASTING…', waiting: 'LAZY RIVER…', bite: 'REEL IT IN!', reeling: 'REELING IT IN…', win: 'CAST AGAIN', loss: 'TRY AGAIN' }[game.state];
  const statusText = { idle: 'Good things come to those who bait.', casting: 'A little splash. A little hope.', waiting: 'Easy does it. The fish are on their way.', bite: 'Something’s on the line!', reeling: 'Let’s see what’s down there…', win: 'Now that’s worth the wait.', loss: 'That one had other plans.' }[game.state];

  useEffect(() => {
    if (modal) dialogRef.current?.showModal();
    else dialogRef.current?.close();
  }, [modal]);
  useEffect(() => {
    if (!sound || !['bite', 'win', 'loss'].includes(game.state)) return;
    const audio = audioRef.current;
    if (!audio) return;
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(game.state === 'win' ? 660 : game.state === 'bite' ? 440 : 220, audio.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(game.state === 'loss' ? 110 : 880, audio.currentTime + 0.3);
    gain.gain.setValueAtTime(0.08, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.45);
    oscillator.connect(gain); gain.connect(audio.destination);
    oscillator.start(); oscillator.stop(audio.currentTime + 0.45);
  }, [game.state, sound]);
  useEffect(() => () => { void audioRef.current?.close(); }, []);
  useEffect(() => {
    const handler = () => setExpanded(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);
  function toggleSound() {
    if (!sound && !audioRef.current) audioRef.current = new AudioContext();
    if (!sound) void audioRef.current?.resume();
    setSound(!sound);
  }
  async function toggleFullscreen() {
    if (document.fullscreenElement) await document.exitFullscreen();
    else if (stageRef.current?.requestFullscreen) {
      try { await stageRef.current.requestFullscreen(); } catch { setExpanded(!expanded); }
    } else setExpanded(!expanded);
  }
  const rows = tab === 'catches' ? game.history.filter(item => item.multiplier > 0) : game.history;

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="housebets-logo" href="https://www.housebets.com/" target="_blank" rel="noreferrer" aria-label="Housebets website"><span className="brand-symbol">H<span>•</span></span>house<span>bets</span><span className="brand-dot">.</span></a>
        <div className="header-divider" />
        <span className="header-label">ORIGINALS</span>
        <div className="header-right"><span className="demo-tag"><span /> DEMO MODE</span><span className="free-play">No real money. Just good catches.</span></div>
      </header>

      <main>
        <div className="breadcrumb"><a href="https://www.housebets.com/" target="_blank" rel="noreferrer"><ArrowLeft size={14} /> Casino</a><span>/</span><span>Housebets Originals</span><span>/</span><strong>Sloth’s Fishing Hole</strong></div>
        <div className="page-heading">
          <div><div className="eyebrow"><span /> HOUSEBETS ORIGINAL</div><h1>Sloth’s Fishing Hole<span className="title-dot">.</span></h1><p>Cast a line. Take your time. Reel in a little luck.</p></div>
          <div className="game-category"><FishingRod size={16} /><span>THE PATIENCE GAME</span></div>
        </div>

        <section ref={stageRef} className={`game-frame ${expanded ? 'expanded' : ''} ${!motion ? 'still' : ''}`} aria-label="Fishing game">
          <div className={`lake-scene state-${game.state}`}>
            <img src={lake} className="lake-background" alt="A peaceful turquoise fishing lake surrounded by pine forests at sunset" width={1536} height={1024} />
            <div className="scene-shade" />
            <div className="scene-top"><span className="spot-name"><span /> SLOTH’S SPOT <span className="spot-divider">/</span> <span className="spot-weather">Dusk, 22°</span></span><span className="scene-demo">FREE PLAY</span></div>
            <div className="scene-copy"><div className="scene-kicker">A LITTLE PATIENCE. A LITTLE LUCK.</div><h2>The good life<br />is on the line.</h2></div>
            <div className="water-shimmer" />
            <div className="boat-ripple ripple-one" /><div className="boat-ripple ripple-two" />
            <div className="sloth-wrap"><img src={sloth} alt="Housebets sloth in his top hat, fishing from a wooden boat" width={1024} height={1024} className="sloth-character" /></div>
            <div className="float-ripple" /><div className="fishing-float" />
            {(game.state === 'bite' || game.state === 'reeling') && <div className="bite-badge"><Fish size={24} /> {game.state === 'bite' ? 'BITE!' : 'HOLD ON…'}</div>}
            {game.state === 'win' && <div className="caught-fish"><Fish size={56} /><span>✦</span><span>✧</span></div>}
            {game.state === 'loss' && <div className="escaped-fish"><Fish size={42} /></div>}
            <div className={`multiplier-block ${result ? 'show-result' : ''}`} aria-live="polite">
              <div className="multiplier-caption">{game.state === 'win' ? 'CAUGHT · NICE CATCH!' : game.state === 'loss' ? 'THE FISH GOT AWAY!' : game.state === 'waiting' ? 'LAZY RIVER · WAITING FOR A BITE' : 'YOUR NEXT CATCH AWAITS'}</div>
              <div className="multiplier">{game.multiplier.toFixed(2)}<span>×</span></div>
              <div className="scene-status">{game.state === 'win' ? `BET ${game.roundBet.toFixed(2)} → WIN ${(game.roundBet * game.multiplier).toFixed(2)}` : statusText}</div>
            </div>
            <div className="scene-bottom"><span><Waves size={14} /> A good place to do absolutely nothing.</span><div className="scene-tools"><Button variant="ghost" size="icon" title={sound ? 'Mute sound' : 'Enable sound'} aria-label={sound ? 'Mute sound' : 'Enable sound'} onClick={toggleSound}>{sound ? <Volume2 /> : <VolumeX />}</Button><Button variant="ghost" size="icon" title="Game settings" aria-label="Game settings" onClick={() => setModal('settings')}><Settings2 /></Button><Button variant="ghost" size="icon" title={expanded ? 'Exit full screen' : 'Full screen'} aria-label={expanded ? 'Exit full screen' : 'Full screen'} onClick={() => void toggleFullscreen()}><Maximize /></Button></div></div>
          </div>

          <div className="control-panel">
            <div className="bet-controls"><label htmlFor="bet-amount">BET AMOUNT <span>DEMO CREDITS</span></label><div className="bet-row"><div className="amount-field"><span className="coin-symbol">$</span><input id="bet-amount" aria-label="Bet amount" type="number" min="0.10" max="1000" step="0.10" value={game.bet} disabled={game.locked} onChange={event => game.setBet(event.target.value)} /><div className="amount-steppers"><Button variant="ghost" size="icon" aria-label="Decrease bet" title="Decrease bet" disabled={game.locked} onClick={() => game.adjust(Number(game.bet) - 1)}><Minus /></Button><Button variant="ghost" size="icon" aria-label="Increase bet" title="Increase bet" disabled={game.locked} onClick={() => game.adjust(Number(game.bet) + 1)}><Plus /></Button></div></div><div className="bet-shortcuts"><Button variant="secondary" disabled={game.locked} onClick={() => game.adjust(Number(game.bet) / 2)}>½</Button><Button variant="secondary" disabled={game.locked} onClick={() => game.adjust(Number(game.bet) * 2)}>2×</Button><Button variant="secondary" disabled={game.locked} onClick={() => game.adjust(1000)}>MAX</Button></div></div>{!game.valid && <span className="input-error">Enter 0.10–1,000 demo credits.</span>}</div>
            <div className="cast-control"><Button className={`cast-button ${game.state === 'bite' ? 'bite-button' : ''}`} disabled={(active && game.state !== 'bite') || !game.valid} onClick={game.action}>{game.state === 'waiting' ? <span className="waiting-dots"><i /><i /><i /></span> : <FishingRod size={22} />}{actionText}</Button><span>{game.state === 'bite' ? 'Your catch is ready. Let’s take a look.' : 'Sit back. The lake sets the pace.'}</span></div>
            <div className="panel-info"><span className="live-state"><span className={active ? 'active-dot' : ''} />{game.state === 'idle' ? 'READY TO CAST' : game.state.toUpperCase()}</span><Button variant="ghost" className="info-button" onClick={() => setModal('info')}><Info size={14} /> Game info</Button></div>
          </div>
        </section>

        <section className="history-section" aria-label="Catch history"><div className="history-header"><div className="history-tabs"><Button variant="ghost" className={tab === 'recent' ? 'selected' : ''} onClick={() => setTab('recent')}><History size={15} /> Recent catches {game.history.length > 0 && <span className="count-badge">{game.history.length}</span>}</Button><Button variant="ghost" className={tab === 'catches' ? 'selected' : ''} onClick={() => setTab('catches')}><Fish size={15} /> My catches</Button></div><span className="session-label">THIS SESSION <ChevronDown size={12} /></span></div>
          {rows.length === 0 ? <div className="empty-history"><span className="empty-icon"><Fish size={24} /></span><div><strong>{tab === 'catches' ? 'Your trophy shelf is waiting.' : 'Every good story starts with a cast.'}</strong><p>{tab === 'catches' ? 'Successful catches will appear here.' : 'Your recent catches will appear here.'}</p></div><span className="empty-line" /><FishingRod className="empty-rod" size={25} /></div> : <div className="history-table"><div className="table-row table-head"><span>CATCH</span><span>BET</span><span>MULTIPLIER</span><span>RETURN</span></div>{rows.map(item => <div className="table-row" key={item.id}><span className="catch-name"><Fish size={15} /><strong>{item.multiplier > 0 ? 'Nice catch' : 'Got away'}</strong><small>{item.time}</small></span><span>{item.bet.toFixed(2)}</span><span className={item.multiplier > 0 ? 'positive' : 'muted-result'}>{item.multiplier.toFixed(2)}×</span><span>{(item.bet * item.multiplier).toFixed(2)} <ArrowDownRight size={12} /></span></div>)}</div>}
        </section>
        <footer><span><span className="footer-h">H</span> A HOUSEBETS ORIGINAL</span><span>Made for the slow life.<span className="footer-separator">·</span>Demo experience<span className="footer-separator">·</span>18+</span></footer>
      </main>
      <dialog ref={dialogRef} className="game-dialog" onCancel={() => setModal(null)} onClick={event => { if (event.target === event.currentTarget) setModal(null); }} aria-labelledby="dialog-title"><div className="dialog-content"><Button variant="ghost" size="icon" className="dialog-close" aria-label="Close dialog" onClick={() => setModal(null)}><X /></Button><div className="eyebrow">SLOTH’S FISHING HOLE</div><h2 id="dialog-title">{modal === 'info' ? 'A little about the lake.' : 'Make yourself comfortable.'}</h2>{modal === 'info' ? <><p>This is a free-play concept. Demo credits have no monetary value. No real bets or wallet transactions take place.</p><ol className="game-steps"><li><FishingRod />Cast your line with a demo amount.</li><li><Waves />Drift through the Lazy River as your multiplier rises.</li><li><Fish />When a fish bites, reel within one second.</li></ol><p>Missing the reaction window lets the fish escape. Reeling in time reveals a scripted demo outcome, not real casino odds.</p><Button className="dialog-primary" onClick={() => setModal(null)}>BACK TO THE LAKE</Button></> : <><div className="setting-row"><span>Game sound</span><Button variant="secondary" aria-pressed={sound} onClick={toggleSound}>{sound ? <Volume2 /> : <VolumeX />}{sound ? 'On' : 'Off'}</Button></div><div className="setting-row"><span>Ambient motion</span><Button variant="secondary" aria-pressed={motion} onClick={() => setMotion(!motion)}>{motion && <Check />}{motion ? 'On' : 'Off'}</Button></div><div className="outcome-setting"><label htmlFor="outcome-mode">Demo outcome</label><select id="outcome-mode" value={game.mode} disabled={game.locked} onChange={event => game.setMode(event.target.value as OutcomeMode)}><option value="mixed">Mixed catches</option><option value="win">Nice catch</option><option value="loss">Fish gets away</option></select></div><p>Settings apply only to this free-play session.</p></>}</div></dialog>
    </div>
  );
}
