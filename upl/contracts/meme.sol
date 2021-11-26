// SPDX-License-Identifier: MIT
pragma solidity  ^0.6.0;

contract meme {
 
uint public id=0;
 mapping (uint=> Img) public images;
 struct Img{

  string hash;
  string description;
  address payable author;
  uint tipped;
 }

  function upload(string memory _hash,string memory _description) public {

    require(bytes(_description).length>0,"cant be empty description");
    require(address(0)!=msg.sender,"need to have address.");
    images[id].hash=_hash;
    images[id].description=_description;
    images[id].author=msg.sender;
 
id++;
  }

  function tip(uint _id ) public  payable {
   address payable _author=images[_id].author;
   _author.transfer(msg.value);
   images[_id].tipped+=msg.value;

 }
}
