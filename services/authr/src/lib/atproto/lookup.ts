export async function lookupDID(handle: string) {
  try {
    const url = "https://1.1.1.1/dns-query?name=_atproto." + handle + "&type=TXT"
    const response = await fetch(url,{
      headers: {
        accept: "application/dns-json"
      }
    })
    const data = await response.json()
    // console.log(data)
    let did = data.Answer[0].data as string
    did = did.replaceAll('"', '')
    return did.substring(4)
  } catch(err) {
    console.log("DNS lookup handle err:", err)
    return null
  }
}

export async function lookupDOC(did: string) {
  try {
    const url = "https://plc.blebbit.dev/" + did
    const response = await fetch(url,{
      headers: {
        accept: "application/dns-json"
      }
    })
    const data = await response.json()
    return data
  } catch(err) {
    console.log("DID Doc lookup err:", err)
    return null
  }
}

export async function lookupInfo(didOrHandle: string) {
  try {
    const url = "https://plc.blebbit.dev/info/" + didOrHandle
    const response = await fetch(url,{
      headers: {
        accept: "application/json"
      }
    })
    const data = await response.json()
    return data
  } catch(err) {
    console.log("account info lookup err:", err)
    return null
  }
}