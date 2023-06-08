import abi from '../constants/TicketMarketplace.json'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'

const contractAddress = '0x1Bb3a8DcAEFECd61c9E51E29c3aA38F705f04EDC' 
const contractABI = abi.abi
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const ticketMarketplaceContract = new ethers.Contract(contractAddress, contractABI, signer);

const projectId = import.meta.env.VITE_INFURA_PROJECT_ID
const projectSecretKey = import.meta.env.VITE_INFURA_PROJECT_KEY
const authorization = "Basic " + btoa(projectId + ":" + projectSecretKey).toString('base64');

const ipfs = ipfsHttpClient({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: authorization,
    }
});


export async function connectWallet() {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const account = accounts[0];

    return account
}

export async function checkIfWalletIsConnected() {
    if (typeof window.ethereum !== 'undefined') {
        return false
    } else {
        return true
    }
}

export async function getAllEvents() {
    try {
        const numOfEvents = await ticketMarketplaceContract.getNumEvents();
        const numOfEventsNumber = numOfEvents.toNumber();
        const allEvents = [];

        for (let i = 0 ; i < numOfEventsNumber ; i++) {
            const eventInfo = await ticketMarketplaceContract.getEventInfo(i);
            const eventCreator = await ticketMarketplaceContract.getEventCreator(i);
            
            const event = {
                ...eventInfo,
                creator: eventCreator
            };

            allEvents.push(event);
        }

        return allEvents;

    } catch (error) {
        console.error(error);
    }
}

export async function createEvent(name, description, imageIpfsHash, ticketPrice, totalTickets) {
    try {
        const create = await ticketMarketplaceContract.createEvent(
            name, 
            description,
            imageIpfsHash,
            ethers.utils.parseEther(ticketPrice),
            totalTickets
        )

        await create.wait()
        return true

    } catch (error) {
        console.error(error)
        return false
    }
}

export async function purchaseTicket(eventId, ticketPrice) {
    try {
        const purchase = await ticketMarketplaceContract.buyTicket(eventId, {value: ethers.utils.parseEther(ticketPrice)})

        await purchase.wait()
        return true

    } catch (error) {
        console.error(error)
        return false;
    }
}

export async function uploadImageOntoIpfs(imageFile) {
    const result = await ipfs.add(imageFile)

    console.log(result.path)
        
    return {
        cid : result.cid,
        path: result.path
    }
}



