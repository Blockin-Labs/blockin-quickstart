import { BigIntify } from "bitbadgesjs-proto";
import { getChainForAddress } from "bitbadgesjs-utils";
import { constructChallengeObjectFromString } from "blockin";
import cookie from 'cookie';
import { NextApiRequest, NextApiResponse } from "next";
import { BitBadgesApi } from "./bitbadges-api";

const verifyAuthenticationAttempt = async (req: NextApiRequest, res: NextApiResponse) => {
  const body = req.body;
  const { message, signature, options } = body;

  try {
    const chain = getChainForAddress(constructChallengeObjectFromString(message, BigIntify).address);
    const verificationResponse = await BitBadgesApi.verifySignInGeneric({ chain, message, signature, options });
    if (!verificationResponse.success) {
      return res.status(400).json({ success: false, errorMessage: 'Did not pass Blockin verification' });
    }


    //If success, the Blockin message is verified. This means you now know the signature is valid and any assets specified are owned by the user. 
    //We have also checked that the message parameters match what is expected and were not altered by the user (via body.options.expectedChallengeParams).

    //TODO: You now implement any additional checks or custom logic for your application, such as assigning sesssions, cookies, etc.
    //It is also important to prevent replay attacks.
    //You can do this by storing the message and signature in a database and checking that it has not been used before. 
    //Or, you can check the signature was recent.
    //For best practices, they should be one-time use only.
    const params = constructChallengeObjectFromString(body.message, BigIntify);
    if (!params.expirationDate) {
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


    //Once the code reaches here, you should considered the user authenticated.
    return res.status(200).json({ success: true });

  } catch (err: any) {
    return res.status(400).json({ success: false, errorMessage: `${err.errorMessage ?? 'Verification failed'}` });
  }
};

export default verifyAuthenticationAttempt;
