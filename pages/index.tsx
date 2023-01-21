import { Accordion, Blockquote, Box, Button, Center, CopyButton, Divider, Group, MantineTheme, Paper, Stack, Text, Textarea, Title } from "@mantine/core";
import React, { useMemo } from "react";
import { Note } from "../parsers/model";
import { parseWXRead, wxReadPlaceholder } from "../parsers/wxRead";
import { flatMap, groupBy } from 'lodash'
import { transformNote } from '../templates'
import { useClipboard } from '@mantine/hooks'
import { openModal } from "@mantine/modals";
import { Navbar } from "../components/Navbar";
import { downloadText, mq } from "../utils";
import Script from "next/script";
import { readwiseCSV } from "../templates/readwiseCSV";
import Link from "next/link";
declare var umami: any

function track(eventName: string) {
  if (umami) {
    umami(eventName)
  }
}

export default function Page() {

  const [selecteImportSourceId, setSelecteImportSourceId] = React.useState<string | null>(null)
  const [notes, setNotes] = React.useState<Note[]>([])

  const clipboard = useClipboard({
    timeout: 500
  })

  const groupedByBookName = React.useMemo(() => {
    console.log('recompute', 'groupedByBookName')
    return groupBy(notes, note => note.bookName)
  }, [notes])

  const importSource = {
    wxRead: {
      title: '微信读书',
      parser: parseWXRead,
      placeholder: wxReadPlaceholder
    },
  } as Record<string, {
    title: string,
    parser: (content: string) => Note,
    placeholder?: string
  }>

  function onSelectImportSource(source: string) {
    setSelecteImportSourceId(source)
  }

  return (
    <div>
      <Script data-website-id="ab77355d-e75e-49e9-aa22-acf5c3096d94" src="https://a.taonan.lu/ana.js" />
      <Box sx={theme => ({
      })}>
        <Navbar logo="NotePal" />
      </Box>
      <Box sx={theme => ({
      })}>
        {/* <Text sx={theme => ({
          fontSize: '4rem',
        })}>
          NotePal
        </Text> */}
      </Box>
      <Box sx={theme => ({
        padding: theme.spacing.md,
        [mq(theme, 'md')]: {
          padding: 0,
          width: 640,
          margin: '0 auto',
          marginTop: 100,
          marginBottom: 200
        }
      })}>
        <Stack>
          <Text weight={'bold'}>
            导入笔记
          </Text>
          <Group>
            {Object.keys(importSource).map(sourceId => {
              const sourceItem = importSource[sourceId]
              const isSelected = selecteImportSourceId === sourceId
              return (
                <Button key={sourceId} onClick={_ => void onSelectImportSource(sourceId)} variant={isSelected ? 'light' : 'default'} size='md'>{sourceItem.title}</Button>
              )
            })}
          </Group>

          {selecteImportSourceId && <ImportForm key={selecteImportSourceId} onSuccess={note => {
            setNotes([...notes, note])
            setSelecteImportSourceId(null)
          }} parser={importSource[selecteImportSourceId].parser} placeholder={importSource[selecteImportSourceId].placeholder} />}

          {notes.length > 0 && <Text>
            已导入笔记
          </Text>}

          <Box>
            {Object.keys(groupedByBookName).map(bookName => {
              const notes = flatMap(groupedByBookName[bookName], book => book.children)
              return (
                <Accordion variant='contained' key={bookName}>
                  <Accordion.Item value={bookName}>
                    <Accordion.Control>{bookName}</Accordion.Control>
                    <Accordion.Panel>
                      {notes.map(note => {
                        return (
                          <Paper shadow="xs">
                            <Blockquote sx={theme => ({
                              fontSize: theme.fontSizes.sm,
                            })} cite={note.sideNote}>
                              {note.highlight}
                            </Blockquote>
                          </Paper>
                        )
                      })}
                    </Accordion.Panel>
                  </Accordion.Item>
                </Accordion>
              )
            })}
          </Box>

          {notes.length > 0 &&
            <Stack>
              <Text>导出</Text>
              <Group>
                <Button color={clipboard.copied ? 'teal' : undefined} onClick={_ => {
                  // should be moved to a function outside
                  const note = transformNote(notes, 'readwiseCSV', false)
                  openModal({
                    title: '导出到 Readwise CSV',
                    children: (
                      <Stack>
                        <Textarea value={note} autosize>
                        </Textarea>
                        <Group grow>
                          <Button variant="default" onClick={_ => {
                            clipboard.copy(note)
                            track('copy readwise csv')
                            alert('已复制到剪贴板')
                          }}>复制</Button>
                          <Button onClick={_ => {
                            downloadText('readwise.csv', note)
                            track('download readwise csv')
                          }}>
                            下载 .csv
                          </Button>
                        </Group>
                      </Stack>
                    )
                  })
                }} variant='default'>Readwise CSV</Button>
                <Button variant='default' onClick={_ => {
                  openModal({
                    size: '50%',
                    centered: true,
                    title: '自定义格式导出',
                    children: (
                      <Box>
                        <TemplateRender notes={notes} />
                      </Box>
                    )
                  })
                }}>自定义格式</Button>
              </Group>
            </Stack>}
        </Stack>

        <Divider sx={theme => ({
          marginTop: 200,
          marginBottom: theme.spacing.md
        })} label="常见问题" labelPosition="center" />
        <Stack sx={{
        }}>
          <QA />
        </Stack>
      </Box>
    </div>
  )
}

function ImportForm(props: {
  parser: (content: string) => Note,
  placeholder?: string,
  onSuccess?: (note: Note) => void
}) {
  const [note, setNote] = React.useState("")

  function onClickTransform() {
    if (note) {
      const result = props.parser(note)
      props.onSuccess && props.onSuccess(result)
    }
  }

  return (
    <Stack>
      <Textarea onChange={e => setNote(e.target.value)} placeholder={props.placeholder} minRows={20} sx={theme => ({
        width: '100%'
      })} />
      <Button onClick={onClickTransform} sx={theme => ({
      })}>添加笔记</Button>
    </Stack>
  )
}

function TemplateRender(props: {
  notes: Note[]
}) {
  const [templateString, setTemplateString] = React.useState(readwiseCSV)
  const clipboard = useClipboard()
  const result = useMemo(() => {
    if (!templateString) {
      return ""
    }
    return transformNote(props.notes, templateString, true)
  }, [templateString])

  return (
    <Stack>
      <Text size="sm">
        可使用 nunjucks 模板语法: <Link href="/doc" target={"_blank"}>
          使用文档
        </Link>
      </Text>
      <Group grow>
        <Textarea spellCheck={false} minRows={22} defaultValue={templateString} onChange={_ => {
          setTemplateString(_.target.value)
        }}></Textarea>
        <Stack>
          <Textarea spellCheck={false} disabled minRows={20} value={result}></Textarea>
          <CopyButton value={result}>
            {({ copied, copy }) => (
              <Button color={copied ? 'green' : 'blue'} onClick={copy}>{copied ? '已复制' : '复制'}</Button>
            )}
          </CopyButton>
        </Stack>
      </Group>
    </Stack>
  )
}

const qa = [
  {
    q: '我的笔记会被上传到服务器吗？',
    a: '不会。'
  }
]
function QA() {
  return (
    <Accordion variant='contained'>
      {qa.map(item => {
        return (
          <Accordion.Item value={item.q}>
            <Accordion.Control>{item.q}</Accordion.Control>
            <Accordion.Panel>{item.a}</Accordion.Panel>
          </Accordion.Item>
        )
      })}
    </Accordion>
  )
}