export function KaTeXRenderer({ expression }: { expression: string }) {
  return (
    <code
      style={{
        display: "inline-block",
        maxWidth: "100%",
        overflowX: "auto",
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 6,
        padding: "5px 8px",
        color: "#d9fbe8",
        fontFamily: "Georgia, serif",
        fontSize: 14,
      }}
    >
      {expression}
    </code>
  );
}
