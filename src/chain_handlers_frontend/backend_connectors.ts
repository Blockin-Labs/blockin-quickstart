import { BigIntify } from "bitbadgesjs-proto";
import { GenericBlockinVerifyRouteSuccessResponse, getChainForAddress } from "bitbadgesjs-utils";
import { VerifyChallengeOptions, constructChallengeObjectFromString } from "blockin";

export const verifyAuthenticationAttempt = async (message: string, sig: string, options?: VerifyChallengeOptions): Promise<GenericBlockinVerifyRouteSuccessResponse> => {
  const chain = getChainForAddress(constructChallengeObjectFromString(message, BigIntify).address);
  const verificationRes = await fetch('../api/verifyAuthenticationAttempt', {
    method: 'post',
    body: JSON.stringify({ message: message, signature: sig, options, chain }),
    headers: { 'Content-Type': 'application/json' }
  }).then(res => res.json());

  return verificationRes;
}