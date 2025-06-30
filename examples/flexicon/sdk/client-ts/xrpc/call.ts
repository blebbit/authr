export async function xrpcCall({
  nsid,
  method,
  params,
  payload,
  verbose = false,
}: {
  nsid: string,
  method: string,
  params?: any,
  payload?: any
  verbose?: boolean,
}) {
  if (verbose) {
    console.log(`${nsid}.input`, params, payload)
  }

  var path = `/xrpc/${nsid}`

  if (params) {
    const usp = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(item => usp.append(key, item))
      } else {
        usp.append(key, value as string)
      }
    })
    path += `?${usp.toString()}`
  }
  const url = `${import.meta.env.VITE_XRPC_HOST}${path}`

  var opts = { 
    method,
    credentials: 'include', 
  }
  if (payload) {
    opts["body"] = JSON.stringify(payload)
  }

  const resp = await fetch(url, opts as any)

  if (verbose) {
    console.log(`${nsid}.response`, resp.status, resp.statusText, resp.headers.get("content-type"))
  }

  // check for errors and format better
  if (resp.status >= 400) {
    console.error("Error in xrpcCall:", resp.statusText);
    throw new Error(`Failed to call ${method} ${nsid}: ${resp.statusText}`);
  }

  if (!resp.ok) {
    const errorText = await resp.text()
    throw new Error(`Failed to call ${method} ${nsid}: ${resp.status} ${resp.statusText} - ${errorText}`)
  }

  const output = await resp.json()
  if (verbose) {
    console.log(`${nsid}.output`, output)
  }
  return output
}
