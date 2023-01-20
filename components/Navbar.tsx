import { Box, Group, Text } from "@mantine/core";
import { ReactNode } from "react";
import { mq } from "../utils";

export function Navbar(props: {
  logo: ReactNode
}) {
  return (
    <Box sx={theme => ({
      padding: theme.spacing.md,
      borderBottom: `1px solid ${theme.colors.gray[8]}`,
    })}>
      <Group spacing={'xs'} sx={theme => ({
        [mq(theme, 'md')]: {
          padding: 0,
          width: 640,
          margin: '0 auto',
        }
      })}>
        <Text variant="gradient" gradient={{ from: 'indigo', to: 'cyan', deg: 45 }} sx={theme => ({
          color: theme.colors.blue[7],
          // fontSize: '1.5rem',
          fontWeight: 'bold'
        })}>
          {props.logo}
        </Text>
        <Text size='sm'>by <Text underline component="a" href="https://twitter.com/randyloop">RandySoft</Text>
        </Text>
      </Group>
    </Box>
  )
}