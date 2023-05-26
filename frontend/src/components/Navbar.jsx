import React from 'react'

const Navbar = () => {
  return (
    <div className='font-inter'>
        <nav className="bg-black">
            <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4">
                <div className="flex flex-row items-center justify-center">
                    <h1 className='text-5xl mr-2 mb-1'>🎫</h1>
                    <span className="text-white text-2xl font-bold whitespace-nowrap"> Decentralized Ticket Marketplace</span>
                </div>
                <div className="flex items-center">

                    <div className="border-2 border-emerald-400 rounded-lg px-3 py-2 text-emerald-400 cursor-pointer hover:bg-emerald-400 hover:text-slate-800 focus:outline-none shadow-lg shadow-neon transition duration-800 ease-in-out">
                        Connect Wallet
                    </div>
                </div>
            </div>
        </nav>
        <nav className="bg-black">
            <div className="max-w-screen-xl px-4 py-3 mx-auto">
                <div className="flex items-center">
                    <ul className="flex flex-row font-medium mt-0 mr-6 space-x-8 text-sm">
                        <li>
                            <a href="#" className="text-gray-900 dark:text-white hover:underline" aria-current="page">View events</a>
                        </li>
                        <li>
                            <a href="#" className="text-gray-900 dark:text-white hover:underline">Create event</a>
                        </li>
                        <li>
                            <a href="#" className="text-gray-900 dark:text-white hover:underline">My purchased tickets</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </div>

  )
}

export default Navbar