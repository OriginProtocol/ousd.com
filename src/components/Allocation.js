import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Typography } from '@originprotocol/origin-storybook'
import { assetRootPath } from '../utils/image'
import LinearProgress from '@mui/material/LinearProgress'
import { ThemeProvider } from '@mui/material/styles'
import { formatCurrency } from '../utils/math'
import { theme, protocolDescription } from '../utils/constants'

const Allocation = ({ strategies }) => {
  const [open, setOpen] = useState({})
  const tokens = ['dai', 'usdc', 'usdt']

  const total = strategies?.reduce((t, s) => {
    return { total: t.total + s.total }
  }).total

  let groupByProtocol = function(data) {
    return data.reduce((storage, item) => {
      let group = item.name.replace(/ .*/,'')
      storage[group] = storage[group] || []
      storage[group].push(item)
      return storage
    }, {})
  }

  const protocols = Object.keys(groupByProtocol(strategies)).map((key) => {
    const total = groupByProtocol(strategies)[key].reduce((t, s) => {
      return { total: t.total + s.total }
    }).total
    return {name: key, strats: groupByProtocol(strategies)[key], total: total}
  }).sort((a, b) => a.total - b.total).reverse()

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
                    {protocols?.map((protocol) => {
                      if (protocol.name === 'Vault') return
                      return (
                        <div
                          className="strategy rounded-xl border-2 p-[16px] md:p-8 my-[6px] md:my-[8px]"
                          key={protocol.name}
                          onClick={(e) => {
                            e.preventDefault()
                            setOpen({
                              ...open,
                              [protocol.name]: !open[protocol.name],
                            })
                          }}
                        >
                          <div>
                            <div className="flex flex-row justify-between">
                              <div className='relative w-1/3 md:w-1/3 lg:w-1/4'>
                                <Image
                                  src={assetRootPath(
                                    `/images/${protocol.name
                                      .toLowerCase()}.svg`
                                  )}
                                  fill
                                  sizes='(max-width: 768px) 64px, 128px'
                                  objectFit='contain'
                                  objectPosition='0%'
                                  alt={protocol.name}
                                />
                              </div>
                              <div>
                                <Typography.H7
                                  className="inline items-center text-[12px] md:text-[24px] text-[#b5beca]"
                                  style={{ fontWeight: 400 }}
                                >{`$${formatCurrency(
                                  protocol.total,
                                  0
                                )}`}</Typography.H7>
                                <Typography.H7
                                  className="inline pl-[8px] text-[12px] md:text-[24px]"
                                  style={{ fontWeight: 700 }}
                                >{`(${formatCurrency(
                                  total ? (protocol.total / total) * 100 : 0,
                                  2
                                )}%)`}</Typography.H7>
                              </div>
                            </div>
                            <LinearProgress
                              variant="determinate"
                              value={(protocol.total / total) * 100}
                              color={theme.palette[protocol.name.toLowerCase()] ? `${protocol.name
                                .toLowerCase()}` : 'default'}
                              sx={{
                                bgcolor: '#141519',
                                borderRadius: 10,
                                height: 4,
                              }}
                              className="mt-5"
                            ></LinearProgress>
                            <Typography.Caption2 className={`flex flex-row mt-4 md:hidden text-left space-x-1.5 text-[#b5beca] font-medium ${
                                open[protocol.name] ? 'hidden' : ''
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
                                open[protocol.name] ? '' : 'hidden md:block'
                              }`}
                            >
                              {protocol.name === 'Convex' ? (
                                <div className='flex flex-col xl:flex-row xl:flex-wrap mt-[22px] xl:space-x-10 space-y-2 xl:space-y-0'>
                                  {protocol.strats.map((strategy, i) => {
                                    return (
                                      <div className="flex flex-row justify-between" key={i}>
                                        <div className="flex flex-row">
                                          <div className="relative w-6 md:w-8">
                                            <Image
                                              src={assetRootPath(
                                                `/images/${strategy.name.replace(/\s+/g, '-').toLowerCase()}.svg`
                                              )}
                                              fill
                                              sizes='(max-width: 768px) 20px, 24px'
                                              alt={`${strategy.name}.svg`}
                                            />
                                          </div>
                                          <Typography.Body3 className="pl-[12px] pr-[16px] font-light text-left text-[12px] md:text-[16px]">
                                            {strategy.name}
                                          </Typography.Body3>
                                        </div>
                                        <Typography.Body3 className="text-[#b5beca] font-light text-[12px] md:text-[16px]">{`${formatCurrency(
                                          ((strategy.dai +
                                            strategy.usdc +
                                            strategy.usdt +
                                            strategy.ousd) /
                                            protocol.total) *
                                            100,
                                          2
                                        )}%`}</Typography.Body3>
                                      </div>
                                    )
                                  })}
                                </div>
                              ) : protocol.name === 'Morpho' ? (
                                <>
                                <div className='mt-[22px] space-y-2 xl:space-y-3'>
                                  {protocol.strats.map((strategy, i) => {
                                    return (
                                      <div className='flex flex-col xl:flex-row xl:flex-wrap xl:space-x-10 space-y-2 xl:space-y-0' key={i}>
                                        {tokens.map((token, i) => {
                                          return (
                                            <div className="flex flex-row justify-between whitespace-nowrap" key={i}>
                                              <div className="flex flex-row">
                                                <div className="relative w-6">
                                                  <Image
                                                    src={assetRootPath(
                                                      `/images/${strategy.name.toLowerCase().split(' ')[1]}-${token}.svg`
                                                    )}
                                                    fill
                                                    sizes='(max-width: 768px) 20px, 24px'
                                                    alt={`${strategy.name.toLowerCase().split(' ')[1]}-${token}`}
                                                  />
                                                </div>
                                                <Typography.Body3 className="pl-[12px] pr-[16px] font-light text-[12px] md:text-[16px]">
                                                  {`${strategy.name} ${token.toUpperCase()}`}
                                                </Typography.Body3>
                                              </div>
                                              <Typography.Body3 className="text-[#b5beca] font-light text-[12px] md:text-[16px]">{`${formatCurrency(
                                                protocol.total ? (strategy[token] / protocol.total) * 100 : 0,
                                                2
                                              )}%`}
                                              </Typography.Body3>
                                            </div>
                                          )
                                        })}
                                      </div>
                                      
                                    )
                                  })}
                                    
                                      </div>
                                </>
                              ) : (
                                <>
                                  {protocol.strats.map((strategy, i) => {
                                    return (
                                      <div className='flex flex-col xl:flex-row xl:flex-wrap mt-[22px] xl:space-x-10 space-y-2 xl:space-y-0' key={i}>
                                        {tokens.map((token, i) => {
                                          return (
                                            <div className="flex flex-row justify-between" key={i}>
                                              <div className="flex flex-row">
                                                <div className="relative w-6">
                                                  <Image
                                                    src={assetRootPath(
                                                      `/images/${protocol.name}-${token}.svg`
                                                    )}
                                                    fill
                                                    sizes='(max-width: 768px) 20px, 24px'
                                                    alt='dai'
                                                  />
                                                </div>
                                                <Typography.Body3 className="pl-[12px] pr-[16px] font-light text-[12px] md:text-[16px]">
                                                  {`${protocol.name} ${token.toUpperCase()}`}
                                                  </Typography.Body3>
                                              </div>
                                              <Typography.Body3 className="text-[#b5beca] font-light text-[12px] md:text-[16px]">{`${formatCurrency(
                                                protocol.total ? (strategy[token] / protocol.total) * 100 : 0,
                                                2
                                              )}%`}
                                              </Typography.Body3>
                                            </div>
                                          )
                                        })}
                                      </div>
                                    )
                                  })}
                                </>
                              )}
                              <Typography.Body3 className="mt-4 text-[#b5beca] text-left text-[12px] md:text-[14px] leading-[23px]">
                                {protocolDescription[protocol.name]?.description}
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
