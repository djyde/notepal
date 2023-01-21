import { Box, Container, Group, Paper, Space, Stack, Text, Title } from "@mantine/core";
import { openModal } from "@mantine/modals";
import Image from "next/image";
import { ReactNode } from "react";
import { mq } from "../utils";
import wxgroupImage from '../public/wxgroup.jpg'
import Link from "next/link";

export function Navbar(props: {
  logo: ReactNode
}) {
  return (
    <Box sx={theme => ({
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.md,
      borderBottom: `1px solid ${theme.colors.gray[8]}`,
    })}>
      <Container>
        <Group sx={theme => ({

        })}>
          <Group spacing={'xs'}>
            <Text variant="gradient" gradient={{ from: 'indigo', to: 'cyan', deg: 45 }} sx={theme => ({
              color: theme.colors.blue[7],
              // fontSize: '1.5rem',
              fontWeight: 'bold'
            })}>
              <Link href="/">
                {props.logo}
              </Link>
            </Text>
            <Text size='sm'>by <Text underline component="a" href="https://lutaonan.com">RandySoft</Text>
            </Text>
          </Group>
          <Group sx={{
            marginLeft: 'auto'
          }}>
            <Link style={{ color: 'inherit', textDecoration: 'none' }} href="/doc">
              <Text component="a" target={"_blank"} href="https://www.bilibili.com/video/BV1q3411d7Gj/" sx={theme => ({
                transition: 'color 0.2s ease',
                ":hover": {
                  color: theme.colors.blue[7],
                }
              })}>
                使用教程
              </Text>
            </Link>
            <Text component="a" target={'_blank'} href="https://github.com/djyde/notepal" sx={theme => ({
              transition: 'color 0.2s ease',
              ":hover": {
                color: theme.colors.blue[7],
              }
            })}>
              源码
            </Text>
            <Text sx={{
              cursor: 'pointer'
            }} onClick={_ => {
              openModal({
                // title: '反馈',
                centered: true,
                children: (
                  <Box>
                    <Stack align={'start'}>
                      <Text>如果你有需求提议，欢迎加入群组反馈。</Text>
                      <Title order={4}>Telegram 群组</Title>
                      <Text component="a" href="https://t.me/+a7YMH3l8AFYzMDll">https://t.me/+a7YMH3l8AFYzMDll</Text>
                      <Title order={4}>微信群组</Title>
                      <Image width={256} height={256} alt="微信群二维码" src={wxgroupImage} />
                    </Stack>
                  </Box>
                )
              })
            }}>
              反馈
            </Text>
          </Group>
        </Group>
      </Container>

    </Box>
  )
}