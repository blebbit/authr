import { Variable } from "lucide-react"
import { cn } from "./lib/utils"

export const Fofx = ()=>{
  return(<span className="flex items-center ml-[-7px]">f<Variable size={18}/></span>)
}

export const Blebbit = ({at, className}: {at?: boolean, className?:string}) => {
  return (
    <span className={className}>
      { at ? <span className="text-atproto-blue">@</span> : null }
      <span className="text-brat-green">blebbit</span>
    </span>)
}

export const AtpBsky = (props: any) => {
  return (
    <span className="flex gap-2">
      <AtProtocol {...props}/> | <Bluesky {...props}/>
    </span>
  )
}

export const Bluesky = ({at, className}: {at?: boolean, className?:string}) => {
  return (
    <span className={cn("flex flex-row", className)}>
      { at ? <BlueskyButterfly className="mr-0"/> : null }
      <span className="ml-[4px] mr-2">Bluesky</span>
    </span>
  )
}

export const AtProtocol = ({at, className}: {at?: boolean, className?:string}) => {
  return (
    <span className={cn("flex",className)}>
      { at ? <span className="text-blue-500 font-semibold">@</span> : null }
      <span className="text-blue-500">AT</span>
      Protocol
    </span>)
}

export const AtSpace = ({at, className}: {at?: boolean, className?:string}) => {
  return (
    <span className={className}>
      { at ? <span className="text-atproto-blue">@</span> : null }
      <span className="text-brat-green">at</span>
      space
    </span>)
}

export const At_ = ({text, className}: {text: string, className?:string}) => {
  return (
    <span className={className}>
      <span className="text-atproto-blue">@</span>
      {text}
    </span>)
}

export function BlueskyButterfly({ className }: { className?: string }) {
  return (
    <img
      src="/bluesky.svg"
      width={16}
      height={16}
      alt="verdverm"
      className={cn(
        className
      )}
      style={{color: "linear-gradient(rgb(18, 133, 254) 0px, rgb(0, 101, 207))"}}
    />
  )
}
