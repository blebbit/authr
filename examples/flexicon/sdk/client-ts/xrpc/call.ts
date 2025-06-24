export async function xrpcCall({
  nsid,
  method,
  params,
  payload,
  verbose = true,
}: {
  nsid: string,
  method: string,
  params?: Record<string, string | string[]>,
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
        usp.append(key, value)
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

  const resp = await fetch(url, opts)
  // todo, check for response status and errors
  const output = await resp.json()
  if (verbose) {
    console.log(`${nsid}.output`, output)
  }
  return output
}
