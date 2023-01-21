import { Container, Paper, TypographyStylesProvider } from '@mantine/core'
import ReactMarkdown from 'react-markdown'
import { Navbar } from '../components/Navbar'
// @ts-expect-error
import DOC from 'raw-loader!../static/doc.md'

export default function Page() {
  return (
    <>
      <Navbar logo="NotePal" />
      <Container sx={{
        marginBottom: 200
      }}>
        <TypographyStylesProvider>
          <ReactMarkdown>{DOC}</ReactMarkdown>
        </TypographyStylesProvider>
      </Container>
    </>
  )
}