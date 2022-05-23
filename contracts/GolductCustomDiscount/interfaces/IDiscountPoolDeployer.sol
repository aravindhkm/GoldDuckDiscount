// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IDiscountPoolDeployer{
    function PlatformWalletAddress() external view returns (address);
    function treasuryWallet() external view returns (address);
    function PlatformRaisedAmountFee() external view returns (uint256);
    function isPoolBlock(address pool) external view returns (bool);
    function isWhiteList(address pool) external view returns (bool);
    function isSigner(address signer) external view returns (bool);
}