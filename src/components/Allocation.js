import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Typography } from '@originprotocol/origin-storybook'
import { assetRootPath } from '../utils/image'
import LinearProgress from '@mui/material/LinearProgress'
import { ThemeProvider } from '@mui/material/styles'
import { formatCurrency } from '../utils/math'
import { theme, strategyMapping } from '../utils/constants'

const Allocation = ({ strategies }) => {
  const [open, setOpen] = useState({})

  const total = strategies?.reduce((t, s) => {
    return { total: t.total + s.total }
  }).total

  const meta = strategies.find((s) => s.name === 'OUSD MetaStrategy')

  const strategiesSorted = strategies.map((s) => {
    if (s.name === 'Convex Strategy') return {...s, total: s.total + meta.total}
    return {...s}
  }).sort((a, b) => a.total - b.total).reverse()

  // strategy handling needs some thought

  return (
    <>
      <section className="black">
        <div className="px-[16px] md:px-[64px] lg:px-[134px] py-14 md:py-[120px] text-center">
          <Typography.H6
            className="text-[32px] md:text-[56px] leading-[36px] md:leading-[64px]"
            style={{ fontWeight: 500 }}
          >
            Fully transparent on the Ethereum blockchain
          </Typography.H6>
          <Typography.Body3 className="md:max-w-[943px] mt-[16px] mx-auto leading-[28px] text-[#b5beca]">
            Funds are deployed to automated, on-chain, blue-chip stablecoin strategies. There are no gatekeepers or centralized money managers and governance is entirely decentralized.
          </Typography.Body3>
          <div className="allocation max-w-[1432px] mx-auto mt-20 mb-10 md:mb-20 rounded-xl divide-black divide-y-2">
            <Typography.H7 className="font-bold px-4 py-[22px] md:p-10">
              Current yield sources & allocations
            </Typography.H7>
            <div>
              <Typography.H7 className='flex flex-row justify-between mt-4 md:mt-10 px-8 md:px-[72px] text-[#b5beca]' style={{ fontWeight: 400, lineHeight: '20px' }}>
                <div className='text-[14px] md:text-[16px]'>Yield source</div>
                <div className='text-[14px] md:text-[16px]'>Allocation</div>
              </Typography.H7>
              <div className="flex flex-col px-[16px] md:px-10 pt-2 pb-[10px] md:pt-3 md:pb-8">
                <ThemeProvider theme={theme}>
                  <div className="flex flex-col justify-between">
                    {strategiesSorted?.map((strategy) => {
                      if (
                        strategy.name === 'Vault' ||
                        strategy.name === 'OUSD MetaStrategy'
                      )
                        return

                      return (
                        <div
                          className="strategy rounded-xl border-2 p-[16px] md:p-8 my-[6px] md:my-[8px]"
                          key={strategy.name}
                          onClick={(e) => {
                            e.preventDefault()
                            setOpen({
                              ...open,
                              [strategy.name]: !open[strategy.name],
                            })
                          }}
                        >
                          <div>
                            <div className="flex flex-row justify-between">
                              <div className='relative w-1/3 md:w-1/3 lg:w-1/4'>
                                <Image
                                  src={assetRootPath(
                                    `/images/${strategy.name
                                      .replace(/\s+/g, '-')
                                      .toLowerCase()}.svg`
                                  )}
                                  fill
                                  sizes='(max-width: 768px) 64px, 128px'
                                  objectFit='contain'
                                  objectPosition='0%'
                                  alt={strategy.name}
                                />
                              </div>
                              <div>
                                <Typography.H7
                                  className="inline items-center text-[12px] md:text-[24px] text-[#b5beca]"
                                  style={{ fontWeight: 400 }}
                                >{`$${formatCurrency(
                                  strategy.total,
                                  0
                                )}`}</Typography.H7>
                                <Typography.H7
                                  className="inline pl-[8px] text-[12px] md:text-[24px]"
                                  style={{ fontWeight: 700 }}
                                >{`(${formatCurrency(
                                  (strategy.total / total) * 100,
                                  2
                                )}%)`}</Typography.H7>
                              </div>
                            </div>
                            <LinearProgress
                              variant="determinate"
                              value={(strategy.total / total) * 100}
                              color={`${strategy.name
                                .replace(/\s+/g, '-')
                                .toLowerCase()}`}
                              sx={{
                                bgcolor: '#141519',
                                borderRadius: 10,
                                height: 4,
                              }}
                              className="mt-5"
                            ></LinearProgress>
                            <Typography.Caption2 className={`flex flex-row mt-4 md:hidden text-left space-x-1.5 text-[#b5beca] font-medium ${
                                open[strategy.name] ? 'hidden' : ''
                              }`}>
                              <div>More info</div>
                              <Image
                                src={assetRootPath(`/images/arrow-down.svg`)}
                                width='10'
                                height='6'
                                alt='arrow'
                              />
                            </Typography.Caption2>
                            <div
                              className={`${
                                open[strategy.name] ? '' : 'hidden md:block'
                              }`}
                            >
                              <div className='flex flex-col xl:flex-row mt-[22px] xl:space-x-10 space-y-2 xl:space-y-0'>
                                {strategy.name !== 'Convex Strategy' ? (
                                  <>
                                    <div className="flex flex-row justify-between">
                                      <div className="flex flex-row">
                                        <div className="relative w-6">
                                          <Image
                                            src={assetRootPath(
                                              `/images/${strategyMapping[strategy.name].tokenPrefix}dai.svg`
                                            )}
                                            fill
                                            sizes='(max-width: 768px) 20px, 24px'
                                            alt='dai'
                                          />
                                        </div>
                                        <Typography.Body3 className="pl-[12px] pr-[16px] font-light text-[12px] md:text-[16px]">
                                          {`${strategyMapping[strategy.name].token} DAI`}
                                          </Typography.Body3>
                                      </div>
                                      <Typography.Body3 className="text-[#b5beca] font-light text-[12px] md:text-[16px]">{`${formatCurrency(
                                        (strategy.dai / strategy.total) * 100,
                                        2
                                      )}%`}</Typography.Body3>
                                    </div>
                                    <div className="flex flex-row justify-between">
                                      <div className="flex flex-row">
                                        <div className="relative w-6">
                                          <Image
                                            src={assetRootPath(
                                              `/images/${strategyMapping[strategy.name].tokenPrefix}usdc.svg`
                                            )}
                                            fill
                                            sizes='(max-width: 768px) 20px, 24px'
                                            alt='usdc'
                                          />
                                        </div>
                                        <Typography.Body3 className="pl-[12px] pr-[16px] font-light text-[12px] md:text-[16px]">
                                          {`${strategyMapping[strategy.name].token} USDC`}
                                        </Typography.Body3>
                                      </div>
                                      <Typography.Body3 className="text-[#b5beca] font-light text-[12px] md:text-[16px]">{`${formatCurrency(
                                        (strategy.usdc / strategy.total) * 100,
                                        2
                                      )}%`}</Typography.Body3>
                                    </div>
                                    <div className="flex flex-row justify-between">
                                      <div className="flex flex-row">
                                        <div className="relative w-6">
                                          <Image
                                            src={assetRootPath(
                                              `/images/${strategyMapping[strategy.name].tokenPrefix}usdt.svg`
                                            )}
                                            fill
                                            sizes='(max-width: 768px) 20px, 24px'
                                            alt='usdt'
                                          />
                                        </div>
                                        <Typography.Body3 className="pl-[12px] pr-[16px] font-light text-[12px] md:text-[16px]">
                                          {`${strategyMapping[strategy.name].token} USDT`}
                                        </Typography.Body3>
                                      </div>
                                      <Typography.Body3 className="text-[#b5beca] font-light text-[12px] md:text-[16px]">{`${formatCurrency(
                                        (strategy.usdt / strategy.total) * 100,
                                        2
                                      )}%`}</Typography.Body3>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div className="flex flex-row justify-between">
                                      <div className="flex flex-row">
                                        <div className="relative w-[26px]">
                                          <Image
                                            src={assetRootPath(
                                              `/images/convex-3pool.svg`
                                            )}
                                            fill
                                            sizes='(max-width: 768px) 20px, 24px'
                                            alt='threepool'
                                          />
                                        </div>
                                        <Typography.Body3 className="pl-[12px] pr-[16px] font-light text-left text-[12px] md:text-[16px]">
                                          Convex DAI+USDC+USDT
                                        </Typography.Body3>
                                      </div>
                                      <Typography.Body3 className="text-[#b5beca] font-light text-[12px] md:text-[16px]">{`${formatCurrency(
                                        ((strategy.dai +
                                          strategy.usdc +
                                          strategy.usdt) /
                                          strategy.total) *
                                          100,
                                        2
                                      )}%`}</Typography.Body3>
                                    </div>
                                    <div className="flex flex-row justify-between">
                                    <div className="flex flex-row">
                                      <div className="relative w-6 md:w-10">
                                        <Image
                                          src={assetRootPath(
                                            `/images/convex-meta.svg`
                                          )}
                                          fill
                                          sizes='(max-width: 768px) 20px, 24px'
                                          alt='meta'
                                        />
                                      </div>
                                      <Typography.Body3 className="pl-[12px] pr-[16px] font-light text-[12px] md:text-[16px]">
                                        Convex OUSD+3Crv
                                      </Typography.Body3>
                                    </div>
                                    <Typography.Body3 className="text-[#b5beca] font-light text-[12px] md:text-[16px]">{`${formatCurrency(
                                      ((meta.dai +
                                        meta.usdc +
                                        meta.usdt +
                                        meta.ousd) /
                                        strategy.total) *
                                        100,
                                      2
                                    )}%`}</Typography.Body3>
                                  </div>
                                </>
                                )}
                              </div>
                              <Typography.Body3 className="mt-4 text-[#b5beca] text-left text-[12px] md:text-[14px] leading-[23px]">
                                {strategyMapping[strategy.name].description}
                              </Typography.Body3>
                              <Typography.Body3 className='flex flex-row mt-4 md:hidden text-left space-x-1.5 text-[#b5beca] text-[12px] font-medium'>
                                <div>Less info</div>
                                <Image
                                  src={assetRootPath(`/images/arrow-up.svg`)}
                                  width='10'
                                  height='6'
                                  alt='arrow'
                                />
                              </Typography.Body3>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </ThemeProvider>
              </div>
            </div>
          </div>
          <Link
            href="https://docs.ousd.com/core-concepts/yield-generation"
            target="_blank"
            rel="noopener noreferrer"
            className="bttn gradient2"
          >
            <Typography.H7 className="font-normal">
              See how yield is generated
            </Typography.H7>
          </Link>
        </div>
      </section>
      <style jsx>{`
        .allocation {
          background-color: #1e1f25;
        }

        .strategy {
          background-color: #14151980;
          border-color: #141519;
        }
      `}</style>
    </>
  )
}

export default Allocation
