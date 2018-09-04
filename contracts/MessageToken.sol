// This Token Contract implements the standard token functionality (https://github.com/ethereum/EIPs/issues/20)
// You can find more complex example in https://github.com/ConsenSys/Tokens 
pragma solidity ^0.4.8;

import "./BaseToken.sol";
import "./SafeMath.sol";

contract MessageToken is BaseToken {
    using SafeMath for uint;
    using SafeMath for uint256;

    string public name;
    uint8 public decimals;
    string public symbol;
    string public version = "MSG";
    address owner;
    uint256 public dailyTokens = 12;
    uint256 public tokensPerMsg = 3;
    mapping (address => uint) lastClaimed;
    mapping (address => uint[]) msgHistory;
    uint public blocksPerClaim = 100;

    event sendEvent(address addr);

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

    function changeBlocksPerClaim(uint newBPC) public {
        require(msg.sender == owner);
        blocksPerClaim = newBPC;
    }

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

    function getLastClaimedBlock(address addr) public view returns (uint blockNo) {
        return lastClaimed[addr];
    }

    function getMsgHistory(address addr) public view returns (uint[]) {
        return msgHistory[addr];
    }

    function getBlocksPerClaim() public view returns (uint) {
        return blocksPerClaim;
    }

    function getTokensPerMsg() public view returns (uint) {
        return tokensPerMsg;
    }

    function getDailyTokensNo() public view returns (uint) {
        return dailyTokens;
    }

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

    function claim() public returns (bool success) {
        if(block.number - lastClaimed[msg.sender] - 1 < blocksPerClaim) {
            return false;
        }

        uint value;
        if(lastClaimed[msg.sender] == 0) {
            value = dailyTokens;
        } else {
            uint multiples = (block.number - lastClaimed[msg.sender]);
            value = multiples * dailyTokens;
        }

        lastClaimed[msg.sender] = block.number - 1;
        balances[msg.sender] += value;
        balances[this] -= value;
        Transfer(this, msg.sender, value);

        return true;
    }

    function sendMsg() public {
        require(balances[msg.sender] >= tokensPerMsg);
        msgHistory[msg.sender].push(block.number - 1);

        balances[msg.sender] -= tokensPerMsg;
        balances[this] += tokensPerMsg;

        emit sendEvent(msg.sender);
    }
}