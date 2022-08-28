import { NextApiRequest, NextApiResponse } from "next";
import { createChallenge, generateNonceUsingLastBlockTimestamp, setChainDriver } from 'blockin';
import { getChainDriver } from "./chainDriverHandlers";

/**
 * This function gets the full challenge string to be signed.
 * 
 * Make sure to specify req.body.address and req.body.chain.
 * 
 * You may customize this challenge however you would like. This implementation gets a recent block ID and uses that
 * as a nonce.
 */
const getChallengeRequest = async (req: NextApiRequest, res: NextApiResponse) => {
    const chainDriver = getChainDriver(req.body.chain);
    setChainDriver(chainDriver);

    const message = await createChallenge(
        {
            domain: 'https://blockin.com',
            statement: 'Sign in to this website via Blockin. You will remain signed in until you terminate your browser session.',
            address: req.body.address,
            uri: 'https://blockin.com/login',
            nonce: '0x12345',
            expirationDate: '2022-12-22T18:19:55.901Z',
            notBefore: undefined,
            resources: []
        },
        req.body.chain
    );

    return res.status(200).json({ message });
};

export default getChallengeRequest;
