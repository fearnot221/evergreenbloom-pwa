/**
 * 雙色反轉 (ui.fearnot.tw 39): the same words twice, the top copy inverted (sakura on ink)
 * and clipped by a diagonal at `--split`. Moving `--split` swaps the two colours across
 * the words. The base copy carries the text for assistive tech.
 */
export function SplitInvert({ text, className = '' }: { text: string; className?: string }) {
  return (
    <span className={`invert ${className}`}>
      <span className="invert-base">{text}</span>
      <span className="invert-top" aria-hidden="true">
        {text}
      </span>
    </span>
  );
}
