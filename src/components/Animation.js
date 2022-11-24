import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Typography, Header } from '@originprotocol/origin-storybook'
//import CountUp from 'react-countup'
//import AccountListener from 'components/AccountListener'
import { assetRootPath } from '../utils/image'
import { useStoreState } from 'pullstate'
import ContractStore from '../stores/ContractStore'
import { formatCurrency } from '../utils/math'
import { adjustLinkHref } from '../utils/utils'

const Animation = ({ navLinks, active }) => {
  const [totalOusd, setTotalOusd] = useState()
  const ousdInitialValue = parseFloat(totalOusd - 2000000, 0)
  const [ousdValue, setOusdValue] = useState(ousdInitialValue)
  const ousd = useStoreState(ContractStore, (s) => s.ousd || 0)

  const goodTempo = 10000

  /*useEffect(() => {
    if (!totalOusd) return
    return animateValue({
      from: ousdInitialValue,
      to:
        parseFloat(totalOusd),
      callbackValue: (value) => {
        setOusdValue(formatCurrency(value, 0))
      },
      duration: 10 * 1000, // animate for 1 hour
      id: 'hero-index-ousd-animation',
    })
  }, [])*/

  useEffect(() => {
    if (!ousd) {
      return
    }
    const fetchTotalSupply = async () => {
      const total = await ousd.totalSupply().then((r) => Number(r) / 10 ** 18)
      setTotalOusd(total)
    }
    fetchTotalSupply()
  }, [ousd])

  return (
    <>
      <section className="intro black">
        <Header mappedLinks={navLinks} webProperty="ousd" active={active} />
        {/*<AccountListener />*/}
        <div className="mt-[20px] lg:mt-16 px-8 md:px-[64px] lg:px-[134px] lg:pb-40 overflow-hidden">
          <div className='flex flex-col lg:flex-row justify-between max-w-[1432px] mx-auto'>
            <div className="lg:w-1/2 xl:w-7/12">
              <Typography.H2 as="h1" className="font-normal">
                The self-custodial{' '}
                <br className="hidden md:block" />
                <span className="text-gradient2 font-bold py-1">
                  yield-generating,{' '}
                </span>
                <br className="hidden lg:block" />
                stablecoin
              </Typography.H2>
              <Typography.Body3 className="mt-6 mb-10 text-[#b5beca]">
                Origin Dollar simplifies DeFi by eliminating the need for staking or lock-ups. Hold OUSD in any Ethereum wallet and watch your balance increase every day.
              </Typography.Body3>
              <Link href={`${process.env.NEXT_PUBLIC_DAPP_URL}/swap`} target="_blank" className="bttn ml-0 gradient2 w-auto">
                <Typography.H7 className="mx-8 md:mx-0 font-normal">
                  Get OUSD
                </Typography.H7>
              </Link>
            </div>
            <div className="container self-end lg:self-start flex-1 relative mt-20 lg:mt-14 xl:mt-0 md:pb-10">
              <div className="hidden lg:block">
                <div className="relative w-[382px] h-[382px] m-auto pb-4">
                  <Image
                    src={assetRootPath('/images/ousd.svg')}
                    fill
                    sizes='382px'
                    alt="ousd"
                  />
                </div>
              </div>
              <div className="lg:absolute lg:bottom-0 lg:left-0 lg:right-0 text-center">
                <div className="relative h-32 md:h-64 lg:h-auto flex flex-row lg:block">
                  {totalOusd && (
                    <div className="absolute right-20 md:right-36 md:top-10 lg:static z-10">
                      <Typography.H2
                        //className="xl:ml-16 2xl:ml-20 text-left"
                        style={{ fontWeight: 700 }}
                      >
                        {`$${formatCurrency(totalOusd, 0)}`}
                        {/*
                          <CountUp
                            start={0}
                            end={totalOusd}
                            duration={5}
                            useEasing
                            includeComma
                            formattingFn={(num) => {
                              return `$${formatCurrency(num, 0)}`
                            }}
                          />
                        */}
                      </Typography.H2>
                      <Typography.Body3 className="text-sm md:text-base text-[#b5beca] pt-[0px] md:pt-[8px]">
                        Total value of OUSD wallet balances
                      </Typography.Body3>
                    </div>
                  )}
                  <div className="absolute -top-12 -right-12 z-0 block lg:hidden">
                    <div className="relative ousd ml-3 w-40 h-40 md:w-64 md:h-64">
                      <Image
                        src={assetRootPath('/images/ousd.svg')}
                        fill
                        sizes='(max-width: 768px) 160px, 256px'
                        alt="ousd"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Animation
