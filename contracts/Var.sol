pragma solidity ^0.4.23;

contract Var {

  event NewVar(address owner, string varName, string valueName);
  event VarSet(address owner, string varName, string valueName);

  //      owner              name      value name (probably an IPFS path)
  mapping(address => mapping(string => string)) internal vars;

  constructor() public {}

  function newVar(string _varName, string _initialValueName) public {
    require(bytes(vars[msg.sender][_varName]).length == 0,
            "Var name has already been declared");
    vars[msg.sender][_varName] = _initialValueName;
    emit NewVar(msg.sender, _varName, _initialValueName);
  }

  function set(string _varName, string _newValue) public {
    require(bytes(vars[msg.sender][_varName]).length != 0,
            "Cannot set undeclared var");
    vars[msg.sender][_varName] = _newValue;
    emit VarSet(msg.sender, _varName, _newValue);
  }

  function get(string _varName) public view returns (string) {
    require(bytes(vars[msg.sender][_varName]).length != 0,
            "Cannot get undeclared var");
    return vars[msg.sender][_varName];
  }
}
