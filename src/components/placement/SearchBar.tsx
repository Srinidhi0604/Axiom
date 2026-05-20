"use client";

import styles from "./placement.module.css";

export function SearchBar({ value, onChange, placeholder = "Search problems, topics, companies" }: { value: string; onChange: (value: string) => void; placeholder?: string }) {
  return <input className={styles.search} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />;
}
