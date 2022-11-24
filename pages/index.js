import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Animation from '../src/components/Animation'
import Apy from '../src/components/Apy'
import Allocation from '../src/components/Allocation'
import Collateral from '../src/components/Collateral'
import Ogv from '../src/components/Ogv'
import Footer from '../src/components/Footer'
import Seo from '../src/components/strapi/seo'
import { useRouter } from 'next/router'
import { fetchAPI } from '../lib/api'
import { fetchApy } from '../lib/apy'
import { fetchApyHistory } from '../lib/apyHistory'
import { fetchAllocation } from '../lib/allocation'
import { fetchCollateral } from '../lib/collateral'
import formatSeo from '../src/utils/seo'
import transformLinks from '../src/utils/transformLinks'
import { Typography } from '@originprotocol/origin-storybook'
import { assetRootPath } from '../src/utils/image'
import { audits } from '../src/utils/constants'
import capitalize from 'lodash/capitalize'
//import { useStoreState } from 'pullstate'
//import ContractStore from '../src/stores/ContractStore'
//import useAllocationQuery from '../src/queries/useAllocationQuery'
//import useCollateralQuery from '../src/queries/useCollateralQuery'

const Home = ({ locale, onLocale, seo, navLinks, apy, apyHistory, allocation, collateral = {} }) => {
  const { pathname } = useRouter()
  const active = capitalize(pathname.slice(1))
  const [loaded, setLoaded] = useState()

  /*const allocation = useStoreState(ContractStore, (s) => {
    return s.allocation || {}
  })

  const collateral = useStoreState(ContractStore, (s) => {
    return s.collateral || {}
  })

  const allocationQuery = useAllocationQuery({
    onSuccess: (allocation) => {
      ContractStore.update((s) => {
        s.allocation = allocation
      })
    },
  })

  const collateralQuery = useCollateralQuery({
    onSuccess: (collateral) => {
      ContractStore.update((s) => {
        s.collateral = collateral
      })
    },
  })

  useEffect(() => {
    allocationQuery.refetch()
    collateralQuery.refetch()
  }, [])*/

  useEffect(() => {
    setLoaded(true)
  }, [])

  return (
    <>
      {loaded &&
      <>
      <Seo seo={seo} />
        <Animation navLinks={navLinks} active={active} />
        <Apy apy={apy} apyData={apyHistory} />
        <Allocation allocation={allocation} />
        <Collateral collateral={collateral} allocation={allocation} />
        <section className="home black">
          <div className="py-[120px] px-[16px] md:px-[134px] lg:px-[200px] text-center">
            <Typography.H6
              className="text-[32px] md:text-[56px] leading-[36px] md:leading-[64px]"
              style={{ fontWeight: 700, fontDisplay: 'swap' }}
            >
              Audited by leading security experts
            </Typography.H6>
            <Typography.Body3 className="md:max-w-[943px] mt-[16px] mx-auto text-[#b5beca]" style={{ fontDisplay: 'swap' }}>
              Securing your funds is OUSD’s top priority. Changes to the protocol are reviewed by internal and external auditors on an ongoing basis.
            </Typography.Body3>
            <div className="audits max-w-[1134px] mx-auto mt-20 mb-16 rounded-xl px-[16px] xl:px-[86px] py-6 md:py-[56px]">
              <Typography.H7 className="font-bold" style={{ fontDisplay: 'swap' }}>
                Existing audits
              </Typography.H7>
              <div className="grid grid-rows-2 grid-cols-2 gap-y-10 lg:flex lg:flex-row lg:justify-between mt-6 md:mt-[56px] mx-auto">
                {audits.map((audit, i) => {
                  return (
                    <Link
                      className="mx-auto"
                      href={audit.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      key={audit.name}
                    >
                      <div className="item relative rounded-full w-[140px] h-[140px] md:w-[200px] md:h-[200px] lg:w-[130px] lg:h-[130px] xl:w-[170px] xl:h-[170px] 2xl:w-[200px] 2xl:h-[200px]">
                        <div className="relative h-[56px] md:h-[80px] lg:h-[56px] 2xl:h-[80px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                          <Image
                            src={assetRootPath(
                              `/images/${audit.name
                                .replace(/ /g, '-')
                                .toLowerCase()}.svg`
                            )}
                            layout='fill'
                            sizes='(max-width: 768px) 56px, (max-width: 1024px) 80px, (max-width: 1536px) 56px, 80px'
                          />
                        </div>
                      </div>
                      <Typography.Body className="mt-[8px] md:mt-6 opacity-75" style={{ fontDisplay: 'swap' }}>
                        {audit.name}
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
        <Ogv />
        <style jsx>{`
          .audits {
            background-color: #1e1f25;
          }

          .item {
            background-color: #141519;
          }
        `}</style>
      <Footer locale={locale} />
      </>
        }
    </>
  )
}

export async function getStaticProps() {
  const articlesRes = await fetchAPI('/ousd/blog/en')
  const seoRes = await fetchAPI('/ousd/page/en/%2F')
  const navRes = await fetchAPI('/ousd-nav-links', {
    populate: {
      links: {
        populate: '*',
      },
    },
  })

  const navLinks = transformLinks(navRes.data)

  const apy = await fetchApy()
  const apyHistory = await fetchApyHistory()
  const allocation = await fetchAllocation()
  const collateral = await fetchCollateral()

  return {
    props: {
      articles: articlesRes.data,
      seo: formatSeo(seoRes?.data),
      navLinks,
      apy: apy.apy / 100,
      apyHistory: apyHistory || [],
      allocation,
      collateral,
    },
    revalidate: 5 * 60, // Cache response for 5m
  }
}

export default Home
