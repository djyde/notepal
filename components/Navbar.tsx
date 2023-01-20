import { Box, Group, Space, Text } from "@mantine/core";
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
      <Group sx={theme => ({
        [mq(theme, 'md')]: {
          padding: 0,
          width: 640,
          margin: '0 auto',
        }
      })}>
        <Group spacing={'xs'}>
          <Text variant="gradient" gradient={{ from: 'indigo', to: 'cyan', deg: 45 }} sx={theme => ({
            color: theme.colors.blue[7],
            // fontSize: '1.5rem',
            fontWeight: 'bold'
          })}>
            {props.logo}
          </Text>
          <Text size='sm'>by <Text underline component="a" href="https://lutaonan.com">RandySoft</Text>
          </Text>
        </Group>
        <Group sx={{
          marginLeft: 'auto'
        }}>
          <Text component="a" target={"_blank"} href="https://www.bilibili.com/video/BV1q3411d7Gj/" sx={theme => ({
            transition: 'color 0.2s ease',
            ":hover": {
              color: theme.colors.blue[7],
            }
          })}>使用教程</Text>
          <Text component="a" target={'_blank'} href="https://github.com/djyde/notepal" sx={theme => ({
            transition: 'color 0.2s ease',
            ":hover": {
              color: theme.colors.blue[7],
            }
          })}>
            源码
          </Text>
        </Group>
      </Group>
    </Box>
  )
}