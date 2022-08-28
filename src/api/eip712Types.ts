// const MetadataTypes = [
//     { name: 'name', type: 'string' },
//     { name: 'description', type: 'string' },
//     { name: 'image', type: 'string' },
//     { name: 'creator', type: 'string' },
//     { name: 'color', type: 'string' },
//     { name: 'type', type: 'uint256' },
//     { name: 'category', type: 'string' },
//     { name: 'url', type: 'string' },
//     // { name: 'tags', type: 'string[]' },
//     // { name: 'attributes', type: 'object' },
//     { name: 'validFrom', type: 'ValidFromType' },
// ];

// const ValidFromType = [
//     { name: 'start', type: 'uint256' },
//     { name: 'end', type: 'uint256' },
// ];

// const PermissionsTypes = [
//     { name: 'canRevoke', type: 'bool' },
//     { name: 'canMintMore', type: 'bool' },
//     { name: 'canOwnerTransfer', type: 'bool' },
// ];

// const RecipientType = [
//     { name: 'to', type: 'string' },
//     { name: 'amount', type: 'uint256' },
// ];

// const OwnerType = [
//     { name: 'address', type: 'string' },
//     { name: 'amount', type: 'uint256' },
// ];

/**NEW BELOW HERE */

const AmountType = [
    { name: 'amount', type: 'uint256' },
    { name: 'denom', type: 'string' },
]

const FeeType = [
    { name: 'amount', type: 'Amount[]' },
    { name: 'gas', type: 'uint256' },
    { name: 'feePayer', type: 'string' },
]


export const EIP712_BITBADGES_DOMAIN = {
    name: 'BitBadges',
};

// export const EIP712_PENDING_TXN = {
//     Data: [{ name: 'ids', type: 'string[]' }],
//     StandardTxn: StandardTxn,
// };

const RegisterAddressesMsgValueType = [
    { name: 'proposal_id', type: 'uint256' },
    { name: 'voter', type: 'string' },
]

const RegisterAddressesMsgType = [
    { name: 'type', type: 'string' },
    { name: 'value', type: 'RegisterAddressesMsgValue' },
]

const StandardRegisterAddressTxn = [
    { name: 'account_number', type: 'uint256' },
    { name: 'chain_id', type: 'string' },
    { name: 'fee', type: 'Fee' },
    { name: 'memo', type: 'string' },
    { name: 'msgs', type: 'RegisterAddressesMsg[]' },
    { name: 'sequence', type: 'uint256' },
];

export const EIP712_REGISTER_ADDRESS_TXN = {
    Amount: AmountType,
    Fee: FeeType,
    RegisterAddressesMsgValue: RegisterAddressesMsgValueType,
    RegisterAddressesMsg: RegisterAddressesMsgType,
    StandardTxn: StandardRegisterAddressTxn,
};

export const EIP712_TXN_TYPE_IDS = {
    EIP712_REGISTER_ADDRESS_TXN: 0,
    // EIP712_CREATE_BADGE_TXN: 0,
    // EIP712_MINT_TXN: 1,
    // EIP712_PENDING_TXN: 2,
    // EIP712_REVOKE_TXN: 3,
    // EIP712_LOCK_TXN: 4,
    // EIP712_TRANSFERMANAGER_TXN: 5,
    // EIP712_MINTREQUEST_TXN: 6,
    // EIP712_MINTAPPROVAL_TXN: 7,
    // EIP712_REMOVEAPPROVAL_TXN: 8,
};

// export const EIP712_CREATE_BADGE_TXN = {
//     ValidFromType: ValidFromType,
//     Metadata: MetadataTypes,
//     Permissions: PermissionsTypes,
//     Recipient: RecipientType,
//     Data: [
//         { name: 'metadata', type: 'Metadata' },
//         { name: 'recipients', type: 'Recipient[]' },
//         { name: 'permissions', type: 'Permissions' },
//     ],
//     StandardTxn: StandardTxn,
// };

// export const EIP712_MINT_TXN = {
//     Recipient: RecipientType,
//     Data: [
//         { name: 'recipients', type: 'Recipient[]' },
//         { name: 'badgeId', type: 'string' },
//     ],
//     StandardTxn: StandardTxn,
// };

// export const EIP712_REVOKE_TXN = {
//     Owner: OwnerType,
//     Data: [
//         { name: 'owners', type: 'Owner[]' },
//         { name: 'badgeId', type: 'string' },
//     ],
//     StandardTxn: StandardTxn,
// };

// export const EIP712_LOCK_TXN = {
//     Data: [{ name: 'badgeId', type: 'string' }],
//     StandardTxn: StandardTxn,
// };

// export const EIP712_TRANSFERMANAGER_TXN = {
//     Data: [
//         { name: 'badgeId', type: 'string' },
//         { name: 'newManager', type: 'string' },
//     ],
//     StandardTxn: StandardTxn,
// };

// export const EIP712_MINTREQUEST_TXN = {
//     Data: [
//         { name: 'badgeId', type: 'string' },
//         { name: 'amount', type: 'uint256' },
//     ],
//     StandardTxn: StandardTxn,
// };

// export const EIP712_MINTAPPROVAL_TXN = {
//     Data: [
//         { name: 'badgeId', type: 'string' },
//         { name: 'amount', type: 'uint256' },
//         { name: 'approvedAddress', type: 'string' },
//     ],
//     StandardTxn: StandardTxn,
// };

// export const EIP712_REMOVEAPPROVAL_TXN = {
//     Data: [{ name: 'approvalId', type: 'string' }],
//     StandardTxn: StandardTxn,
// };


