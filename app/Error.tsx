"use client"
export default function Error({error, reset}: {error: Error, reset:()=>void})
{
    return(<>
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold text-red-600">Something went wrong!</h1>
      <p>{error.message}</p>
      <button onClick={reset} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Try Again
      </button>
    </div>
    </>)
}