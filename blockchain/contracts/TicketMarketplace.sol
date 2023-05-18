// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract TicketMarketplace is Ownable {

    using EnumerableSet for EnumerableSet.AddressSet;
    using SafeMath for uint256;

    // Event struct
    struct Event {
        uint256 eventId;
        string name;
        string description;
        uint256 ticketPrice;
        uint256 totalTickets;
        EnumerableSet.AddressSet ticketHolders;
    }

    // Ticket struct
    struct Ticket {
        uint256 ticketId;
        uint256 eventId;
        uint256 dateAdded;
        uint256 price;
        address owner;
    }

    // State variables
    mapping(uint256 => Event) private events;
    mapping(uint256 => Ticket) public tickets;
    uint256 private eventIdCounter;
    uint256 private ticketIdCounter;

    // Event creation
    function createEvent(string calldata name, string calldata description, uint256 ticketPrice, uint256 totalTickets) external onlyOwner {
        eventIdCounter = eventIdCounter.add(1);
        Event storage newEvent = events[eventIdCounter];
        newEvent.eventId = eventIdCounter;
        newEvent.name = name;
        newEvent.description = description;
        newEvent.ticketPrice = ticketPrice;
        newEvent.totalTickets = totalTickets;
    }

    // Ticket creation
    function addTicket(uint256 eventId) external onlyOwner {
        require(events[eventId].totalTickets > 0, "No more tickets available for this event");

        ticketIdCounter = ticketIdCounter.add(1);
        Ticket storage newTicket = tickets[ticketIdCounter];
        newTicket.ticketId = ticketIdCounter;
        newTicket.eventId = eventId;
        newTicket.dateAdded = block.timestamp;
        newTicket.price = events[eventId].ticketPrice;
        newTicket.owner = address(0);

        events[eventId].totalTickets = events[eventId].totalTickets.sub(1);
    }

    // Ticket purchase
    function buyTicket(uint256 ticketId) external payable {
        require(tickets[ticketId].owner == address(0), "Ticket already sold");
        require(msg.value == tickets[ticketId].price, "Incorrect Ether sent");

        tickets[ticketId].owner = msg.sender;
        events[tickets[ticketId].eventId].ticketHolders.add(msg.sender);

        (bool success, ) = owner().call{value: msg.value}("");
        require(success, "Transfer failed");
    }

    // Returns the ticket holders of a particular event
    function getTicketHolders(uint256 eventId) external view returns (address[] memory) {
        uint256 length = events[eventId].ticketHolders.length();
        address[] memory holders = new address[](length);

        for (uint256 i = 0; i < length; i++) {
            holders[i] = events[eventId].ticketHolders.at(i);
        }

        return holders;
    }

    // Getters for Event struct
    function getEvent(uint256 eventId) external view returns (uint256, string memory, string memory, uint256, uint256) {
        Event storage ev = events[eventId];
        return (ev.eventId, ev.name, ev.description, ev.ticketPrice, ev.totalTickets);
    }
}

