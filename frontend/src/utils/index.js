import abi from '../constants/TicketMarketplace.json'
import { ethers } from 'ethers'

const contractAddress = '0x359B573359DDaF99856F2F036894A5DaD30d55C4' 
const contractABI = abi.abi
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const ticketMarketplaceContract = new ethers.Contract(contractAddress, contractABI, signer);

export async function connectWallet() {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const account = accounts[0];

    return account
}