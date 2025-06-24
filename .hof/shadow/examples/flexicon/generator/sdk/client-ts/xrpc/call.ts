export async function xrpcCall({
  name,
  nsid,
  method,
  payload,
  params,
  verbose = true,
}: {
  name: string,
  nsid: string,
  method: string,
  payload?: any
  params?: Record<string, string | string[]>,
  verbose?: boolean,
}) {
  if (verbose) {
    console.log(`${name}.input`, nsid, method, payload)
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
  const output = await resp.json()
  if (verbose) {
    console.log("sdk.createGroupMember.resp", output)
  }
  return output
}