import React, { useState } from 'react';
import { Layout, Typography, Avatar, Button } from 'antd';
import { PRIMARY_TEXT } from '../constants';
import { getAbbreviatedAddress } from '../utils/AddressUtils';
import { useChainContext } from '../chain_handlers_frontend/ChainContext';
import Blockies from 'react-blockies'
import { Address } from './Address';
import { signAndSubmitTxn } from '../api/api';
import { EIP712_REGISTER_ADDRESS_TXN } from '../api/eip712Types';

const { Content } = Layout;

export function ConfirmManager({ setCurrStepNumber }: { setCurrStepNumber: (stepNumber: number) => void; }) {
    const chain = useChainContext();
    const [transactionIsLoading, setTransactionIsLoading] = useState(false);
    const [txnSubmitted, setTxnSubmitted] = useState(false);
    const [addressNotRegistered, setAddressNotRegistered] = useState(true); //TODO:
    const address = chain.address;

    return (
        <div>
            <div
                style={{
                    padding: '0',
                    textAlign: 'center',
                    color: PRIMARY_TEXT,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 20,
                }}
            >
                <Avatar
                    size={150}
                    src={
                        <Blockies
                            seed={address.toLowerCase()}
                            size={40}
                        />
                    }
                />

                <div style={{ marginBottom: 10, marginTop: 4 }}>
                    <Address
                        address={address}
                        fontSize={'2em'}
                        showTooltip
                    />
                </div>
            </div>

            <Button
                type="primary"
                style={{ width: '100%' }}
                loading={transactionIsLoading}
                disabled={!address || txnSubmitted}
                onClick={async () => {
                    if (addressNotRegistered) {
                        setTxnSubmitted(true);
                        setTransactionIsLoading(true);

                        try {

                            const data = {
                                "account_number": 1527075,
                                "chain_id": "evmos_9001-2",
                                "fee": {
                                    "amount": [
                                        {
                                            "amount": 0,
                                            "denom": "aevmos"
                                        }
                                    ],
                                    "gas": 350000,
                                    "feePayer": "evmos1uqxan5ch2ulhkjrgmre90rr923932w38fjqlj5"
                                },
                                "memo": "",
                                "msgs": [
                                    {
                                        "type": "cosmos-sdk/MsgVote",
                                        "value": {
                                            "proposal_id": 50,
                                            "voter": "evmos1uqxan5ch2ulhkjrgmre90rr923932w38fjqlj5",
                                            "option": 1
                                        }
                                    }
                                ],
                                "sequence": 0,
                            };

                            console.log(data);

                            await chain.signTxn(EIP712_REGISTER_ADDRESS_TXN, data)

                            await signAndSubmitTxn('/badges/registerAddresses', data);

                            setTransactionIsLoading(false);
                            setAddressNotRegistered(false);
                        } catch (err) {
                            setTxnSubmitted(false);
                            setTransactionIsLoading(false);
                        }
                    } else {
                        setCurrStepNumber(1);
                    }
                }}

            >
                {addressNotRegistered ?
                    <>Address is not registered. Would you like to register it (one-time fee)?
                    </>
                    :
                    <>
                        {address ? (
                            <>
                                {'Use ' +
                                    getAbbreviatedAddress('ETH: ' + address) + '?'}
                            </>
                        ) : (
                            'Please connect wallet.'
                        )}
                    </>}
            </Button>
            <Typography style={{ color: 'lightgrey' }}>
                *To use a different wallet, please disconnect and
                reconnect with a new wallet.
            </Typography>
        </div >
    )
}