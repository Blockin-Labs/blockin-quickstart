import { ChallengeParams } from "blockin";
import { stringify } from "../utils/preserveJson";

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
  const bodyStr = stringify({ message, signature, chain }); //hack to preserve uint8 arrays
  const verificationRes = await fetch('../api/verifyChallenge', {
    method: 'post',
    body: bodyStr,
    headers: { 'Content-Type': 'application/json' }
  }).then(res => res.json());

  return verificationRes;
}

export const getAndVerifyMessageForSignature = async (sig: string) => {
  const verificationRes = await fetch('../api/getAndVerifySignatureForMessage', {
    method: 'post',
    body: JSON.stringify({ signature: sig }),
    headers: { 'Content-Type': 'application/json' }
  }).then(res => res.json());

  return verificationRes;
}