import { useState, useEffect } from 'react'
import truncateEthAddress from 'truncate-eth-address';
import { ethers } from 'ethers'
import { EventList, Loader } from './components'
import { connectWallet, checkIfWalletIsConnected, createEvent, getAllEvents, uploadImageOntoIpfs } from './utils'

const App = () => {
  const [walletAddress, setWalletAddress] = useState("")
  const [isWalletConnected, setIsWalletConnected] = useState(false)

  const [showCreateEventModal, setShowCreateEventModal] = useState(false)
  const [allEventsData, setAllEventsData] = useState([])
  const [isLoadingEventData, setIsLoadingEventData] = useState(true)

  const [requestedCreateEvent, setRequestedCreateEvent] = useState(false)
  const [isCreatedEventSuccessfully, setIsCreatedEventSuccessfully] = useState(false)

  const [uploadedOntoIpfs, setUploadedOntoIpfs] = useState(false)
  const [eventHasImage, setEventHasImage] = useState(false)

  const [inputValue, setInputValue] = useState({
    name: "",
    description: "",
    imageIpfsHash: "QmTuYPapHyaiN8wXwk5HvST3vhKR9w6MX7NSx3fofvAcEr",
    ticketPrice: 0,
    totalTickets: 0
  });

  const handleInputChange = (event) => {
    setInputValue(prevFormData => ({ ...prevFormData, [event.target.name]: event.target.value }));
  } 

  const handleImageFileChange = async (event) => {
    if (event.target.files[0]) {
      setEventHasImage(true)
      try {
        const ipfsData = await uploadImageOntoIpfs(event.target.files[0]);
        inputValue.imageIpfsHash = ipfsData.path
        setUploadedOntoIpfs(true)

      } catch (error) {
        console.log(error);
      }
    }
      
  };

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

        if (eventHasImage == true && uploadedOntoIpfs == false) {
          alert("Please wait for a couple of seconds so that the image can be uploaded onto ipfs first, thanks.")

        } else {
          setRequestedCreateEvent(true)

          const success = await createEvent(
            inputValue.name, 
            inputValue.description, 
            inputValue.imageIpfsHash, 
            inputValue.ticketPrice, 
            inputValue.totalTickets);

          if (success) {
              setIsCreatedEventSuccessfully(true)
          } else {
              alert('Error creating event');
          }
        }
      }

    } catch (error) {
      alert(error)
    }
  }

  const getAllEventsFunction = async () => {
    const events = await getAllEvents()
    setAllEventsData(events)
    setIsLoadingEventData(false)
    console.log(events)
  } 

  const toggleCreateEventModal = async () => {
    setShowCreateEventModal(!showCreateEventModal);
  };

  const closeCreateEventModalAfterCreatedEvent = async () => {
    setShowCreateEventModal(!showCreateEventModal);
    setEventHasImage(false)
    setUploadedOntoIpfs(false)
    setRequestedCreateEvent(false)
    setIsCreatedEventSuccessfully(false)
  };

  useEffect(() => {
    connectWalletButton()
    getAllEventsFunction() 
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

        <div className='p-10'>
          {isLoadingEventData ? (
            <Loader />
          ) : (
            <EventList events={allEventsData} />
          )}
        </div>
      </div>

      {showCreateEventModal && (
        <div className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-black bg-opacity-80">
          <h1 className='text-white text-4xl font-extrabold mb-5'>Create an event</h1>
            <form className="max-w-[800px]">
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

                <label className='font-bold text-white'>
                    Image - select an image representing your event
                </label>
                <input  
                    type="file"
                    onChange={handleImageFileChange}
                    className="text-white border border-gray-400 p-2 rounded-md w-full outline-none mb-5" 
                    name="file"
                />

                {eventHasImage && uploadedOntoIpfs ? (
                  <h1 className='text-[#49cd82] mb-5'>Uploaded onto ipfs! - {inputValue.imageIpfsHash}</h1>
                ) : (
                  eventHasImage ? (
                    <h1 className='text-white'>Uploading onto ipfs...</h1>
                  ) : (
                    <h1 />
                  )
                )}

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

            {requestedCreateEvent ? (
              isCreatedEventSuccessfully ? (
                <div className='flex flex-col'>
                  <h1 className='text-white font-bold'>Congrats! Event created successfully.</h1>
                  <button onClick={closeCreateEventModalAfterCreatedEvent} className="rounded-lg px-3 py-2 cursor-pointer bg-red-400 text-black hover:animate-pulse focus:outline-none shadow-lg shadow-neon transition duration-800 ease-in-out mt-5">
                    Close modal
                </button>
                </div>
              ) : (
                <Loader />
              )
            ) : (
              <div className='flex flex-row gap-5'>
                <button onClick={createEventButton} className="rounded-lg px-3 py-2 cursor-pointer bg-yellow-400 text-black hover:animate-pulse focus:outline-none shadow-lg shadow-neon transition duration-800 ease-in-out mt-5">
                    Create Event
                </button>
                <button onClick={toggleCreateEventModal} className="rounded-lg px-3 py-2 cursor-pointer bg-red-400 text-black hover:animate-pulse focus:outline-none shadow-lg shadow-neon transition duration-800 ease-in-out mt-5">
                    Close modal
                </button>
              </div>
              
            )}
        </div>
      )}
    </div>
  )
}

export default App
 