// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IDiscountPool{
    function poolAdmin() external view returns (address);
    function claimState() external view returns(bool);
    function burnState() external view returns(bool);
    function createdState() external view returns(bool);
    function poolTimeUpdate(uint256,uint256) external;
}