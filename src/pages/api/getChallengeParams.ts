import { ChallengeParams } from 'blockin';
import { NextApiRequest, NextApiResponse } from "next";



export const challengeParams: ChallengeParams<number> = {
  //TODO: Customize 
  domain: 'https://blockin.com',
  statement: 'Signing in allows you to prove ownership of your account and unlock additional features for this site.',
  address: '',
  uri: 'https://blockin.com/login',
  nonce: '123456789', //TODO: Implement a one-time-use nonce
  notBefore: undefined,
  issuedAt: new Date().toISOString(),
  expirationDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),

  //The following currently don't matter bc they will be overriden by the UI display modal
  resources: [],
  assets: [],
}
/**
 * This function gets a full challenge object.
 * 
 * Make sure to specify req.body.address and req.body.chain.
 * 
 * You may customize this challenge however you would like. This implementation gets a recent block ID and uses that
 * as a nonce.
 */
const getChallengeParamsRequest = async (req: NextApiRequest, res: NextApiResponse) => {

  return res.status(200).json({
    ...challengeParams,
    address: req.body.address,
    issuedAt: new Date().toISOString(),
    expirationDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
  });
};

export default getChallengeParamsRequest;
