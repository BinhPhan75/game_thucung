import confetti from 'canvas-confetti';

export function celebrateStars(container?: HTMLElement | null) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  // Native dialogs live above the document canvas, so render their stars inside them.
  const canvas = container ? document.createElement('canvas') : undefined;
  if (canvas) {
    canvas.className='fairy-confetti';
    canvas.setAttribute('aria-hidden','true');
    container!.append(canvas);
  }
  const fire=canvas ? confetti.create(canvas,{resize:true}) : confetti;
  const result=fire({particleCount:65,spread:85,startVelocity:28,gravity:.8,ticks:150,
    origin:{y:.52},shapes:['star'],scalar:1.25,colors:['#ffca45','#ff82aa','#69dbc9','#b799ff','#ffffff'],
    disableForReducedMotion:true,zIndex:100});
  if (canvas) void Promise.resolve(result).finally(()=>canvas.remove());
}
