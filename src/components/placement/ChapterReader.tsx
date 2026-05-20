import styles from "./placement.module.css";

function renderInline(value: string) {
  return value.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/`(.*?)`/g, "<code>$1</code>");
}

export function ChapterReader({ markdown }: { markdown: string }) {
  const html = markdown
    .split(/\r?\n/)
    .map((line) => {
      if (line.startsWith("# ")) return `<h1>${renderInline(line.slice(2))}</h1>`;
      if (line.startsWith("## ")) return `<h2>${renderInline(line.slice(3))}</h2>`;
      if (line.startsWith("### ")) return `<h3>${renderInline(line.slice(4))}</h3>`;
      if (line.startsWith("- ")) return `<li>${renderInline(line.slice(2))}</li>`;
      if (!line.trim()) return "";
      return `<p>${renderInline(line)}</p>`;
    })
    .join("")
    .replace(/(<li>.*<\/li>)/g, "<ul>$1</ul>")
    .replace(/<\/ul><ul>/g, "");

  return <article className={`${styles.panel} ${styles.reader}`} dangerouslySetInnerHTML={{ __html: html }} />;
}
