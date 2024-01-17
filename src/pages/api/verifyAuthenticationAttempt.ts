import { NextApiRequest, NextApiResponse } from "next";
import { BitBadgesApi } from "./bitbadges-api";
import cookie from 'cookie';
import { constructChallengeObjectFromString } from "blockin";
import { BigIntify } from "bitbadgesjs-proto";
import { getChainForAddress } from "bitbadgesjs-utils";

const verifyAuthenticationAttempt = async (req: NextApiRequest, res: NextApiResponse) => {
  const body = req.body;

  try {
    const params = constructChallengeObjectFromString(body.message, BigIntify);
    const response = await BitBadgesApi.verifySignInGeneric({ message: body.message, chain: body.chain, signature: body.signature, options: body.options });
    if (response.success) {
      //If success, the Blockin message is verified. This means you now know the signature is valid and any assets specified are owned by the user. 
      //We have also checked that the message parameters match what is expected and were not altered by the user (via body.options.expectedChallengeParams).

      //TODO: You now implement any additional checks or custom logic for your application, such as assigning sesssions, cookies, etc.
      //It is also important to prevent replay attacks.
      //You can do this by storing the message and signature in a database and checking that it has not been used before. 
      //Or, you can check the signature was recent.
      //For best practices, they should be one-time use only.
      if (params.issuedAt && new Date(params.issuedAt).getTime() < Date.now() - 1000 * 60 * 5) {
        return res.status(400).json({ verified: false, message: 'This sign-in is too old' });
      } else if (!params.issuedAt || !params.expirationDate) {
        return res.status(400).json({ verified: false, message: 'This sign-in does not have an issuedAt timestamp' });
      }


      // TODO: This can be replaced with other session methods, as well.
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
      return res.status(200).json({ verified: true, message: 'Successfully verified signature' });
    } else {
      return res.status(400).json({ verified: false, message: 'Blockin verification failedd' });
    }
  } catch (err) {
    return res.status(400).json({ verified: false, message: `${err}` });
  }
};

export default verifyAuthenticationAttempt;
