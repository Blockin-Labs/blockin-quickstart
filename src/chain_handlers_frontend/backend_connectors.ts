import { ChallengeParams } from "blockin";
import { stringify } from "../utils/preserveJson";


const getChallengeFromBlockin = async (chain: string, address: string, assetIds: string[]): Promise<string> => {
  const data = await fetch('../api/getChallenge', {
    method: 'post',
    body: JSON.stringify({
      address,
      assetIds,
      chain
    }),
    headers: { 'Content-Type': 'application/json' }
  }).then(res => res.json());

  return data.message;
}

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

export const verifyChallengeOnBackend = async (chain: string, originalBytes: Uint8Array, signatureBytes: Uint8Array) => {
  const bodyStr = stringify({ originalBytes, signatureBytes, chain }); //hack to preserve uint8 arrays
  const verificationRes = await fetch('../api/verifyChallenge', {
    method: 'post',
    body: bodyStr,
    headers: { 'Content-Type': 'application/json' }
  }).then(res => res.json());

  return verificationRes;
}