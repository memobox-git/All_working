import { IsoScene, IsoLabel, IsoLine, above, type IsoBox } from "./iso";

// Isometric scenes used across the site. All black and white, all from components/iso.tsx.

// Three sessions a week on one platform.
export function IsoSchedule({ className = "" }: { className?: string }) {
  const boxes: IsoBox[] = [
    { x: 0, y: 0, w: 260, d: 120, h: 10, tone: "white" },
    { x: 20, y: 30, w: 60, d: 60, h: 40, tone: "white" },
    { x: 100, y: 30, w: 60, d: 60, h: 70, tone: "hatch" },
    { x: 180, y: 30, w: 60, d: 60, h: 40, tone: "white" },
  ];
  return (
    <IsoScene boxes={boxes} className={className} title="Three live sessions a week">
      <IsoLabel at={above(boxes[1])}>Mon</IsoLabel>
      <IsoLabel at={above(boxes[2])}>Wed</IsoLabel>
      <IsoLabel at={above(boxes[3])}>Fri</IsoLabel>
    </IsoScene>
  );
}

// Bronze, silver, gold: a pipeline you build.
export function IsoPipeline({ className = "" }: { className?: string }) {
  const boxes: IsoBox[] = [
    { x: 0, y: 0, w: 300, d: 110, h: 8, tone: "white" },
    { x: 18, y: 28, w: 56, d: 56, h: 36, tone: "ghost" },
    { x: 122, y: 28, w: 56, d: 56, h: 52, tone: "white" },
    { x: 226, y: 28, w: 56, d: 56, h: 72, tone: "ink" },
  ];
  return (
    <IsoScene boxes={boxes} className={className} title="A bronze, silver and gold data pipeline">
      <IsoLine from={[74, 56, 26]} to={[122, 56, 26]} />
      <IsoLine from={[178, 56, 34]} to={[226, 56, 34]} />
      <IsoLabel at={above(boxes[1])}>Bronze</IsoLabel>
      <IsoLabel at={above(boxes[2])}>Silver</IsoLabel>
      <IsoLabel at={above(boxes[3])}>Gold</IsoLabel>
    </IsoScene>
  );
}

// Interview rounds as bars that rise, with the last one hatched.
export function IsoRounds({ className = "" }: { className?: string }) {
  const hs = [28, 44, 60, 84];
  const boxes: IsoBox[] = [{ x: 0, y: 0, w: 250, d: 90, h: 8, tone: "white" }, ...hs.map((h, i) => ({ x: 16 + i * 58, y: 22, w: 42, d: 46, h, tone: (i === 3 ? "hatch" : "white") as IsoBox["tone"] }))];
  return (
    <IsoScene boxes={boxes} className={className} title="Mock interview rounds">
      {hs.map((_, i) => (
        <IsoLabel key={i} at={above(boxes[i + 1])}>{`R${i + 1}`}</IsoLabel>
      ))}
    </IsoScene>
  );
}

// Resume, LinkedIn and referrals stacked into one profile.
export function IsoStack({ className = "", labels = ["Resume", "LinkedIn", "Referrals"] }: { className?: string; labels?: string[] }) {
  const boxes: IsoBox[] = labels.map((_, i) => ({ x: 0, y: 0, z: i * 34, w: 170, d: 170, h: 24, tone: (i === labels.length - 1 ? "white" : "fill") as IsoBox["tone"] }));
  return (
    <IsoScene boxes={boxes} className={className} title="A stack of resume, LinkedIn and referrals">
      {labels.map((l, i) => (
        <IsoLabel key={l} at={[170, 175, i * 34 + 6]} anchor="start">{l}</IsoLabel>
      ))}
    </IsoScene>
  );
}

// A hub with four tools around it.
export function IsoHub({ className = "", tools = ["SQL", "Python", "Spark", "Airflow"], center = "You" }: { className?: string; tools?: string[]; center?: string }) {
  const pos: [number, number][] = [
    [0, 110],
    [110, 0],
    [220, 110],
    [110, 220],
  ];
  const boxes: IsoBox[] = [
    { x: 90, y: 90, w: 80, d: 80, h: 46, tone: "white" },
    ...pos.map(([x, y]) => ({ x, y, w: 40, d: 40, h: 40, tone: "ghost" as const })),
  ];
  return (
    <IsoScene boxes={boxes} className={className} title={`${tools.join(", ")} around ${center}`}>
      {pos.map(([x, y], i) => (
        <IsoLine key={i} from={[x + 20, y + 20, 0]} to={[130, 130, 0]} />
      ))}
      <IsoLabel at={above(boxes[0])}>{center}</IsoLabel>
      {pos.map((_, i) => (
        <IsoLabel key={tools[i]} at={above(boxes[i + 1])}>{tools[i]}</IsoLabel>
      ))}
    </IsoScene>
  );
}

// The Stackle mark as three stacked slabs, like a rack.
export function IsoSlabs({ className = "" }: { className?: string }) {
  const boxes: IsoBox[] = [
    { x: 0, y: 0, z: 0, w: 200, d: 200, h: 26, tone: "fill" },
    { x: 0, y: 0, z: 40, w: 200, d: 200, h: 26, tone: "fill" },
    { x: 0, y: 0, z: 80, w: 200, d: 200, h: 26, tone: "white" },
    { x: 70, y: 70, z: 106, w: 60, d: 60, h: 14, tone: "ink" },
  ];
  return <IsoScene boxes={boxes} className={className} title="Three stacked layers" />;
}
