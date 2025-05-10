import { RespError } from "./resp-error";

export const AtprotoInfo = ({ session }: { session: any }) => {
  return (
    <div className="flex flex-col gap-2 p-4 border rounded-md bg-white shadow-sm">
      <h2 className="font-light text-2xl">Atproto Info:</h2>
      { session.error ? <RespError error={session.error} /> : null }
      <h2 className="ml-4 text-gray-600">Handle: @{session.handle}</h2>
      <p className="ml-4 text-gray-600">DID: {session.did}</p>
      <p className="ml-4 text-gray-600">PDS: {session.pds}</p>
    </div>
  );
}