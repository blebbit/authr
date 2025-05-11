
import config from '@/config'

export async function sendEvent(
  event: string,
  data: Record<string, unknown>,
): Promise<void> {
  const url = config.webhook.url
  const secret = config.webhook.secret

  const body = JSON.stringify({
    event,
    data,
  })

  if (!url || !secret) {
    console.warn('Webhook URL or secret not configured, skipping event sending')
    return
  }

  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  console.log('Webhook Key:', key)

  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(body),
  )

  const signatureArray = Array.from(new Uint8Array(signature))
  const signatureHex = signatureArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Signature': signatureHex,
    },
    body,
  })

  if (!response.ok) {
    throw new Error(`Failed to send event: ${response.statusText}`)
  }

  const responseBody = await response.json()
  console.log('Event sent successfully:', responseBody)
}