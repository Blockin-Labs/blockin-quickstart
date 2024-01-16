import { NextApiRequest, NextApiResponse } from "next";
import { BitBadgesApi } from "./bitbadges-api";


const verifyAuthenticationAttempt = async (req: NextApiRequest, res: NextApiResponse) => {
  const body = req.body;

  try {
    const response = await BitBadgesApi.verifySignInGeneric({ message: body.message, chain: body.chain, signature: body.signature, options: body.options });
    if (response.success) {
      //If success, the Blockin message is verified. This means you now know the signature is valid and any assets specified are owned by the user. 
      // We have also checked that the message parameters match what is expected and were not altered by the user (via body.options.expectedChallengeParams).

      //TODO: You now implement any additional checks or custom logic for your application, such as assigning sesssions, cookies, etc.
      //TODO: It is also important to prevent replay attacks. 
      //You can do this by storing the message and signature in a database and checking that it has not been used before. For best practices, they should be one-time use only.


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
