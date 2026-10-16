/**
 * A display title as an outline with a fill layer on top (空心字). Static, the fill
 * covers the outline; `inkFill()` floods it in character by character. The outline
 * carries the text for assistive tech; the fill is decoration.
 */
export function Ink({ text, className = '' }: { text: string; className?: string }) {
  return (
    <span className={`ink ${className}`}>
      <span className="ink-outline">{text}</span>
      <span className="ink-fill" aria-hidden="true">
        {text}
      </span>
    </span>
  );
}
