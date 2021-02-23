pragma solidity >=0.6.0 <0.7.0;
// pragma experimental ABIEncoderV2;
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
    event AddPublicEvent(address sender, uint256 eventId);
    event SetPurpose(address sender, string purpose);
    event AddEvent(address sender, uint256 eventId);
    event AddParticipant(uint256, address);
    event SetFinalActivityStatus(address sender, uint256 eventId);
    event CloseEvent(uint256 eventId);
    event EditEvent(uint eventID);
    /*
Structs
*/
    struct Event {
        uint256 id;
        // string label
        address payable creator;
        uint256 startDate;
        uint256 endDate;
        bool isPublic;
        string location;
        uint256 viewRange;
        uint256 capacity;
        uint256[3] targetsReward;
        uint256[3] sharePowerReward;
        mapping(address => Participant) participants;
        uint256[] participantsId;
        uint256 participantsSize;
        // customTarget cTarget;
        bool verified;
        string IpfsCID;
        string tokenName;
        uint256 tokenDeposit;
        bool close;
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
        // uint256 ttt = block.timestamp;
        // console.log("now:", ttt);
        // what should we do on deploy?
    } // @notice Explain to an end user what this does

    /*
Enums
*/

    /*
Add funcitons 
*/
    // struct UintPair {
    //     uint256 id;
    //     uint256 startDate;
    //     string ad;
    //     AccessibilityType accessibilityType;
    //     uint256[3] targetsReward;
    //     Coordinate location;
    // }

    // function addEvent(Event memory e) public returns (uint256) {
    //     events[e.id] = e;
    //     assert(e.id == 0);
    //     assert(e.verified == false);
    //     assert(e.participantsSize == 0);
    //     assert(e.participantsId.length == 0);
    //     e.id = increment();
    //     e.participantsSize = 0;
    //     emit AddEvent(msg.sender, e.id);
    //     return e.id;
    //     //    console.log("ev:",ev);
    // }

    function addPublicEvent(
        uint256 startDate,
        uint256 endDate,
        string memory location,
        uint256 viewRange,
        uint256 capacity,
        uint256[3] memory targetsReward,
        uint256[3] memory sharePowerReward,
        string memory IpfsCID,
        string memory tokenName
    ) public returns (uint256 id) {
        Event memory e;
        e.id = genId();
        e.creator = msg.sender;
        e.startDate = startDate;
        e.endDate = endDate;
        e.location = location;
        e.viewRange = viewRange;
        e.capacity = capacity;
        e.targetsReward = targetsReward;
        e.sharePowerReward = sharePowerReward;
        e.IpfsCID = IpfsCID;
        e.tokenName = tokenName;
        //TODO computing token deposit
        events[e.id] = e;
        emit AddPublicEvent(msg.sender, e.id);
        return e.id;
    }

    // function test(
    //     uint256[]  a44,
    //     uint256 a33,
    //     uint256 a22,
    //     uint256 a11,
    //     uint256 a6,
    //     uint256 a5,
    //     uint256 a4,
    //     uint256 a3,
    //     uint256 a2,
    //     string[]  a1,
    //     uint256 aa,
    //     uint256 asv //  uint ad
    // ) public // uint af

    // {
    //     uint256 b = 12;
    // }

    function addParticipant(uint256 eventId, address payable refAddress)
        public
    {
        Participant memory pr;
        pr.id = genId();
        pr.refAddress = refAddress;
        events[eventId].participants[msg.sender] = pr;
        events[eventId].participantsSize.add(1);
        events[eventId].participantsId.push(pr.id);
        emit AddParticipant(eventId, msg.sender);
    }

    function setFinalActivityStatus(
        uint256 eventId,
        uint256[3] memory targetProgress
    ) public {
        events[eventId].participants[msg.sender]
            .targetProgress = targetProgress;
        events[eventId].participants[msg.sender].complete = true;
        emit SetFinalActivityStatus(msg.sender, eventId);
    }

    function closeEvent(uint256 eventId) public {
        events[eventId].close = true;
        emit CloseEvent(eventId);
    }

    // function setPurpose(string memory newPurpose) public {
    //     purpose = newPurpose;
    //     console.log(msg.sender, "set purpose to", purpose);
    //     emit SetPurpose(msg.sender, purpose);
    // }

    /*
Getter functions
*/
    function getEvent(uint256 id)
        public
        view
        returns (
            // string memory label,
            // uint256 eventId,
            uint256 startDate,
            uint256 endDate,
            bool isPublic,
            string memory location,
            uint256 viewRange,
            uint256 capacity,
            string memory IpfsCID
        )
    {
        return (
            events[id].startDate,
            events[id].endDate,
            events[id].isPublic,
            events[id].location,
            events[id].viewRange,
            events[id].capacity,
            events[id].IpfsCID
            //  events[id].tokenName,
            // events[id].targetsReward
            //   events[id].sharePowerReward

            // events[id].participantsSize,
            // events[id].verified
            // events[id].IpfsCID,
            // events[id].tokenName
        );
    }

    function getEventDetail(uint256 id)
        public
        view
        returns (
            // string memory label,
            // uint256 eventId,

            string memory tokenName,
            uint256[3] memory targetsReward,
            uint256[3] memory sharePowerReward,
            uint256 participantsSize,
            bool verified,
            bool close
        )
    {
        return (
            events[id].tokenName,
            events[id].targetsReward,
            events[id].sharePowerReward,
            events[id].participantsSize,
            events[id].verified,
            events[id].close
        );
    }

    function editEvent(uint256 eventId, string memory IpfsCID) public {
        events[eventId].IpfsCID = IpfsCID;
        emit EditEvent(eventId);
    }

    /*
Utiles
    */
    function genId() private returns (uint256) {
        idSeed = idSeed.add(1);
        return idSeed;
    }
}
