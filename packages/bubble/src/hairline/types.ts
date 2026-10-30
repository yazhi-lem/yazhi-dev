/** A figure in Hairline's format: what `hairline({...})` takes in the
    hairline-create skill. `mount` draws into `svg`, listens on `stage`,
    writes its caption to `read.textContent`, and returns `set` (for the
    figure's own number, read on `range`) and `destroy`. */
export interface HairlineFigureDef {
  name: string;
  /** one sentence: what the figure shows (its accessible name) */
  means: string;
  /** the ten rules it leans on most */
  rules: number[];
  /** the figure's number at intensity 0, 0.5 and 1 */
  range: [number, number, number];
  /** viewBox points an unseen pointer visits when playing; null leaves */
  tour: ([number, number] | null)[] | null;
  mount: (
    host: { stage: HTMLElement; svg: SVGSVGElement; read: { textContent: string } },
    value: number
  ) => { set: (value: number) => void; destroy: () => void };
}
