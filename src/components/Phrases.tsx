/**
 * CJK text split after punctuation into atomic phrases, so split-character titles break
 * between phrases ("在中央，" stays whole) instead of inside them.
 */
export function Phrases({ text }: { text: string }) {
  return text.split(/(?<=[，。、：；！？])/).map((phrase, i) => (
    // biome-ignore lint/suspicious/noArrayIndexKey: phrases are static and may repeat.
    <span className="phrase" key={i}>
      {phrase}
    </span>
  ));
}
