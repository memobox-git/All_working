import { CopyButton } from "./copy-button";

// Monochrome syntax highlighting: keywords bold white, strings grey, comments dim italic, numbers underlined.
// Small and dependency-free; good enough for SQL, Python, DAX, Power Query M, bash, JS/TS and Tableau calcs.

const KEYWORDS: Record<string, string[]> = {
  sql: "select from where group by order having join left right inner outer full cross on as and or not in is null like between case when then else end with union all distinct insert into values update set delete create table view index drop alter add primary key foreign references limit offset over partition rows range preceding following current row qualify exists asc desc count sum avg min max coalesce cast row_number rank dense_rank lag lead first_value last_value ntile merge using matched truncate grant revoke begin commit rollback recursive interval date extract ilike unnest lateral returning default constraint unique check".split(" "),
  python: "def return if elif else for while in not and or is None True False import from as class try except finally raise with lambda yield pass break continue global nonlocal assert async await self print len range dict list set tuple str int float bool open".split(" "),
  dax: "VAR RETURN CALCULATE FILTER ALL ALLEXCEPT SUM SUMX COUNT COUNTROWS DISTINCTCOUNT AVERAGE AVERAGEX DIVIDE IF SWITCH TRUE FALSE RELATED RELATEDTABLE DATEADD SAMEPERIODLASTYEAR TOTALYTD DATESYTD BLANK ISBLANK VALUES SELECTEDVALUE MAX MIN MAXX MINX RANKX TOPN USERELATIONSHIP KEEPFILTERS REMOVEFILTERS FORMAT YEAR MONTH DAY TODAY NOW AND OR NOT IN".split(" "),
  m: "let in each if then else type table list record true false null try otherwise".split(" "),
  bash: "sudo cd ls mkdir rm cp mv echo export source pip python spark-submit docker kubectl git npm npx curl if then fi for do done".split(" "),
  js: "const let var function return if else for while import from export default async await new class extends this null undefined true false try catch throw typeof".split(" "),
  tableau: "IF THEN ELSE ELSEIF END CASE WHEN AND OR NOT FIXED INCLUDE EXCLUDE SUM AVG COUNT COUNTD MIN MAX ATTR WINDOW_SUM WINDOW_AVG RUNNING_SUM RANK INDEX LOOKUP DATEDIFF DATEADD DATETRUNC DATEPART TODAY ZN IFNULL ISNULL LEFT RIGHT MID CONTAINS TOTAL SIZE FIRST LAST".split(" "),
};

const ALIAS: Record<string, keyof typeof KEYWORDS> = {
  sql: "sql", postgres: "sql", postgresql: "sql", mysql: "sql", snowflake: "sql", sparksql: "sql",
  python: "python", py: "python", pyspark: "python",
  dax: "dax", "powerquery-m": "m", m: "m", powerquery: "m",
  bash: "bash", shell: "bash", sh: "bash", zsh: "bash",
  js: "js", javascript: "js", ts: "js", typescript: "js", json: "js",
  tableau: "tableau",
};

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function highlight(code: string, language = "text"): string {
  const lang = ALIAS[language.toLowerCase()];
  if (!lang) return esc(code);
  const caseInsensitive = lang === "sql" || lang === "dax" || lang === "tableau";
  const kw = new Set(KEYWORDS[lang].map((k) => (caseInsensitive ? k.toLowerCase() : k)));
  const comment = lang === "python" || lang === "bash" ? "#[^\\n]*" : lang === "m" || lang === "js" || lang === "dax" ? "//[^\\n]*|/\\*[\\s\\S]*?\\*/" : "--[^\\n]*|/\\*[\\s\\S]*?\\*/|//[^\\n]*";
  const re = new RegExp(`(${comment})|("(?:[^"\\\\\\n]|\\\\.)*"|'(?:[^'\\\\\\n]|\\\\.)*'|\`[^\`]*\`)|(\\b\\d+(?:\\.\\d+)?\\b)|([A-Za-z_][A-Za-z0-9_]*)`, "g");
  let out = "";
  let last = 0;
  for (const m of code.matchAll(re)) {
    out += esc(code.slice(last, m.index));
    const [tok, c, s, n, w] = m;
    if (c) out += `<span class="tok-c">${esc(c)}</span>`;
    else if (s) out += `<span class="tok-s">${esc(s)}</span>`;
    else if (n) out += `<span class="tok-n">${n}</span>`;
    else if (w && kw.has(caseInsensitive ? w.toLowerCase() : w)) out += `<span class="tok-k">${esc(w)}</span>`;
    else out += esc(tok);
    last = (m.index ?? 0) + tok.length;
  }
  return out + esc(code.slice(last));
}

export function CodeBlock({
  code,
  language = "text",
  filename,
  lineNumbers = false,
  className = "",
}: {
  code: string;
  language?: string;
  filename?: string;
  lineNumbers?: boolean;
  className?: string;
}) {
  const html = highlight(code.replace(/\s+$/, ""), language);
  const lines = html.split("\n");
  return (
    <figure className={`code-win on-night not-prose ${className}`}>
      <figcaption className="flex items-center justify-between gap-3 border-b border-night-line pl-4 pr-1.5">
        <span className="flex items-center gap-2 py-2.5 font-mono text-[12px] text-paper/90">
          <span className="h-1.5 w-1.5 rounded-full bg-paper/70" aria-hidden="true" />
          {filename ?? language}
        </span>
        <CopyButton />
      </figcaption>
      <pre>
        <code>
          {lineNumbers
            ? lines.map((l, i) => (
                <span key={i} className="table-row">
                  <span className="table-cell select-none pr-4 text-right text-[#5a5a54]" aria-hidden="true">{i + 1}</span>
                  <span className="table-cell" data-line="" dangerouslySetInnerHTML={{ __html: l || " " }} />
                </span>
              ))
            : <span dangerouslySetInnerHTML={{ __html: html }} />}
        </code>
      </pre>
    </figure>
  );
}
