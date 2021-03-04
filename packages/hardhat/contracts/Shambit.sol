pragma solidity >=0.6.0 <0.7.0;
// pragma experimental ABIEncoderV2;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "./ShambitToken.sol";

//import "@openzeppelin/contracts/access/Ownable.sol"; //https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract Shambit {
    using SafeMath for uint256;

    /*
Variable
*/
    IERC20 public SBT;
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
    event EditEvent(uint256 eventID);
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
        address[] participantsAddresses;
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

    constructor(address shambitTokenAddress) public {
        SBT = ShambitToken(shambitTokenAddress);
        // uint256 ttt = block.timestamp;
        // console.log("now:", ttt);
        // what should we do on deploy?
    } // @notice Explain to an end user what this does

    /*
Enums
*/

    /* 
Modifiers
*/
    modifier eventExist(uint256 eventId) {
        require(events[eventId].id != 0);

        _;
    }
    modifier eventNotExist(uint256 eventId) {
        require(events[eventId].id == 0);

        _;
    }

    modifier hasParticipated(uint256 eventId, address sender) {
        require(events[eventId].participants[sender].id != 0);
        _;
    }
    modifier hasNotParticipated(uint256 eventId, address sender) {
        require(events[eventId].participants[sender].id == 0);
        _;
    }

    /*
Setter funcitons 
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
        console.log("empty events: ", events[23].id == 0);
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
        require(SBT.transferFrom(msg.sender, address(this), 100));
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
        eventExist(eventId)
        hasNotParticipated(eventId, msg.sender)
    {
        Participant memory pr;
        pr.id = genId();
        pr.refAddress = refAddress;
        events[eventId].participants[msg.sender] = pr;
        events[eventId].participantsSize.add(1);
        // events[eventId].participantsId.push(pr.id);
        events[eventId].participantsAddresses.push(msg.sender);
        emit AddParticipant(eventId, msg.sender);
    }

    function setFinalActivityStatus(
        uint256 eventId,
        uint256[3] memory targetProgress
    ) public eventExist(eventId) hasParticipated(eventId, msg.sender) {
        events[eventId].participants[msg.sender]
            .targetProgress = targetProgress;
        events[eventId].participants[msg.sender].complete = true;
        emit SetFinalActivityStatus(msg.sender, eventId);
    }

    function closeEvent(uint256 eventId) public eventExist(eventId) {
        events[eventId].close = true;
        uint256[3] storage targetRewards = events[eventId].targetsReward;
        uint256[3] storage sharePowerReward = events[eventId].sharePowerReward;
        for (uint256 i; i < events[eventId].participantsSize; i++) {
            // uint256 participantId = events[eventId].participantsId[i];
            address participantAddress =
                events[eventId].participantsAddresses[i];
            Participant storage participant =
                events[eventId].participants[participantAddress];
            uint256 reward1 =
                (targetRewards[0] * participant.targetProgress[0]) / 100;
            uint256 reward2 =
                (targetRewards[1] * participant.targetProgress[1]) / 100;
            uint256 reward3 =
                (targetRewards[2] * participant.targetProgress[2]) / 100;
            // console.log("reward", reward);
            SBT.transfer(participantAddress, reward1 + reward2 + reward3);
            if (participant.refAddress != address(0)) {
                uint256 shareReward1 = (reward1 * sharePowerReward[0]) / 100;
                uint256 shareReward2 = (reward2 * sharePowerReward[1]) / 100;
                uint256 shareReward3 = (reward3 * sharePowerReward[2]) / 100;
                SBT.transfer(
                    participant.refAddress,
                    shareReward1 + shareReward2 + shareReward3
                );
            }
        }
        emit CloseEvent(eventId);
    }

    function editEvent(uint256 eventId, string memory IpfsCID)
        public
        eventExist(eventId)
    {
        events[eventId].IpfsCID = IpfsCID;
        emit EditEvent(eventId);
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

    function getParticipantStatus(uint256 eventId, address participantAddress)
        public
        view
        returns (
            address refAddress,
            bool complete,
            uint256[3] memory targetProgress,
            bool verified
        )
    {
        Participant memory p = events[eventId].participants[participantAddress];

        return (p.refAddress, p.complete, p.targetProgress, p.verified);
    }

    /*
Utiles
    */
    function genId() private returns (uint256) {
        idSeed = idSeed.add(1);
        return idSeed;
    }
}
