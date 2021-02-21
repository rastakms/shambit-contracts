pragma solidity 0.7.1;
pragma experimental ABIEncoderV2;
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
        string label;
        uint256 id;
        uint256 startDate;
        uint256 endDate;
        uint256 hStart;
        uint256 mStart;
        uint256 hEnd;
        uint256 mEnd;
        AccessibilityType accessibilityType;
        Coordinate location;
        uint256 viewRange;
        uint256 capacity;
        uint256[3] targetsReward;
        uint256[3] sharePowerReward;
        //    mapping(address => Participant) participants;
        uint256[] participantsId;
        uint256 participantsSize;
        // customTarget cTarget;
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

    string public purpose = " Programming hi amirrrrrrr";

    constructor() public {
        uint256 ttt = block.timestamp;
        console.log("now:", ttt);

        // what should we do on deploy?
    } // @notice Explain to an end user what this does

    /*
Enums
*/
    enum AccessibilityType {Public, Private}

    /*
Add funcitons 
*/
    struct UintPair {
        uint256 id;
        uint256 startDate;
        string ad;
        AccessibilityType accessibilityType;
        uint256[3] targetsReward;
        Coordinate location;
    }

    function addEvent(Event memory e) public returns (uint256) {
        events[e.id] = e;
        assert(e.id == 0);
        assert(e.verified == false);
        assert(e.participantsSize == 0);
        assert(e.participantsId.length == 0);
        e.id = increment();
        e.participantsSize = 0;
        emit AddEvent(msg.sender, e.id);
        return e.id;
        //    console.log("ev:",ev);
    }

    function setPurpose(string memory newPurpose) public {
        purpose = newPurpose;
        console.log(msg.sender, "set purpose to", purpose);
        emit SetPurpose(msg.sender, purpose);
    }

    /*
Getter functions
*/
    function getEvent(uint256 id)
        public
        view
        returns (
            string memory label,
            uint256 eventId,
            uint256 startDate,
            uint256 endDate,
            uint256 hStart,
            uint256 mStart,
            uint256 hEnd,
            uint256 mEnd
            // bool accessibilityType,
            // uint256 locationLat,
            // uint256 locationLong,
            // uint256 viewRange
            // uint256 capacity,
            // uint256[3] memory targetsReward,
            // uint256[3] memory sharePowerReward,
            // //    mapping(address => Participant) participants;
            // uint256[] memory participantsId,
            // uint256 participantsSize,
            // // customTarget cTarget;
            // bool verified,
            // string memory IpfsCID,
            // string memory tokenName,
            // uint256 tokenDeposit
        )
    {
        return (
            events[id].label,
            id,
            events[id].startDate,
            events[id].endDate,
            events[id].hStart,
            events[id].mStart,
            events[id].hEnd,
            events[id].mEnd
            // events[id].accessibilityType,
            // events[id].location.lat,
            // events[id].location.long,
            // events[id].viewRange
            // events[id].capacity,
            // events[id].targetsReward,
            // events[id].sharePowerReward,
            // events[id].participantsId,
            // events[id].participantsSize,
            // events[id].verified,
            // events[id].IpfsCID,
            // events[id].tokenName,
            // events[id].tokenDeposit
        );
    }

    /*
Utiles
    */
    function increment() public returns (uint256) {
        idSeed = idSeed.add(1);
        return idSeed;
    }
}
