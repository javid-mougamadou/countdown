export type CountdownEvent = {
  id: string;
  title: string;
  /** Absolute instant in ms (UTC epoch); UI uses local timezone for display/input */
  targetAtMs: number;
};
