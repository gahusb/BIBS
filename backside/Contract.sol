pragma solidity ^0.4.25;

contract AccInfo{
   address Creator;

    modifier onlyCreator() {
        require(msg.sender == Creator);
        _;
    }

    constructor() public{
        Creator = msg.sender;
    }

   function getCreator() constant public returns(address){
      return Creator;
   }

   struct accident{ 
      string video_hash;
      string time;
      string latitude;
      string longitude;
   }
   

   mapping(uint256 => accident) Accidents;

   function addAccidentInfo(uint count, string _video_hash, string _time, string _latitude, string _longitude) 
   public {
      Accidents[count].video_hash = _video_hash;
      Accidents[count].time = _time;
      Accidents[count].latitude = _latitude;
      Accidents[count].longitude = _longitude;
   }

   function getAccident(uint256 index) public view returns (string, string, string, string){
      return
      (Accidents[index].video_hash,
      Accidents[index].time,
      Accidents[index].latitude,
      Accidents[index].longitude);
   } 
}