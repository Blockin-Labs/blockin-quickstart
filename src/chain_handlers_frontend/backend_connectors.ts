import { ChallengeParams } from "blockin";

export const getChallengeParams = async (chain: string, address: string): Promise<ChallengeParams<string>> => {
  const data = await fetch('../api/getChallengeParams', {
    method: 'post',
    body: JSON.stringify({
      address,
      chain
    }),
    headers: { 'Content-Type': 'application/json' }
  }).then(res => res.json());

  return data;
}

export const verifyChallengeOnBackend = async (chain: string, message: string, signature: string) => {
  const bodyStr = JSON.stringify({ message, signature, chain });
  const verificationRes = await fetch('../api/verifyChallenge', {
    method: 'post',
    body: bodyStr,
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