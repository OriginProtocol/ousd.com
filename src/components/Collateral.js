import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Typography } from '@originprotocol/origin-storybook'
import { assetRootPath } from '../utils/image'
import { PieChart } from 'react-minimal-pie-chart'
import { formatCurrency } from '../utils/math'
import { tokenColors } from '../utils/constants'

const Collateral = ({ collateral, allocation }) => {
  // temporary calculation, waiting for metastrategy integration into analytics
  const meta = allocation.strategies?.find((s) => {
    return s.name === 'OUSD MetaStrategy'
  }).ousd

  const total =
    collateral.collateral?.reduce((t, s) => {
      return {
        total: Number(t.total) + Number(s.name === 'ousd' ? 0 : s.total),
      }
    }).total

  const chartData = collateral.collateral?.map((token) => {
    return {
      title: token.name.toUpperCase(),
      value: total
        ? (token.name === 'ousd' ? 0 : (token.total - meta / 3) / total) * 100
        : 0,
      color: tokenColors[token.name] || '#ff0000',
    }
  })

  const tokenNames = {
    'dai': 'Dai',
    'usdc': 'USD Coin',
    'usdt': 'Tether',
    'ousd': 'Origin Dollar',
  }

  return (
    <>
      <section className="dim">
        <div className="py-[120px] px-[16px] md:px-[64px] lg:px-[134px] text-center">
          <Typography.H6
            className="text-[32px] md:text-[56px] leading-[36px] md:leading-[64px]"
            style={{ fontWeight: 700 }}
          >
            Always 100% collateralized
          </Typography.H6>
          <Typography.Body3 className="md:max-w-[943px] mt-[16px] mx-auto leading-[28px] text-[#b5beca]">
            OUSD is backed 1:1 by the most trusted collateral in crypto. Reserves are verifiable on-chain. You can redeem OUSD immediately at any time.
          </Typography.Body3>
          <div className="max-w-[1432px] mx-auto mt-20 mb-10 md:mb-20 px-8 xl:px-[132px] py-6 xl:py-20 rounded-xl bg-[#141519]">
            <div className='flex flex-col md:flex-row justify-between'>
              <div className="relative w-full sm:w-1/2 mx-auto my-auto rounded-full p-4 bg-[#1e1f25]">
                <PieChart data={chartData} lineWidth={6} startAngle={270} />
                <div className="absolute left-1/2 bottom-1/2 -translate-x-1/2 translate-y-[16px] md:translate-y-[20px]">
                  <Typography.H6 className='text-[16px] md:text-[24px] leading-[32px]'>Total</Typography.H6>
                  <Typography.H6 className='md:mt-3 text-[24px] md:text-[40px] leading-[32px] md:leading-[40px]'>{`$${formatCurrency(
                  total,
                  0
                )}`}</Typography.H6>
                  </div>
              </div>
              <div className="md:w-1/2 md:ml-10 xl:ml-32 mt-6 md:my-auto pl-0 md:py-10 text-left">
                <div className="flex flex-col justify-between space-y-2">
                  {collateral.collateral?.map((token) => {
                    if (token.name === 'ousd') return
                    return (
                      <div
                        className="flex flex-row md:my-0 px-4 py-[13.5px] md:p-6 rounded-[8px] bg-[#1e1f25] w-full md:max-w-[351px] space-x-3 md:space-x-[22px]"
                        key={token.name}
                      >
                        <div className='relative w-12 md:w-[48px]'>
                          <Image
                            src={assetRootPath(`/images/${token.name}-logo.svg`)}
                            fill
                            sizes='(max-width: 768px) 48px, 24px'
                            alt={token.name}
                          />
                        </div>
                        <div className="">
                          <div className='flex flex-row space-x-2'>
                            <Typography.H7 className="text-[14px] md:text-[20px]" style={{ fontWeight: 700 }}>
                              {`${tokenNames[token.name]}`}
                            </Typography.H7>
                            <Typography.H7 className="text-[14px] md:text-[20px]" style={{ fontWeight: 400 }}>
                              {`(${token.name.toUpperCase()})`}
                            </Typography.H7>
                          </div>
                          <div className='flex flex-row space-x-2'>
                            <Typography.Body className="text-[12px] md:text-[16px]" style={{ fontWeight: 700 }}>
                              {`${formatCurrency((token.total / total) * 100, 2)}%`}
                            </Typography.Body>
                            <Typography.Body
                              className="text-[12px] md:text-[16px] text-[#b5beca]"
                              style={{ fontWeight: 400 }}
                            >
                              {`$${formatCurrency(token.total, 0)}`}
                            </Typography.Body>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
            
          </div>
          <Link
            href="https://docs.ousd.com/how-it-works"
            target="_blank"
            rel="noopener noreferrer"
            className="bttn gradient2"
          >
            <Typography.H7 className="font-normal">
              See how it works
            </Typography.H7>
          </Link>
        </div>
      </section>
    </>
  )
}

export default Collateral
