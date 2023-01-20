import { Accordion, Blockquote, Box, Button, Center, Group, MantineTheme, Paper, Stack, Text, Textarea } from "@mantine/core";
import React from "react";
import { Note } from "../parsers/model";
import { parseWXRead } from "../parsers/wxRead";
import { flatMap, groupBy } from 'lodash'
import { transform } from '../templates'
import { useClipboard } from '@mantine/hooks'
import { openModal } from "@mantine/modals";
export function mq(theme: MantineTheme, size: 'sx' | 'sm' | 'md' | 'lg' | 'xl') {
  return `@media (min-width: ${theme.breakpoints[size]}px)`
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
      placeholder: "微信读书"
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
          marginTop: 200
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
                <Button key={sourceId} onClick={_ => void onSelectImportSource(sourceId)} variant={isSelected ? 'outline' : 'default'} size='md'>{sourceItem.title}</Button>
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
                  const note = transform(notes, 'readwiseCSV')
                  openModal({
                    title: '导出到 Readwise CSV',
                    children: (
                      <Stack>
                        <Textarea value={note} autosize>
                        </Textarea>
                        <Button onClick={_ => {
                          clipboard.copy(note)
                          alert('已复制到剪贴板')
                        }}>复制</Button>
                      </Stack>
                    )
                  })
                }} variant='default'>Readwise CSV</Button>
                <Button variant='default'>自定义格式</Button>
              </Group>
            </Stack>}
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