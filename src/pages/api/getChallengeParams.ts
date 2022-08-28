import { NextApiRequest, NextApiResponse } from "next";
import { generateNonceUsingLastBlockTimestamp, setChainDriver } from 'blockin';
import { getChainDriver } from "./chainDriverHandlers";


/**
 * This function gets a full challenge object.
 * 
 * Make sure to specify req.body.address and req.body.chain.
 * 
 * You may customize this challenge however you would like. This implementation gets a recent block ID and uses that
 * as a nonce.
 */
const getChallengeParamsRequest = async (req: NextApiRequest, res: NextApiResponse) => {
    const chainDriver = getChainDriver(req.body.chain);
    setChainDriver(chainDriver);

    return res.status(200).json({
        domain: 'https://blockin.com',
        statement: 'Sign in to this website via Blockin. You will remain signed in until you terminate your browser session.',
        address: req.body.address,
        uri: 'https://blockin.com/login',
        nonce: await generateNonceUsingLastBlockTimestamp(),
        expirationDate: '2022-12-22T18:19:55.901Z',
        notBefore: undefined,
        resources: []
    });
};

export default getChallengeParamsRequest;
