import Link from "next/link"

export default function Navbar() {
  return (
    <>
      <div className="flex items-center justify-between p-8 bg-pink-600 sm:p-4 md:p-8 sm:px-4 text-white mb-5  " >
        <Link href="/">
          <h1 className="text-xl font-bold  ">Blackhood</h1>
        </Link>
        <div className="flex gap-4 ">
          <Link href="/Home">
            <button className="text-white ">Home </button>
          </Link>
          <Link href="/Favourites">
            <button className="text-white">Favourites</button>
          </Link>
          <Link href="/YourCart">
            <button className="text-white">Cart</button>
          </Link>
          <Link href="/SignIn">
            <button className="text-white">Sign In </button>
          </Link>
        </div>
      </div></>
  )
}
