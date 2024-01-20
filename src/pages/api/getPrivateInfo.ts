import { NextApiRequest, NextApiResponse } from "next";

const getPrivateInfo = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    //Check the cookie
    const session = req.cookies.session;
    if (!session) {
      return res.status(401).json({ message: 'You must be signed in to access this.' });
    }

    return res.status(200).json({ message: 'The password is: super secret password' });
  } catch (err) {
    return res.status(400).json({ message: `${err}` });
  }
};

export default getPrivateInfo;
