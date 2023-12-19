import { verifyChallenge } from 'blockin';
import { NextApiRequest, NextApiResponse } from "next";
import { parse } from "../../utils/preserveJson";
import { getChainDriver } from "./chainDriverHandlers";
import { NumberType } from 'bitbadgesjs-utils';

/**
 * Make sure to specify req.body.address and req.body.chain.
 * 
 * You may customize this challenge verification however you would like. This implementation checks that the block ID used
 * as a nonce is within 60 seconds of the block occurring.
 */
const verifyChallengeRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  const chainDriver = getChainDriver(req.body.chain);

  const body = parse(JSON.stringify(req.body)); //little hack to preserve Uint8Arrays

  try {
    const verificationResponse = await verifyChallenge(
      chainDriver,
      body.message,
      body.signature,
      (item: NumberType) => { return BigInt(item) },
      {
        //TODO: Add any additional verification checks here (including your nonce check)
        // expectedChallengeParams: {}
        // beforeVerification: () => {}
        //TODO: Add your snapshot here 
        // balancesSnapshot
      }
    );

    /**
     * TODO:
     * Here, Blockin has successfully verified the following five things:
     * 1) Challenge is well-formed
     * 2) Challenge is valid at present time
     * 3) Challenge was signed correctly by user
     * 4) User owns all requested assets at time of signing in
     * 5) Any additional verification checks specified in the verifyChallenge options
     * 
     * Below, you can add any other validity checks that you wish to add.
     *      -You can use chainDriver.functionName where functionName is in the ChainDriver interface.
     *      -You can also use the helper functions exported from Blockin to manipulate and parse challenges
     * For both of the above, check out the Blockin documentation.
     * 
     * Once everything is validated and verified, you can add the logic below to grant the user access to your
     * resource. This can be via any method of your choice, such as:
     *      -JWTs
     *      -Session Tokens
     *      -HTTP Only Cookies
     *      -Just granting the user access
     *      -Or anything else
     */
    return res.status(200).json({ verified: true, message: verificationResponse.message });
  } catch (err) {
    return res.status(400).json({ verified: false, message: `${err}` });
  }
};

export default verifyChallengeRequest;
