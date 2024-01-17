import { NextApiRequest, NextApiResponse } from "next";

const checkSignIn = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    //Check the cookie
    const session = req.cookies.session;
    if (!session) {
      return res.status(401).json({ signedIn: false, message: 'You are not signed in' });
    }

    const details = JSON.parse(session);

    return res.status(200).json({
      chain: details.chain,
      address: details.address,
      signedIn: true, message: 'Successfully signed in'
    });
  } catch (err) {
    return res.status(401).json({ signedIn: false, message: `${err}` });
  }
};

export default checkSignIn;
