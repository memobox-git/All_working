import { Row, SectionHead } from "@/components/row";

export default function Home() {
  return (
    <>
      <Row n="01" tone="white">
        <p className="t-mono pad py-5 text-center">Scaffold check</p>
      </Row>
      <Row n="02">
        <div className="pad sec">
          <SectionHead as="h1" title={<>Skills that get you <span className="t-pixel">hired.</span></>} lede="Frame, fonts and chrome check." />
        </div>
      </Row>
    </>
  );
}
