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


export const getPrivateInfo = async (): Promise<any> => {
  const verificationRes = await fetch('../api/getPrivateInfo', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' }
  }).then(res => res.json());

  return verificationRes;
}

export const signOut = async (): Promise<any> => {
  const verificationRes = await fetch('../api/signOut', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' }
  }).then(res => res.json());

  return verificationRes;
}

export const checkSignIn = async (): Promise<any> => {
  const verificationRes = await fetch('../api/checkSignIn', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' }
  }).then(res => res.json());

  return verificationRes;
}