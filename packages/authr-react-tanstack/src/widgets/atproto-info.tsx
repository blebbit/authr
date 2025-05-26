import { RespError } from "./resp-error";
import { useAuthr } from '../provider';

export const AtprotoInfo = () => {
  const authr = useAuthr();
  const session = authr.sessions.current

  return (
    <div className="flex flex-col gap-2">
      <h2 className="font-light text-2xl">Atproto Info:</h2>
      <h2 className="ml-2 text-gray-600">Handle: @{session.handle}</h2>
      <p className="ml-2 text-gray-600">DID: {session.did}</p>
      <p className="ml-2 text-gray-600">PDS: {session.pds}</p>
      { session.error ? <RespError error={session.error} /> : null }
    </div>
  );
}