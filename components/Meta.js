import Head from 'next/head'

const Meta = ({ title, description }) => {
  const appName = process.env.NEXT_PUBLIC_APP_NAME
  return (
    <Head>
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <meta name='description' content={description} />
      <meta charSet='utf-8' />
      <link rel='icon' href='/favicon.ico' />
      <title>{title ? `${title} | ${appName}` : appName}</title>
    </Head>
  )
}

Meta.defaultProps = {
  description: 'QUB3 Launchpad'
}

export default Meta
