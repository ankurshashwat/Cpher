// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Cpher {
    struct FIR {
        string name;
        string houseAddress;
        string phoneNumber;
        string natureOfOffense;
        uint256 dateAndTime;
        string locationOfIncident;
        string descriptionOfIncident;
        string detailsOfAccused;
        string evidence;
    }

    mapping(bytes32 => FIR) public Reports;

    event Registered(bytes32 indexed uniqueId);

    function register(
        string memory _name,
        string memory _houseAddress,
        string memory _phoneNumber,
        string memory _natureOfOffense,
        uint256 _dateAndTime,
        string memory _locationOfIncident,
        string memory _descriptionOfIncident,
        string memory _detailsOfAccused,
        string memory _evidence
    ) external {
        bytes32 uniqueId = generateUniqueId(_name);

        require(
            Reports[uniqueId].dateAndTime == 0,
            "date and time are required"
        );

        FIR storage newFIR = Reports[uniqueId];

        newFIR.name = _name;
        newFIR.houseAddress = _houseAddress;
        newFIR.phoneNumber = _phoneNumber;
        newFIR.natureOfOffense = _natureOfOffense;
        newFIR.dateAndTime = _dateAndTime;
        newFIR.locationOfIncident = _locationOfIncident;
        newFIR.descriptionOfIncident = _descriptionOfIncident;
        newFIR.detailsOfAccused = _detailsOfAccused;
        newFIR.evidence = _evidence;

        emit Registered(uniqueId);
    }

    function retrieve(bytes32 uniqueId) external view returns (FIR memory) {
        return Reports[uniqueId];
    }

    function generateUniqueId(
        string memory _name
    ) internal view returns (bytes32) {
        bytes32 uniqueId = keccak256(abi.encodePacked(_name, block.timestamp));
        return uniqueId;
    }
}
