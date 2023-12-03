import { NextApiRequest, NextApiResponse } from "next";
import { parse } from "../../utils/preserveJson";
import { BitBadgesApi } from "./bitbadges-api/api";

/**
 * Make sure to specify req.body.address and req.body.chain.
 * 
 * You may customize this challenge verification however you would like. This implementation checks that the block ID used
 * as a nonce is within 60 seconds of the block occurring.
 */
const getAndVerifyMessageForSignature = async (req: NextApiRequest, res: NextApiResponse) => {
  const body = parse(JSON.stringify(req.body)); //little hack to preserve Uint8Arrays

  try {
    const response = await BitBadgesApi.getAuthCode({ signature: body.signature, options: {} });
    return res.status(200).json(response);
  } catch (err) {
    return res.status(400).json({ verified: false, message: `${err}` });
  }
};

export default getAndVerifyMessageForSignature;
