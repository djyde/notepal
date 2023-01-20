import { MantineTheme } from "@mantine/core";

export function mq(theme: MantineTheme, size: 'sx' | 'sm' | 'md' | 'lg' | 'xl') {
  return `@media (min-width: ${theme.breakpoints[size]}px)`
}

