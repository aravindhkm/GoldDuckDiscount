
// SPDX-License-Identifier: MITs

pragma solidity 0.8.13;
pragma abicoder v2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "./interfaces/IUniswapV2Pair.sol";
import "./interfaces/IUniswapV2Router02.sol";

contract GoldDuckCustomDiscount is Ownable, ReentrancyGuard, Pausable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;
    using Address for address payable;

    IERC20 public saleToken;
    IUniswapV2Router02 public pancake; 

    address public deadWallet = 0x000000000000000000000000000000000000dEaD;
    
    bool public buyBackState;
    bool public claimState;
    bool public burnState;
    bool inBuyBack;
    
    uint256 public totalAmounUsedtoBuyBack;
    uint256 public soldOutTokens;
    uint256 public redeemTokens;
    uint256 public offeringAmount;
    uint256 public discount;
    uint256 public minimumDeposit;
    uint256 public maximumDeposit;
    uint256 public claimDate;
    
    struct userLockStore {
        uint256 lockAmount;
        uint256 lockTime;
        uint256 claimTime;
    }  

    mapping (address => userLockStore) public userLockInfo;

    constructor(){}
    
    receive() external payable {}

    event lockEvent(
        address indexed user,
        uint256 amount,
        uint256 time
    );
    event unlockEvent(
        address indexed user,
        uint256 amount,
        uint256 time
    );

    /**
     * @dev Triggers stopped state.
     * 
     * Can only be called by the current owner.
     * 
     * Requirements:
     *
     * - The contract must not be paused.
    */
    function pause() public onlyOwner{
      _pause();
    }
    
    /**
     * @dev Triggers normal state.
     * 
     * Can only be called by the current owner.
     * 
     * Requirements:
     *
     * - The contract must not be unpaused.
     */
    function unpause() public onlyOwner{
      _unpause();
    }

    function initialize(
        address _token,
        uint256 _offeringAmount,
        uint256 _discount,
        uint256 _minimumDeposit,
        uint256 _maximumDeposit,
        uint256 _claimDate
    ) external {
        saleToken = IERC20(_token);
        offeringAmount = _offeringAmount;
        discount = _discount;
        minimumDeposit = _minimumDeposit;
        maximumDeposit = _maximumDeposit;
        claimDate = _claimDate;

        // testnet
        pancake = IUniswapV2Router02(0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3);

        // mainnet
        // pancake = IUniswapV2Router02(0x10ED43C718714eb63d5aA57B78B54704E256024E);
    }

    modifier buyBackLock {
        require(!inBuyBack, "ReentrancyGuard: reentrant call");
        inBuyBack = true;
        _;
        inBuyBack = false;
    }

    /**
     * @dev Returns the amount of tokens owned by `pool`.
     */  
    function bnbBalance() public view returns (uint256) {
        return (address(this).balance);        
    }

    /**
     * @dev Returns the amount of tokens owned by `pool`.
     */  
    function tokenBalance() public view returns (uint256) {
        return saleToken.balanceOf(address(this));
    }

    /**
     * @dev This function is help to the swap to pool token0 to token1.
     * 
     * Can only be called by the discountSale contract.
     * 
     * - E.g. User can swap bnb to busd. User can able to receive 30% more than pancakeswap.
     */   
    function swap() external payable nonReentrant whenNotPaused returns (bool) {
        return _swap(_msgSender(),msg.value);
    }

    function _swap(address user,uint256 amount) internal returns (bool){
        require(minimumDeposit <= msg.value && maximumDeposit >= msg.value, "deposit amount is invalid");

        address[] memory path = new address[](2);
        path[0] = pancake.WETH();
        path[1] = address(saleToken);

        uint[] memory getAmountOut = pancake.getAmountsOut(amount,path);
        uint256 amountOut = getAmountOut[1].add(getAmountOut[1].mul(discount).div(100));
        soldOutTokens = soldOutTokens.add(amountOut);
       
        userLockInfo[user].lockAmount = userLockInfo[user].lockAmount.add(amountOut);
        userLockInfo[user].lockTime = block.timestamp;
        emit lockEvent(user,amountOut,block.timestamp);
        return true;
    }

    /**
     * @dev This function is help to the buyback the all funds.
     *
     * Can only be called by the project owner and platform owner. 
     * 
     * 
     * - E.g. After the discount sale admin can be able to buyback the bnb to token.
     * 
     */  
    function buyBack() external whenNotPaused nonReentrant onlyOwner{
        uint256 currentBalance = address(this).balance;   
        require(currentBalance > 0, "insufficient balance");
     
        buyBackState = true;

        address[] memory path = new address[](2);
        path[0] = pancake.WETH();
        path[1] = address(saleToken);

        pancake.swapExactETHForTokensSupportingFeeOnTransferTokens{value: currentBalance}(
            0,
            path,
            address(this),
            block.timestamp
        );
    }
 
    /**
     * @dev This function is help to the claim all remaining tokens
     * 
     * Can only be called by the discountSale contract.
     * 
     * - E.g. after the confirm execution,admin can be able to claim the remaining token
     * - If platform owner doing this process, all the tokens will goes to the project owner.
     */    
    function claim() external nonReentrant whenNotPaused onlyOwner returns (bool) {
        require(claimDate < block.timestamp, "sale still not over");
        require(buyBackState, "buyBack still not happen");
        uint256 getAmountOut = address(this).balance;
        address[] memory path = new address[](2);
        path[0] = pancake.WETH();
        path[1] = address(saleToken);

        pancake.swapExactETHForTokensSupportingFeeOnTransferTokens{value: getAmountOut}(
            0,
            path,
            address(this),
            block.timestamp
        );

        saleToken.safeTransfer(owner(),saleToken.balanceOf(address(this)).sub(soldOutTokens.sub(redeemTokens)));
        claimState = true;
        return true;
    }

    /**
     * @dev This function is help to the burn all remaining tokens.
     * 
     * Can only be called by the discountSale contract.
     * 
     * - E.g. after the confirm execution,admin can be able to burn the remaining token
     * - If platform owner doing this process, all the tokens will goes to the dead wallet.
     */    
    function burn() external nonReentrant whenNotPaused onlyOwner returns (bool){
        require(buyBackState, "buyBack still not happen");
        require(claimDate < block.timestamp, "sale still not over");
        uint256 getAmountOut = address(this).balance;
        address[] memory path = new address[](2);
        path[0] = pancake.WETH();
        path[1] = address(saleToken);

        pancake.swapExactETHForTokensSupportingFeeOnTransferTokens{value: getAmountOut}(
            0,
            path,
            address(this),
            block.timestamp
        );
        
        IERC20(saleToken).safeTransfer(deadWallet,saleToken.balanceOf(address(this)).sub(soldOutTokens.sub(redeemTokens)));
        burnState = true;
        return true;
    }

    /**
     * @dev This function is help to the redeem the allocated tokens.
     * 
     * - E.g. after the sale end,user can able to claim their tokens.
     */ 
    function redeem() external nonReentrant whenNotPaused {
        userLockStore storage store = userLockInfo[msg.sender];
        require(store.lockAmount > 0, "Invalid user");
        require(claimDate <= block.timestamp, "time invalid");
        
        saleToken.safeTransfer(msg.sender,store.lockAmount);
        redeemTokens = redeemTokens.add(store.lockAmount);
        store.lockAmount = 0;
        store.claimTime = block.timestamp;
        emit unlockEvent(msg.sender,store.lockAmount,block.timestamp);
    }

    function redeemByAccount(address[] calldata accounts) external nonReentrant whenNotPaused {
        for(uint256 i; i<accounts.length; i++) {
            userLockStore storage store = userLockInfo[accounts[i]];
            if(store.lockAmount > 0 && claimDate <= block.timestamp) {
                saleToken.safeTransfer(accounts[i],store.lockAmount);
                redeemTokens = redeemTokens.add(store.lockAmount);
                store.lockAmount = 0;
                store.claimTime = block.timestamp;
                emit unlockEvent(accounts[i],store.lockAmount,block.timestamp);
            }                  
        }
    }

    /**
     * @dev This function is help to the recover the stucked funds.
     *
     * Can only be called by the platform owner. 
     * 
     * Requirements:
     *
     * - `token` token contract address.
     * - `amount` amount of tokens
     * 
     */      
    function recoverOtherToken(address _token,uint256 amount) external onlyOwner {
        IERC20(_token).safeTransfer(owner(),amount);
    }
}