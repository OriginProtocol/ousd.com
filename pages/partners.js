import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Head from "next/head"
import { Typography, Header } from '@originprotocol/origin-storybook'
import Footer from '../src/components/Footer'
import { fetchAPI } from '../lib/api'
import Seo from '../src/components/strapi/seo'
import formatSeo from '../src/utils/seo'
import transformLinks from '../src/utils/transformLinks'

const Partners = ({ locale, onLocale, seo, navLinks, partners }) => {
  const [category, setCategory] = useState()
  
  const categoryPartners = partners?.filter((partner) => {
    return partner.category === category || !category
  })

  const categories = [...new Set(partners?.map((partner) => {
    return partner.category
  }))]

  return (
    <>
      <Head>
        <title>Partners</title>
      </Head>
      <Seo seo={seo} />
      <section className="partners black">
        <Header mappedLinks={navLinks} webProperty="ousd" active={'Partners'} />
        <div className='px-8 md:px-16 lg:px-[134px] pb-[132px] text-left'>
          <div className='max-w-[1432px] mx-auto mt-5 md:mt-16'>
            <Typography.H2 as="h1" className='text-[40px] leading-[40px] md:text-[64px] md:leading-[72px]' style={{ fontWeight: 500 }}>
              Partners
            </Typography.H2>
            <Typography.Body3 className='max-w-[943px] mt-2 md:mt-6 text-[16px] md:text-[20px] leading-[28px] md:leading-[36px] text-[#b5beca]'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </Typography.Body3>
            <div className='flex flex-row mt-10 md:mt-20 space-x-4 md:space-x-10'>
              <div
                className='cursor-pointer'
                onClick={() => {
                  setCategory('')
                }}>
                <Typography.Body className={`text-[16px md:text-[24px] leading-[28px] md:leading-[32px] ${category ? '' : 'text-[#0074f0]'}`} style={{ fontWeight: 700 }}>
                  All
                </Typography.Body>
                <div className={`h-1 mt-1 md:mt-1.5 rounded-full bg-[#0074f0] ${category ? 'hidden' : ''}`}></div>
              </div>
              {categories?.map((c, i) => {
                return (
                  <div
                    className='cursor-pointer'
                    onClick={() => {
                      setCategory(c)
                    }}
                    key={i}>
                    <Typography.Body className={`text-[16px md:text-[24px] leading-[28px] md:leading-[32px] ${category === c ? 'text-[#0074f0]' : ''}`} style={{ fontWeight: 700 }}>
                      {c}
                    </Typography.Body>
                    <div className={`h-1 mt-1 md:mt-1.5 rounded-full bg-[#0074f0] ${category === c ? '' : 'hidden'}`}></div>
                  </div>
                )
              })}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-x-8 md:gap-y-6 mt-10 md:mt-20">
              {categoryPartners?.map((partner, i) => {
                return (
                  <Link
                    href={partner.partnerUrl}
                    target='_blank'
                    className="p-8 rounded-[8px] bg-[#1e1f25] cursor-pointer"
                    key={i}
                  >
                    <Image
                      src={partner.logo}
                      width='85'
                      height='85'
                      alt="Logo"
                    />
                    <Typography.H4 className='mt-6 text-[24px] leading-[32px]' style={{ fontWeight: 400 }}>
                      {partner.name}
                    </Typography.H4>
                    <Typography.Body3 className='mt-6 text-[16px leading-[28px] text-[#b5beca]'>
                      {partner.description}
                    </Typography.Body3>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </section>
      <Footer locale={locale} />
    </>
  )
}

export async function getStaticProps() {
  const partnerRes = await fetchAPI('/ousd-partners')
  const seoRes = await fetchAPI('/ousd/page/en/%2Fpartners')
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
      partners: partnerRes?.data || null,
      seo: formatSeo(seoRes?.data),
      navLinks,
    },
    revalidate: 5 * 60, // Cache response for 5m
  }
}

export default Partners
