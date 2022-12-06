import { createTheme } from '@mui/material/styles'

export const apyDayOptions = [7, 30, 365]
export const DEFAULT_SELECTED_APY = 30

export const theme = createTheme({
  palette: {
    'compound-strategy': {
      main: '#00d592',
    },
    'aave-strategy': {
      main: '#7a26f3',
    },
    'convex-strategy': {
      main: '#ff5a5a',
    },
    'morpho-strategy': {
      main: '#9bc3e9',
    },
  },
})

export const strategyMapping = {
  'Compound Strategy': {
    token: 'Compound',
    tokenPrefix: 'c',
    description: 'Compound is an interest rate protocol allowing lenders to earn yield on digital assets by supplying them to borrowers. Each loan is over-collateralized to ensure repayment. OUSD deploys stablecoins to three of the Compound V2 markets and earns interest approximately every 12 seconds. Additional yield is generated from protocol token incentives (COMP), which are regularly sold for USDT on Uniswap and compounded.',
  },
  'Aave Strategy': {
    token: 'Aave',
    tokenPrefix: 'a',
    description: 'Aave is a liquidity protocol where users can participate as suppliers or borrowers. Each loan is over-collateralized to ensure repayment. OUSD deploys stablecoins to three of the Aave V2 markets and earns interest approximately every 12 seconds. Additional yield is generated from protocol token incentives (AAVE), which are regularly sold for USDT on Uniswap and compounded.',
  },
  'Convex Strategy': {
    token: 'Convex',
    tokenPrefix: '',
    description: 'Convex allows liquidity providers and stakers to earn greater rewards from Curve, a stablecoin-centric automated market maker (AMM). OUSD earns trading fees and protocol token incentives (both CRV and CVX). This strategy employs base pools and metapools, including the Origin Dollar factory pool, which enables OUSD to safely leverage its own deposits to multiply returns and maintain the pool’s balance.',
  },
  'Morpho Strategy': {
    token: 'Compound',
    tokenPrefix: 'c',
    description: 'Morpho adds a peer-to-peer layer on top of Compound and Aave allowing lenders and borrowers to be matched more efficiently with better interest rates. When no matching opportunity exists, funds flow directly through to the underlying protocol. OUSD supplies stablecoins to three of Morpho’s Compound markets to earn interest. Additional yield is generated from protocol token incentives, including both COMP (regularly sold for USDT) and MORPHO (currently locked).',
  },
}

export const tokenColors = {
  usdc: '#2775ca',
  dai: '#f4b731',
  usdt: '#26a17b',
  ousd: '#000000',
}

export const audits = [
  {
    name: 'OpenZeppelin',
    link: 'https://github.com/OriginProtocol/security/blob/master/audits/OpenZeppelin%20-%20Origin%20Dollar%20-%20October%202021.pdf',
  },
  {
    name: 'Trail of bits',
    link: 'https://github.com/OriginProtocol/security/blob/master/audits/Trail%20of%20Bits%20-%20Origin%20Dollar%20-%20Dec%202020.pdf',
  },
  {
    name: 'Certora',
    link: 'https://www.certora.com/wp-content/uploads/2022/02/OriginFeb2021.pdf',
  },
  {
    name: 'Solidified',
    link: 'https://github.com/OriginProtocol/security/blob/master/audits/Solidified%20-%20Origin%20Dollar%20-%20Dec%202020.pdf',
  },
]

export const sanitizationOptions = {
  allowedTags: [
    'b',
    'i',
    'em',
    'strong',
    'u',
    'a',
    'img',
    'h1',
    'h2',
    'h3',
    'span',
    'p',
    'ul',
    'ol',
    'li',
    'br',
    'figure',
  ],
  allowedAttributes: {
    a: ['href', 'target', 'rel'],
    img: ['src', 'alt', 'srcset', 'sizes'],
    span: ['style'],
    ul: ['style'],
    ol: ['style'],
  },
  allowedIframeHostnames: ['www.youtube.com'],
}
