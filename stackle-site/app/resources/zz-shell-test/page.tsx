import { ResourceHero, ResourceCta } from "@/components/resources/resource-shell";
import { Row } from "@/components/row";
import { CodeBlock } from "@/components/code-block";
import { Accordion } from "@/components/accordion";

export default function Page() {
  return (
    <>
      <ResourceHero category="Interview Prep" title="295 SQL interview" second="questions, answered." summary="From basic queries to window functions and optimisation." meta={[{ label: "Questions", value: "295" }, { label: "Categories", value: "21" }, { label: "Practical", value: "89%" }, { label: "Levels", value: "3" }]} />
      <Row n="03">
        <div className="pad sec grid gap-8 md:grid-cols-2">
          <CodeBlock language="sql" filename="second_highest.sql" lineNumbers code={"-- second highest salary\nSELECT MAX(salary) AS second_highest\nFROM employees\nWHERE salary < (SELECT MAX(salary) FROM employees);"} />
          <Accordion items={[{ q: "What is the difference between WHERE and HAVING?", a: "WHERE filters rows before grouping; HAVING filters groups after aggregation." }, { q: "Find duplicate emails", a: "GROUP BY email HAVING COUNT(*) > 1." }]} />
        </div>
      </Row>
      <ResourceCta n="04" />
    </>
  );
}
