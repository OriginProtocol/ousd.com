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
import { assetRootPath } from 'utils/image'

const Faq = ({ locale, onLocale, faq, seo, navLinks }) => {
  const [open, setOpen] = useState({})
  const [loaded, setLoaded] = useState()

  useEffect(() => {
    setLoaded(true)
  }, [])

  return (
    <>
      <Head>
        <title>FAQ</title>
      </Head>
      <Seo seo={seo} />
      {loaded && (
        <>
          <section className="page black">
            <Header mappedLinks={navLinks} webProperty="ousd" active={'FAQ'} />
            <div className='pb-[132px] text-left'>
              <div className="px-8 md:px-16 lg:px-[134px]">
                <div className='max-w-[1432px] mx-auto mt-5 md:mt-16'>
                  <Typography.H2 as="h1" className='text-[40px] leading-[40px] md:text-[64px] md:leading-[72px]' style={{ fontWeight: 500 }}>
                    FAQ
                  </Typography.H2>
                </div>
              </div>
              <div className="px-4 md:px-16 lg:px-[134px]">
                <div className='max-w-[1432px] mx-auto mt-[20px] md:mt-16'>
                  <div className="mt-20 space-y-6">
                    {faq?.map((q, i) => {
                      return (
                        <div
                          className="max-w-[959px] p-[16px] md:p-8 rounded-xl bg-[#1e1f25] text-[#fafbfb] cursor-pointer"
                          key={i}
                          onClick={(e) => {
                            e.preventDefault()
                            setOpen({
                              ...open,
                              [i]: !open[i],
                            })
                          }}
                        >
                          <div className="flex flex-row justify-between">
                            <Typography.H7
                              className="text-base md:text-xl"
                              style={{ fontWeight: 700 }}
                            >
                              {q.attributes.question}
                            </Typography.H7>
                            <Image
                              src={assetRootPath(`/images/caret.svg`)}
                              width='23'
                              height='14'
                              className={`shrink-0 w-4 md:w-6 ml-[16px] md:ml-8 mb-2 inline ${
                                open[i] ? 'rotate-180' : ''
                              }`}
                              alt='caret'
                            />
                          </div>
                          <div className={`${open[i] ? '' : 'hidden'}`}>
                            <Typography.Body3 className="mt-8">
                              {q.attributes.answer}
                            </Typography.Body3>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
              <div className="px-8 md:px-16 lg:px-[134px]">
                <div className='max-w-[1432px] mx-auto mt-[20px] md:mt-16'>
                  <Typography.H5
                    className="text-[20px] md:text-[32px] mt-14 md:mt-15 inline-block"
                    style={{ fontWeight: 700 }}
                  >
                    {'Still have questions?'}
                    <br />
                    {'Reach out to us on '}
                    <Link
                      href="https://originprotocol.com/discord"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {'Discord'}
                    </Link>
                    <div className="h-1 w-[72px] md:w-[116px] mr-0 ml-auto mt-[4px] bg-gradient-to-r from-[#8c66fc] to-[#0274f1] rounded-full"></div>
                  </Typography.H5>
                </div>
              </div>
            </div>
            <Footer locale={locale} />
          </section>
        </>
      )}
    </>
  )
}

export async function getStaticProps() {
  const faqRes = await fetchAPI('/ousd-faqs')
  const seoRes = await fetchAPI('/ousd/page/en/%2Ffaq')
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
      faq: faqRes?.data || null,
      seo: formatSeo(seoRes?.data),
      navLinks,
    },
    revalidate: 5 * 60, // Cache response for 5m
  }
}

export default Faq
