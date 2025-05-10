import { RespError } from "./resp-error";

export const BskyProfile = ({ data }: { data: any }) => {
  return (
    <div className="flex flex-col gap-2 p-4 border rounded-md bg-white shadow-sm">
      <h2 className="font-light text-2xl">Bluesky Profile:</h2>
      { data.error ? <RespError error={data.error} /> : null }
      <h2 className="ml-4 text-gray-600">Handle: @{data.handle}</h2>
      <p className="ml-4 text-gray-600">Display: {data.displayName}</p>
      <p className="ml-4 text-gray-600">Display: {data.displayName}</p>
    </div>
  );
}