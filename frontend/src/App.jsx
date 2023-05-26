import { useState, useEffect } from 'react'
import truncateEthAddress from 'truncate-eth-address';
import { connectWallet, checkIfWalletIsConnected, createEvent } from './utils'

const App = () => {
  const [walletAddress, setWalletAddress] = useState("")
  const [isWalletConnected, setIsWalletConnected] = useState(false)

  const [showCreateEventModal, setShowCreateEventModal] = useState(false)

  const [inputValue, setInputValue] = useState({
    name: "",
    description: "",
    ticketPrice: 0,
    totalTickets: 0
  });

  const handleInputChange = (event) => {
    setInputValue(prevFormData => ({ ...prevFormData, [event.target.name]: event.target.value }));
  } 

  const connectWalletButton = async () => {
    try {
      const address = await connectWallet();
      setWalletAddress(address)
      setIsWalletConnected(checkIfWalletIsConnected())
    } catch (error) {
      alert(error)
    }
  }

  const createEventButton = async (event) => {
    event.preventDefault();
    
    try {
      if (!inputValue.name || !inputValue.description || !inputValue.ticketPrice || !inputValue.totalTickets) {
        alert("Please fill in all of the required fields")
      } else {
        const success = await createEvent(inputValue.name, inputValue.description, inputValue.ticketPrice, inputValue.totalTickets);
        if (success) {
            alert('Event successfully created');
        } else {
            alert('Error creating event');
        }
      }

    } catch (error) {
      alert(error)
    }
  }

  const toggleCreateEventModal = () => {
    setShowCreateEventModal(!showCreateEventModal);
  };

  useEffect(() => {
    connectWalletButton()
  }, [])
  

  return (
    <div className='bg-black min-h-screen font-inter'>
      <div className='font-inter'>
        <nav className="bg-black">
            <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4">
                <div className="flex flex-row items-center justify-center">
                    <h1 className='text-5xl mr-2 mb-1'>🎫</h1>
                    <span className="text-white text-2xl font-extrabold whitespace-nowrap"> Decentralized Ticket Marketplace</span>
                </div>
                <div className="flex items-center">

                    {isWalletConnected ? (
                      <h1 className='text-white'>{truncateEthAddress(walletAddress)}</h1>
                    ) : (
                      <button onClick={connectWalletButton} className="rounded-lg px-3 py-2 cursor-pointer bg-yellow-400 text-black hover:animate-pulse focus:outline-none shadow-lg shadow-neon transition duration-800 ease-in-out">
                        Connect Wallet
                      </button>
                    )}
                </div>
            </div>
        </nav>
        <nav className="bg-black">
            <div className="max-w-screen-xl px-4 py-3 mx-auto">
                <div className="flex items-center">
                    <ul className="flex flex-row font-medium mt-0 mr-6 space-x-8 text-sm hover:text-yellow-400">
                        <li>
                            <button className="text-gray-900 dark:text-white hover:underline">
                              View events
                            </button>
                        </li>
                        <li>
                            <button onClick={toggleCreateEventModal} className="text-gray-900 dark:text-white hover:underline">
                              Create event
                            </button>
                        </li>
                            <button className="text-gray-900 dark:text-white hover:underline">
                              My purchased tickets
                          </button>
                    </ul>
                </div>
            </div>
        </nav>
      </div>

      {showCreateEventModal && (
        <div className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-black bg-opacity-50">
          <h1 className='text-white text-4xl font-extrabold mb-5'>Create an event</h1>
            <form className="mx-auto">
                <label className='font-bold text-white'>
                    Name of event
                </label>
                <input  
                    type="text" 
                    onChange={handleInputChange}
                    className="border border-gray-400 p-2 rounded-md w-full outline-none mb-5" 
                    placeholder="Eth Global Hackathon"
                    name="name"
                    value={inputValue.name}
                />

                <label className='font-bold text-white'>
                    Description
                </label>
                <input  
                    type="text" 
                    onChange={handleInputChange}
                    className="border border-gray-400 p-2 rounded-md w-full outline-none mb-5" 
                    placeholder="blah blah blah..."
                    name="description"
                    value={inputValue.description}
                />

                <label className='font-bold text-white mt-2'>
                    Ticket price - price for each individual ticket in ether
                </label>
                <input  
                    type="number" 
                    onChange={handleInputChange}
                    className="border border-gray-400 p-2 rounded-md w-full outline-none mb-5" 
                    placeholder="0.5 ETH"
                    name="ticketPrice"
                    value={inputValue.ticketPrice}
                />

                <label className='font-bold text-white'>
                    Ticket quantity 
                </label>
                <input  
                    type="number" 
                    onChange={handleInputChange}
                    className="border border-gray-400 p-2 rounded-md w-full outline-none mb-5" 
                    placeholder="0.5 ETH"
                    name="totalTickets"
                    value={inputValue.totalTickets}
                />
            </form>

            <div className='flex flex-row gap-5'>
              <button onClick={createEventButton} className="rounded-lg px-3 py-2 cursor-pointer bg-yellow-400 text-black hover:animate-pulse focus:outline-none shadow-lg shadow-neon transition duration-800 ease-in-out mt-5">
                  Create Event
              </button>
              <button onClick={toggleCreateEventModal} className="rounded-lg px-3 py-2 cursor-pointer bg-red-400 text-black hover:animate-pulse focus:outline-none shadow-lg shadow-neon transition duration-800 ease-in-out mt-5">
                  Close modal
            </button>

            </div>
        </div>
      )}
    </div>
  )
}

export default App
 