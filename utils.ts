import { MantineTheme } from "@mantine/core";

export function mq(
  theme: MantineTheme,
  size: "sx" | "sm" | "md" | "lg" | "xl"
) {
  return `@media (min-width: ${theme.breakpoints[size]}px)`;
}

export function downloadText(filename: string, data: string) {
  const blob = new Blob([data], { type: "text/csv" });
  const elem = window.document.createElement("a");
  elem.href = window.URL.createObjectURL(blob);
  elem.download = filename;
  document.body.appendChild(elem);
  elem.click();
  document.body.removeChild(elem);
}
