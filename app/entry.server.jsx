import { RemixServer } from '@remix-run/react'
import { renderToString } from 'react-dom/server'
import { Provider } from 'wagmi'

export default function handleRequest(
  request,
  responseStatusCode,
  responseHeaders,
  remixContext
) {
  let markup = renderToString(
    <Provider>
      <RemixServer context={remixContext} url={request.url} />
    </Provider>
  )

  responseHeaders.set('Content-Type', 'text/html')

  return new Response('<!DOCTYPE html>' + markup, {
    status: responseStatusCode,
    headers: responseHeaders,
  })
}
