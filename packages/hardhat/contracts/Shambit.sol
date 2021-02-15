pragma solidity >=0.6.0 <0.7.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

//import "@openzeppelin/contracts/access/Ownable.sol"; //https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract Shambit {
    using SafeMath for uint256;

    /*
Variable
*/
    mapping(uint256 => Event) events;
    uint256 idSeed = 0;

    /*
Events
*/
    event SetPurpose(address sender, string purpose);
    event AddEvent(address sender, uint256 eventId);
    /*
Structs
*/
    struct Event {
        uint256 id;
        uint256 startDate;
        uint256 endDate;
        uint256 hStart;
        uint256 mStart;
        uint256 hEnd;
        uint256 mEnd;
        Coordinate location;
        uint256 viewRange;
        uint256 capacity;
        uint256[3] targetsReward;
        uint256[3] sharePowerReward;
        mapping(address => Participant) participants;
        uint256[] participantsId;
        uint256 participantsSize;
        //customTarget
        bool verified;
        string IpfsCID;
        string tokenName;
        uint256 tokenDeposit;
    }
    struct Coordinate {
        uint256 lat;
        uint256 long;
    }
    struct Participant {
        uint256 id;
        address payable refAddress;
        bool complete;
        uint256[3] targetProgress;
        bool verified;
    }

    string public purpose = "🛠 Programming hi amir";

    constructor() public {
        uint256 ttt = now;
        console.log("now:", ttt);

        // what should we do on deploy?
    }

    /*
Add funcitons 
*/

    function addEvent(
        uint256 startDate,
        uint256 endDate,
        uint256 hStart,
        uint256 mStart,
        uint256 hEnd,
        uint256 mEnd,
        uint256 latLocation,
        uint256 longLocation
    ) public returns (uint256) {
        Event memory ev;
        ev.id = increment();
        ev.startDate = startDate;
        ev.endDate = endDate;
        ev.hStart = hStart;
        ev.mStart = mStart;
        ev.location.lat = latLocation;
        ev.location.long = longLocation;
        //console.log("Start Date: ",ev.location.long);
        events[ev.id] = ev;
        emit AddEvent(msg.sender, ev.id);
    }

    function setPurpose(string memory newPurpose) public {
        purpose = newPurpose;
        console.log(msg.sender, "set purpose to", purpose);
        emit SetPurpose(msg.sender, purpose);
    }

    /*
Utiles
    */
    function increment() public returns (uint256) {
        idSeed = idSeed.add(1);
        return idSeed;
    }
}
