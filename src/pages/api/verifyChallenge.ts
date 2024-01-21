import { BigIntify, getChainForAddress } from 'bitbadgesjs-utils';
import { constructChallengeObjectFromString, verifyChallenge } from 'blockin';
import cookie from 'cookie';
import { NextApiRequest, NextApiResponse } from "next";
import { getChainDriver } from "./chainDriverHandlers";
import { challengeParams } from './getChallengeParams';
/**
 * You may customize this challenge verification however you would like.
 */
const verifyChallengeRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  const chainDriver = getChainDriver(req.body.chain);
  const body = req.body

  try {
    const params = constructChallengeObjectFromString(body.message, BigIntify);
    const verificationResponse = await verifyChallenge(
      chainDriver,
      body.message,
      body.signature,
      {
        expectedChallengeParams: {
          domain: challengeParams.domain,
          statement: challengeParams.statement,
          uri: challengeParams.uri,
          // address: challengeParams.address,
          // version: challengeParams.version,
          // chainId: challengeParams.chainId,
          // nonce: challengeParams.nonce
          // notBefore: challengeParams.notBefore,
          // issuedAt: challengeParams.issuedAt,
          // expirationDate: challengeParams.expirationDate,
          // resources: challengeParams.resources,
          // assets: challengeParams.assets,
        },
        //TODO: Add any additional verification checks here (including your nonce check)
        // beforeVerification: () => {}
        //TODO: Add your snapshot here for offline balance checks
        // balancesSnapshot
      }
    );


    //If success, the Blockin message is verified. This means you now know the signature is valid and any assets specified are owned by the user. 
    //We have also checked that the message parameters match what is expected and were not altered by the user (via body.options.expectedChallengeParams).

    //TODO: You now implement any additional checks or custom logic for your application, such as assigning sesssions, cookies, etc.
    //It is also important to prevent replay attacks.
    //You can do this by storing the message and signature in a database and checking that it has not been used before. 
    //Or, you can check the signature was recent.
    //For best practices, they should be one-time use only.
    if (params.issuedAt && new Date(params.issuedAt).getTime() < Date.now() - 1000 * 60 * 5) {
      return res.status(400).json({ success: false, errorMessage: 'This sign-in is too old' });
    } else if (!params.issuedAt || !params.expirationDate) {
      return res.status(400).json({ success: false, errorMessage: 'This sign-in does not have an issuedAt timestamp' });
    }


    // TODO:This can be replaced with other session methods, as well.
    const sessionData = {
      chain: getChainForAddress(params.address),
      address: params.address,
      nonce: params.nonce,
    };

    // Set the session cookie
    res.setHeader('Set-Cookie', cookie.serialize('session', JSON.stringify(sessionData), {
      httpOnly: true, // Make the cookie accessible only via HTTP (not JavaScript)
      expires: new Date(params.expirationDate),
      path: '/', // Set the cookie path to '/'
      sameSite: 'strict', // Specify the SameSite attribute for security
      secure: process.env.NODE_ENV === 'production', // Ensure the cookie is secure in production
    }));

    return res.status(200).json({ verified: true, message: verificationResponse.message });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ verified: false, message: `${err}` });
  }
};

export default verifyChallengeRequest;
