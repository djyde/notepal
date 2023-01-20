import { Box, Text } from "@mantine/core";
import { ReactNode } from "react";

export function Navbar(props: {
  logo: ReactNode
}) {
  return (
    <Box>
      <Box sx={theme => ({
      })}>
        <Text sx={theme => ({
          fontSize: '1.5rem',
          fontWeight: 'bold'
        })}>
          {props.logo}
        </Text>
        <Text size='sm'>by <a href="https://randysoft.com">RandySoft</a></Text>
      </Box>
    </Box>
  )
}