import React from 'react';
import truncateEthAddress from 'truncate-eth-address';
import { purchaseTicket } from '../utils';

const EventList = ({ events }) => {
    const purchaseTicketButton = async (eventId, ticketPrice) => {
        try {
            const success = await purchaseTicket(eventId, ticketPrice)
            if (success) {
                alert("Purchased Ticket!")
            } else {
                alert(`Error purchasing ticket.  Possible reasons :  \n1. You can't purchase your own event tickets \n2. Insufficient fees for paying price of event ticket \n3. Insufficient fees for paying gas for transaction`)
            }

        } catch (error) {
            alert(error)
        }
    }
    return (
      <div className="font-inter grid grid-cols-4 gap-10 w-full rounded-[15px] cursor-pointer">
        {events.map((event) => (
          <div key={event}>
            <img src={`https://ipfs.io/ipfs/${event[3]}`} alt="eventImage" className="w-full h-[160px] object-cover rounded-[25px] ml-4"/>

            <div className="p-4">
                <div className="flex flex-row items-center text-white">
                    <p className="ml-[12px] mt-[2px] font-medium text-[12px]">{event[5].toNumber() - event[6].toNumber()} Tickets remaining</p>
                    <p className="ml-[12px] mt-[2px] font-medium text-[12px]">{event[5].toNumber()} Total tickets</p>
                </div>
            </div>

            <div className="block ml-7">
                <h3 className="font-extrabold text-[24px] text-white text-left leading-[26px] truncate">{event[1]}</h3>
                <p className="mt-2 font-normal text-gray-400 text-left leading-[18px] truncate">{event[2]}</p>
            </div>

            <div className="flex items-center mt-[20px] gap-[12px] ml-7">
                <div className='flex-1 flex flex-col'>
                    <p className="text-[12px] text-[#808191]"> 
                        <span className="text-[#b2b3bd]">
                            <a href={'https://sepolia.etherscan.io/address/' } target="_blank" rel="noreferrer">
                                {truncateEthAddress(event.creator)}
                            </a>
                        </span>
                    </p>
                    <p className='text-[#808191]'><span className='text-white font-bold'>{event[4]/1000000000000000000}</span> ETH / Ticket</p>
                </div>

                {(event[5].toNumber() - event[6].toNumber()) <= 0 ? (
                    <h1 className='text-red-400 text-[24px]'>SOLD OUT</h1>
                 ) : (
                    <button className="inline-block font-bold text-center whitespace-no-wrap align-middle select-none border border-transparent py-2 px-4 rounded bg-yellow-400 leading-tight focus:outline-none shadow-lg shadow-neon transition duration-150 ease-in-out hover:bg-[#49cd82]"
                        onClick={() => purchaseTicketButton(
                            event[0], 
                            (event[4]/1000000000000000000).toString()
                        )}>
                        Purchase
                    </button>
                 )}
            
            </div>

          </div>
        ))}
      </div>
    );
  };

export default EventList