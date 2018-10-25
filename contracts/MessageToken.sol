// This Token Contract implements the standard token functionality (https://github.com/ethereum/EIPs/issues/20)
// You can find more complex example in https://github.com/ConsenSys/Tokens 
pragma solidity ^0.4.8;

import "./BaseToken.sol";
import "./SafeMath.sol";

/*
 * MessageToken (name pending a change) is the backbone to interfacing with the blockchain
 * One instance of this contract is deployed for each room created from which the users may change the following settings:
 * dailyTokens - a users allowance for the day, primarily used to prevent spam
 * tokensPerMessage - the cost of a message (pending a change to determine cost based on message length instead)
 * blocksPerClaim - used to determine the cooldown before being allowed to take more tokens (pending a change)
 * ipfsHash - an IPNS hash which points to an IPFS repo in which the messages for room this contract belongs to is stored
 */
contract MessageToken is BaseToken {
    using SafeMath for uint;
    using SafeMath for uint256;

    string public name;
    uint8 public decimals;
    string public symbol;
    string public version = "MSG";
    address owner;
    uint256 public dailyTokens = 12;
    uint256 public tokensPerMessage = 3;
    mapping (address => uint) lastClaimed;
    mapping (address => uint[]) messageHistory;
    uint public blocksPerClaim = 100;
    string public ipfsHash;
    string public latestMessage;
    
    struct Room {
        string name;
        bool is_private;
        mapping (address => bool) permission_list;
        address[] whitelist;
        uint256 dailyTokens;
        uint256 tokensPerUpdate;
        uint256 updateRate;
        uint256 tokensPerMessage;
        string hash;
        bool exists;
    }
	
	uint256 private nextID = 0;
	mapping (uint256 => Room) rooms;
	
    // emmitted events that can be caught (pending implementation)
    //event sendEvent(address addr, string latestMessage);
    //event hashUpdate(address addr, string ipfsHash);

    /*
     * Used to identify MessageTokens with wallet services
     * (pending full implementation)
     * params:  _initalAmount - initial value
                _tokenName - identifier
                _decimalUnits - number decimal places to allow for denominations
                _tokenSymbol - currency identifier
     */
    function UsableToken(
        uint256 _initialAmount,
        string _tokenName,
        uint8 _decimalUnits,
        string _tokenSymbol
    ) public {
        owner = msg.sender;
        balances[this] = _initialAmount;
        totalSupply = _initialAmount;
        name = _tokenName;
        decimals = _decimalUnits;
        symbol = _tokenSymbol;
    }

    /*
     * modifies the cooldown before being able to claim more tokens
     * params:  newBPC - new duration
     */
    function changeBlocksPerClaim(uint newBPC) public {
        require(msg.sender == owner);
        blocksPerClaim = newBPC;
    }

    /*
     * retrieves the current set wait duration before claiming more tokens
     * params:  addr - address of claimer
     * returns: number of blocks before user can claim more tokens
     */
    function getBlocksTillClaimable(address addr) public view returns (uint blockNo) {
        if(lastClaimed[addr] == 0) {
            return 0;
        }

        uint blockDiff = (block.number - lastClaimed[addr] - 1);

        if(blockDiff < blocksPerClaim) {
            return blocksPerClaim.sub(blockDiff);
        }

        return 0;
    }

    /*
     * retrieves the last time tokens were claimed
     * params:  addr - address of claimer
     * returns: block number of last time tokens were claimed
     */
    function getLastClaimedBlock(address addr) public view returns (uint blockNo) {
        return lastClaimed[addr];
    }

    /*
     * retrieves a list of block numbers in which messages were sent
     * params:  addr - address of claimer
     * returns: integer array of block numbers
     */
    function getMessageHistory(address addr) public view returns (uint[]) {
        return messageHistory[addr];
    }

    /*
     * retrieves the set wait duration between token claims
     * returns: the number of blocks to wait
     */
    function getBlocksPerClaim() public view returns (uint) {
        return blocksPerClaim;
    }

    /*
     * retrieves the set cost for sending a message (pending changes)
     * returns: the number of tokens required for sending a message
     */
    function getTokensPerMessage() public view returns (uint) {
        return tokensPerMessage;
    }

    /*
     * retrieves the set number of available tokens per cycle
     * returns: the number of tokens distributed per cycle
     */
    function getDailyTokensNo() public view returns (uint) {
        return dailyTokens;
    }

    /*
     * the number of claimable tokens
     * params:  addr - address of claimer
     * returns: the number of tokens claimed
     */
    function getClaimableTokens(address addr) public view returns (uint) {
        uint value;
        if(lastClaimed[addr] == 0) {
            value = dailyTokens;
        } else {
            uint multiples = (block.number - lastClaimed[addr] - 1).div(blocksPerClaim);
            value = multiples * dailyTokens;
        }

        return value;
    }

    /*
     * updates the balance with claimable tokens (if any)
     * params:  addr - address of claimer
     * returns: boolean representing if claiming was successful
     */
    function claim() public returns (bool success) {
        if(block.number - lastClaimed[msg.sender] - 1 < blocksPerClaim) {
            return false;
        }

        uint value = getClaimableTokens(msg.sender);

        lastClaimed[msg.sender] = block.number - 1;
        balances[msg.sender] += value;
        balances[this] -= value;
        emit Transfer(this, msg.sender, value);

        return true;
    }

    /*
     * updates the local message 
     * params:  message - string to update latestMessage with
     */
    function sendMessage(string message) public {
        require(balances[msg.sender] >= tokensPerMessage);
        messageHistory[msg.sender].push(block.number - 1);

        balances[msg.sender] -= tokensPerMessage;
        balances[this] += tokensPerMessage;

        latestMessage = message;
        //emit sendEvent(msg.sender, latestMessage);
    }

    /*
     * retrieves the stored latestMessage
     * returns: the current state of latestMessage
     */
    function getMessage() public view returns (string _message) {
        return latestMessage;
    }

    /*
     * updates the local stored hash
     * params:  _hash - (should be) an IPNS hash that points to a file containing 
     *                  messages from the room this contract belongs to
     */
    function sendHash(uint256 room, string _hash) public {
        if(rooms[room].exists) {
            if(checkPermission(room, msg.sender)) {
                //require(balances[msg.sender] >= tokensPerMessage);
                messageHistory[msg.sender].push(block.number - 1);
                //balances[msg.sender] -= tokensPerMessage;
                //balances[this] += tokensPerMessage;
                
                rooms[room].hash = _hash;
                //emit hashUpdate(msg.sender, ipfsHash);
            }
        }
    }

    /*
     * retrieves the hash 
     * returns: the stored IPNS hash 
     */
    function getHash(uint256 room) public view returns (string _hash, bool success) {
	    if(rooms[room].exists) {
	        if(checkPermission(room, msg.sender)) {
                return (rooms[room].hash, true);
	        }
	        return ("Not Permitted", false);
	    }
	    return ("Room Doesn't Exist", false);
    }
    
	event RoomMade(
		uint256 roomID,
		address creator
	);

    function newRoom(string roomName, bool new_is_private, uint256 newDailyTokens, uint256 newTokensPerUpdate, uint256 newUpdateRate, uint256 newTokensPerMessage) public {
        uint256 newid = nextID;
        
        rooms[newid].name = roomName;
        rooms[newid].is_private = new_is_private;
        rooms[newid].permission_list[msg.sender] = true;
        rooms[newid].whitelist.push(msg.sender);
        rooms[newid].dailyTokens = newDailyTokens;
        rooms[newid].tokensPerUpdate = newTokensPerUpdate;
        rooms[newid].updateRate = newUpdateRate;
        rooms[newid].tokensPerMessage = newTokensPerMessage;
        rooms[newid].exists = true;

        nextID++;
		emit RoomMade(newid, msg.sender);
    }

	function getRoomName(uint256 room) public view returns (string roomName, bool success) {
	    if(rooms[room].exists) {
	        if(checkPermission(room, msg.sender)) {
        	    return (rooms[room].name, true);
	        }
	        return ("Not Permitted", false);
	    }
	    return ("Room Doesn't Exist", false);
	}
	
	function addToWhitelist(uint256 room, address test_user) public {
		if(rooms[room].exists) {
			if(checkPermission(room, msg.sender)) {
			    rooms[room].whitelist.push(test_user);
			    rooms[room].permission_list[test_user] = true;
			}
		}
	}
	
	function removeFromWhitelist(uint256 room, address test_user, uint256 index) public {
		if(rooms[room].exists) {
			if(checkPermission(room, msg.sender)) {
	            rooms[room].whitelist[index] = rooms[room].whitelist[rooms[room].whitelist.length - 1];
			    delete rooms[room].whitelist[rooms[room].whitelist.length - 1];
			    rooms[room].whitelist.length--;
			    rooms[room].permission_list[test_user] = false;
			}
		}
	}
	
	function getWhitelist(uint256 room) public view returns (address[] whitelist, bool success) {
	    address[] memory ret;
		if(rooms[room].exists) {
			if(checkPermission(room, msg.sender)) {
			    ret = rooms[room].whitelist;
        	    return (ret, true);
			}
			return (ret, false);
		}
		return (ret, false);
	}
    
    function checkPermission(uint256 room, address test_user) private view returns (bool permission) {
        if(rooms[room].is_private) {
            if(rooms[room].permission_list[test_user]) {
                return true;
            }
            return false;
        } else {
            return true;
        }
    }
}