import { BigIntify, BitBadgesAPI } from 'bitbadgesjs-utils';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const BACKEND_URL = publicRuntimeConfig.BITBADGES_API_URL ?? 'https://api.bitbadges.io'

export type DesiredNumberType = bigint;
export const ConvertFunction = BigIntify;

export const BitBadgesApi = new BitBadgesAPI({
  apiUrl: BACKEND_URL,
  apiKey: process.env.BITBADGES_API_KEY ?? '',
  convertFunction: BigIntify
});