// SPDX-License-Identifier: MIT
// 0x359B573359DDaF99856F2F036894A5DaD30d55C4
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract TicketMarketplace {
    using SafeMath for uint256;

    struct Event {
        uint256 eventId;
        address payable creator;
        string name;
        string description;
        uint256 ticketPrice;
        uint256 totalTickets;
        uint256 ticketsSold;
        address[] ticketHolderAddresses;
        mapping(address => Ticket) ticketHolders;
    }

    struct Ticket {
        uint256 ticketId;
        uint256 eventId;
        address owner;
    }

    mapping(uint256 => Event) public events;

    uint256 public nextEventId;
    uint256 public nextTicketId;

    function createEvent(string memory _name, string memory _description, uint256 _ticketPrice, uint256 _totalTickets) public {
        Event storage newEvent = events[nextEventId];
        newEvent.eventId = nextEventId;
        newEvent.creator = payable(msg.sender);
        newEvent.name = _name;
        newEvent.description = _description;
        newEvent.ticketPrice = _ticketPrice;
        newEvent.totalTickets = _totalTickets;
        nextEventId++;
    }

    function buyTicket(uint256 _eventId) public payable {
        Event storage eventToBuy = events[_eventId];
        require(msg.value == eventToBuy.ticketPrice, "Incorrect ticket price");
        require(eventToBuy.ticketsSold < eventToBuy.totalTickets, "No more tickets left");
        require(msg.sender != eventToBuy.creator, "You cannot buy your own event's tickets!");

        Ticket storage newTicket = eventToBuy.ticketHolders[msg.sender];
        newTicket.ticketId = nextTicketId;
        newTicket.eventId = _eventId;
        newTicket.owner = msg.sender;
        nextTicketId++;
        
        eventToBuy.ticketsSold++;
        eventToBuy.ticketHolderAddresses.push(msg.sender); 

    }

    function withdrawFunds(uint256 _eventId) public {
        Event storage eventToWithdraw = events[_eventId];
        require(msg.sender == eventToWithdraw.creator, "Only event creator can withdraw");
        uint256 amount = eventToWithdraw.ticketPrice.mul(eventToWithdraw.ticketsSold);
        eventToWithdraw.creator.transfer(amount);
    }

    function getTicketHolders(uint256 _eventId) public view returns (address[] memory) {
        return events[_eventId].ticketHolderAddresses;
    }

    function getTicketInfo(uint256 _eventId, address _ticketHolder) public view returns (uint256, uint256, address) {
        Ticket memory ticket = events[_eventId].ticketHolders[_ticketHolder];
        return (ticket.ticketId, ticket.eventId, ticket.owner);
    }

    function getEventInfo(uint256 _eventId) public view returns (uint256, address, string memory, string memory, uint256, uint256, uint256) {
        return (events[_eventId].eventId, events[_eventId].creator, events[_eventId].name, events[_eventId].description, events[_eventId].ticketPrice, events[_eventId].totalTickets, events[_eventId].ticketsSold);
    }
}
