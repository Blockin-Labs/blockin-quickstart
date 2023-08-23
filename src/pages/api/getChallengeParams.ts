import { ChallengeParams, setChainDriver } from 'blockin';
import { NextApiRequest, NextApiResponse } from "next";
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

  const challengeParams: ChallengeParams<number> = {
    //TODO: Customize 
    domain: 'https://blockin.com',
    statement: 'Sign in to this website via Blockin. You will remain signed in until you terminate your browser session.',
    address: req.body.address,
    uri: 'https://blockin.com/login',
    nonce: '123456789', //TODO: Replace with your scheme
    notBefore: undefined,

    //The following don't matter bc they will be overriden by the display modal
    expirationDate: '2024-12-22T18:19:55.901Z',
    resources: [],
    assets: [],
  }

  return res.status(200).json(challengeParams);
};

export default getChallengeParamsRequest;
