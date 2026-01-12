export default function Loading()
{
    return(<>
     <div className="flex h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black" />
      <p className="ml-3 text-xl">Loading...</p>
    </div>
    </>)
}