import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Head from "next/head"
import Animation from '../src/components/Animation'
import Apy from '../src/components/Apy'
import Allocation from '../src/components/Allocation'
import Collateral from '../src/components/Collateral'
import Ogv from '../src/components/Ogv'
import Footer from '../src/components/Footer'
import { SecretSauce } from "../src/components"
import Seo from '../src/components/strapi/seo'
import { useRouter } from 'next/router'
import { fetchAPI } from '../lib/api'
import { fetchApy } from '../lib/apy'
import { fetchApyHistory } from '../lib/apyHistory'
import { fetchAllocation } from '../lib/allocation'
import { fetchCollateral } from '../lib/collateral'
import { fetchOgvStats } from '../lib/ogv'
import formatSeo from '../src/utils/seo'
import transformLinks from '../src/utils/transformLinks'
import { Typography, Header } from '@originprotocol/origin-storybook'
import { assetRootPath } from '../src/utils/image'
import capitalize from 'lodash/capitalize'
import { setupContracts, fetchTvl } from '../src/utils/contracts'

const Home = ({ locale, onLocale, audits, seo, navLinks, apy, apyHistory, strategies, collateral, initialTvl, ogvStats }) => {
  const { pathname } = useRouter()
  const active = capitalize(pathname.slice(1))
  const [loaded, setLoaded] = useState()

  useEffect(() => {
    setLoaded(true)
  }, [])

  return (
    <>
      <Head>
        <title>Origin Dollar</title>
      </Head>
      <Seo seo={seo} />
      <Animation navLinks={navLinks} active={active} initialTvl={initialTvl} />
      <Apy apy={apy} apyData={apyHistory} />
      <SecretSauce />
      <Allocation strategies={strategies} />
      <Collateral collateral={collateral} strategies={strategies} />
      
      <section className="home black">
        <div className="px-[16px] md:px-[64px] lg:px-[200px] py-14 md:py-[120px] text-center">
          <Typography.H6
            className="text-[32px] md:text-[56px] leading-[36px] md:leading-[64px]"
            style={{ fontWeight: 500 }}
          >
            Audited by leading security experts
          </Typography.H6>
          <Typography.Body3 className="md:max-w-[943px] mt-[16px] mx-auto leading-[28px] text-[#b5beca]" style={{ fontDisplay: 'swap' }}>
            Securing your funds is OUSD’s top priority. Changes to the protocol are reviewed by internal and external auditors on an ongoing basis.
          </Typography.Body3>
          <div className="max-w-[1134px] mx-auto mt-20 mb-10 md:mb-20 rounded-xl px-[16px] xl:px-[86px] py-6 md:py-[56px] bg-[#1e1f25]">
            <div className="grid grid-rows-2 grid-cols-2 gap-y-10 lg:flex lg:flex-row lg:justify-between mx-auto">
              {audits.map((audit, i) => {
                return (
                  <Link
                    className="mx-auto"
                    href={audit.attributes.auditUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={i}
                  >
                    <div className="relative rounded-full w-[140px] h-[140px] md:w-[200px] md:h-[200px] lg:w-[130px] lg:h-[130px] xl:w-[170px] xl:h-[170px] 2xl:w-[200px] 2xl:h-[200px] bg-[#141519]">
                      <div className="relative h-[56px] md:h-[80px] lg:h-[56px] 2xl:h-[80px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <Image
                          src={assetRootPath(
                            `/images/${audit.attributes.name
                              .replace(/ /g, '-')
                              .toLowerCase()}.svg`
                          )}
                          fill
                          sizes='(max-width: 768px) 56px, (max-width: 1024px) 80px, (max-width: 1536px) 56px, 80px'
                          alt={audit.name}
                        />
                      </div>
                    </div>
                    <Typography.Body className="mt-[8px] md:mt-6 opacity-75">
                      {audit.attributes.name}
                    </Typography.Body>
                  </Link>
                )
              })}
            </div>
          </div>
          <Link
            href="https://docs.ousd.com/security-and-risks/audits"
            target="_blank"
            rel="noopener noreferrer"
            className="bttn gradient2"
          >
            <Typography.H7 className="font-normal" style={{ fontDisplay: 'swap' }}>
              Review audits
            </Typography.H7>
          </Link>
        </div>
      </section>
      <Ogv stats={ogvStats} />
      <Footer locale={locale} />
    </>
  )
}

export async function getStaticProps() {
  const { vault, dripper } = setupContracts()
  const initialTvl = await fetchTvl(vault, dripper)
  const apyHistory = await fetchApyHistory()
  const apy = await fetchApy()
  const allocation = await fetchAllocation()
  const collateral = await fetchCollateral()
  const ogvStats = await fetchOgvStats()

  const auditsRes = await fetchAPI('/ousd-audits')
  const seoRes = await fetchAPI('/ousd/page/en/%2F')
  const navRes = await fetchAPI('/ousd-nav-links', {
    populate: {
      links: {
        populate: '*',
      },
    },
  })

  const navLinks = transformLinks(navRes.data)

  return {
    props: {
      audits: auditsRes.data,
      seo: formatSeo(seoRes?.data),
      navLinks,
      initialTvl,
      apy,
      apyHistory: apyHistory || [],
      strategies: allocation.strategies,
      collateral: collateral.collateral,
      ogvStats,
    },
    revalidate: 5 * 60, // Cache response for 5m
  }
}

export default Home
