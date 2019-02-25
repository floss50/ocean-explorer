pragma solidity 0.5.3;

import './Condition.sol';
import '../OceanToken.sol';
import '../bondingcurves/OceanBondingCurve.sol';

contract LockBondingCondition is Condition {

    OceanBondingCurve private oceanBondingCurve;

    function initialize(
        address _owner,
        address _conditionStoreManagerAddress,
        address _oceanBondingCurveAddress
    )
        external
        initializer()
    {
        require(
            _oceanBondingCurveAddress != address(0) &&
            _owner != address(0),
            'Invalid address'
        );
        Ownable.initialize(_owner);
        conditionStoreManager = ConditionStoreManager(
            _conditionStoreManagerAddress
        );
        oceanBondingCurve = OceanBondingCurve(_oceanBondingCurveAddress);
    }

    function hashValues(
        bytes32 _did,
        uint256 _buyAmount
    )
        public
        pure
        returns (bytes32)
    {
        return keccak256(abi.encodePacked(_did, _buyAmount));
    }

    function fulfill(
        bytes32 _agreementId,
        bytes32 _did,
        uint256 _buyAmount
    )
        external
        returns (ConditionStoreLibrary.ConditionState)
    {
        require(
            oceanBondingCurve.buy(_did, _buyAmount),
            'Could not buy bonded token'
        );
        return super.fulfill(
            generateId(_agreementId, hashValues(_did, _buyAmount)),
            ConditionStoreLibrary.ConditionState.Fulfilled
        );
    }
}
