pragma solidity 0.5.3;

import '../conditions/ConditionStoreManager.sol';
import '../templates/TemplateStoreManager.sol';
import './AgreementStoreLibrary.sol';
import '../registry/DIDRegistry.sol';

import 'openzeppelin-eth/contracts/ownership/Ownable.sol';

/**
 * @title Agreement Store Manager
 * @author Ocean Protocol Team
 *
 * @dev Implementation of the Agreement Store.
 *      TODO: link to OEP
 *
 *      The agreement store generates conditions for an agreement template.
 *      Agreement templates must to be approved in the Template Store
 *      Each agreement is linked to the DID of an asset.
 */
contract AgreementStoreManager is Ownable {

    /**
     * @dev The Agreement Store Library takes care of the basic storage functions
     */
    using AgreementStoreLibrary for AgreementStoreLibrary.AgreementList;

    /**
     * @dev state storage for the agreements
     */
    AgreementStoreLibrary.AgreementList internal agreementList;

    ConditionStoreManager internal conditionStoreManager;
    TemplateStoreManager internal templateStoreManager;
    DIDRegistry internal didRegistry;

    event AgreementCreated(
        bytes32 indexed _agreementId,
        bytes32 indexed _did,
        address indexed _sender,
        address _templateId
    );

    /**
     * @dev AgreementStoreManager Initializer
     *      Initialize Ownable. Only on contract creation.
     * @param _owner refers to the owner of the contract
     * @param _conditionStoreManagerAddress is the address of the connected condition store
     * @param _templateStoreManagerAddress is the address of the connected template store
     * @param _didRegistryAddress is the address of the connected DID Registry
     */
    function initialize(
        address _owner,
        address _conditionStoreManagerAddress,
        address _templateStoreManagerAddress,
        address _didRegistryAddress
    )
        public
        initializer()
    {
        require(
            _owner != address(0) &&
            _conditionStoreManagerAddress != address(0) &&
            _templateStoreManagerAddress != address(0) &&
            _didRegistryAddress != address(0),
            'Invalid address'
        );
        Ownable.initialize(_owner);
        conditionStoreManager = ConditionStoreManager(
            _conditionStoreManagerAddress
        );
        templateStoreManager = TemplateStoreManager(
            _templateStoreManagerAddress
        );
        didRegistry = DIDRegistry(
            _didRegistryAddress
        );
    }

    /**
     * @dev Create a new agreement.
     *      The agreement will create conditions of conditionType with conditionId.
     *      Only "approved" templates can access this function.
     * @param _id is the ID of the new agreement. Must be unique.
     * @param _did is the bytes32 DID of the asset. The DID must be registered beforehand.
     * @param _conditionTypes is a list of addresses that point to Condition contracts.
     * @param _conditionIds is a list of bytes32 content-addressed Condition IDs
     * @param _timeLocks is a list of uint time lock values associated to each Condition
     * @param _timeOuts is a list of uint time out values associated to each Condition
     * @return the size of the agreement list after the create action.
     */
    function createAgreement(
        bytes32 _id,
        bytes32 _did,
        address[] memory _conditionTypes,
        bytes32[] memory _conditionIds,
        uint[] memory _timeLocks,
        uint[] memory _timeOuts
    )
        public
        returns (uint size)
    {
        require(
            templateStoreManager.isTemplateApproved(msg.sender) == true,
            'Template not Approved'
        );
        require(
            didRegistry.getBlockNumberUpdated(_did) > 0,
            'DID not registered'
        );
        require(
            _conditionIds.length == _conditionTypes.length &&
            _timeLocks.length == _conditionTypes.length &&
            _timeOuts.length == _conditionTypes.length,
            'Arguments have wrong length'
        );

        // create the conditions in condition store. Can fail if conditionID already exists.
        for (uint256 i = 0; i < _conditionTypes.length; i++) {
            conditionStoreManager.createCondition(
                _conditionIds[i],
                _conditionTypes[i],
                _timeLocks[i],
                _timeOuts[i]
            );
        }
        agreementList.create(
            _id,
            _did,
            msg.sender,
            _conditionIds
        );

        emit AgreementCreated(
            _id,
            _did,
            msg.sender,
            msg.sender
        );

        return getAgreementListSize();
    }

    /**
     * @dev Get agreement with _id.
     *      The agreement will create conditions of conditionType with conditionId.
     *      Only "approved" templates can access this function.
     * @param _id is the ID of the agreement.
     * @return the agreement attributes.
     */
    function getAgreement(bytes32 _id)
        external
        view
        returns (
            bytes32 did,
            address didOwner,
            address templateId,
            bytes32[] memory conditionIds,
            address lastUpdatedBy,
            uint256 blockNumberUpdated
        )
    {
        did = agreementList.agreements[_id].did;
        didOwner = didRegistry.getDIDOwner(did);
        templateId = agreementList.agreements[_id].templateId;
        conditionIds = agreementList.agreements[_id].conditionIds;
        lastUpdatedBy = agreementList.agreements[_id].lastUpdatedBy;
        blockNumberUpdated = agreementList.agreements[_id].blockNumberUpdated;
    }

    /**
     * @dev Get the DID owner for this agreement with _id.
     * @param _id is the ID of the agreement.
     * @return the DID owner associated with agreement.did from the DID registry.
     */
    function getAgreementDIDOwner(bytes32 _id)
        external
        view
        returns (address didOwner)
    {
        bytes32 did = agreementList.agreements[_id].did;
        return didRegistry.getDIDOwner(did);
    }

    /**
     * @return the length of the agreement list.
     */
    function getAgreementListSize()
        public
        view
        returns (uint size)
    {
        return agreementList.agreementIds.length;
    }

    /**
     * @param _did is the bytes32 DID of the asset.
     * @return the agreement IDs for a given DID
     */
    function getAgreementIdsForDID(bytes32 _did)
        public
        view
        returns (bytes32[] memory)
    {
        return agreementList.didToAgreementIds[_did];
    }
}
