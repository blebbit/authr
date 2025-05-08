import { Context } from 'hono'

import { getConfig } from '../../config'
const config = getConfig(process.env)

export async function handleAuthrWebhook(c: Context) {
  // Check if the response contains the expected signature
  const signatureHeader = c.req.header('X-Signature')

  if (!signatureHeader) {
    throw new Error('No signature header received')
  }

  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(config.webhook.secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )

  const text = await c.req.text()
  const expectedSignature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(text),
  )

  const expectedSignatureArray = Array.from(new Uint8Array(expectedSignature))
  const expectedSignatureHex = expectedSignatureArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')

  if (signatureHeader !== expectedSignatureHex) {
    throw new Error('Invalid signature')
  }

  // Parse the JSON body
  const data = JSON.parse(text)
  console.log('Received webhook data:', data)

  switch (data.event) {
    case 'oauth_session.set':
      await c.env.KV.put(data.data.key, JSON.stringify(data.data))
      console.log('Stored data in KV:', data.data.key)
      break
    case 'oauth_session.del':
      await c.env.KV.del(data.data.key)
      console.log('Removed data in KV:', data.data.key)
      break

  }

  return c.json({
    endpoint: 'webhooks.authr.handle',
    data,
    signature: signatureHeader,
  })
}