import React, { useState, useEffect } from 'react'
import Moment from "react-moment"
import Seo from "./strapi/seo"
import { Typography, Header } from "@originprotocol/origin-storybook"
import Image from "next/image"
import Link from "next/link"
import Footer from "components/Footer"
import styles from "styles/Article.module.css"
import formatSeo from "../utils/seo"
import sanitizeHtml from 'sanitize-html'
import he from 'he'
import { sanitizationOptions } from "utils/constants"

const Article = ({ article, navLinks }) => {
  const [loaded, setLoaded] = useState()
  const imageUrl = article.cover?.url
  const seo = formatSeo(article.seo)

  useEffect(() => {
    setLoaded(true)
  }, [])

  console.log(article.body)

  return (
    <>
      <Seo seo={seo} />
      {loaded && (
        <>
          <Header mappedLinks={navLinks} webProperty="ousd" />
          <div className='bg-[#141519] px-8 md:px-16 lg:px-[134px]'>
            <div className="max-w-[943px] mx-auto">
              <Link href={'/blog'} className="inline-block p-[1px] rounded-full gradient2">
                <div className='w-full h-full px-4 md:px-6 py-1.5 text-center rounded-full bg-[#141519]'>
                  <div className='flex flex-row justify-between space-x-3 md:space-x-5'>
                    <Image
                      src="/images/arrow-left-gradient.svg"
                      width="10"
                      height="6"
                      className=""
                      alt="arrow"
                    />
                    <Typography.Body3 className='text-[12px] md:text-[16px]' style={{ fontWeight: 500 }}>Back to News</Typography.Body3>
                  </div>
                </div>
              </Link>
            </div>
            <div className="max-w-[943px] mx-auto mt-6 md:mt-12">
              <Typography.H4 as="h1" className='text-[24px] md:text-[56px] leading-[32px] md:leading-[72px]'>{article.title}</Typography.H4>
            </div>
            <div className="max-w-[943px] mx-auto mt-3 md:mt-6">
              <Typography.Body3 className='text-[14px] md:text-[16px] text-[#b5beca]'>
                <Moment format="MMMM D YYYY">{article.publishedAt}</Moment>
              </Typography.Body3>
            </div>
          </div>
          <div className='gradient5 px-4 md:px-16 lg:px-[134px]'>
            <div className="relative max-w-[943px] mx-auto mt-8 md:mt-16 rounded-2xl">
              {imageUrl && (
                <div
                  id="banner"
                  className="rounded-2xl overflow-hidden"
                  data-src={imageUrl}
                  data-srcset={imageUrl}
                >
                  <Image
                    src={imageUrl}
                    alt={article.cover?.alternativeText}
                    width='0'
                    height='0'
                    sizes='100vw'
                    className='w-full h-auto'
                    priority
                  />
                </div>
              )}
            </div>
          </div>
          <div className='bg-[#1e1f25] px-8 md:px-16 lg:px-[134px] pt-8 md:pt-16 pb-10 md:pb-[120px]'>
            <div className={`max-w-[943px] mx-auto`}>
              <div
                className={`font-sansSailec ${styles.article}`}
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtml(he.decode(article.body), sanitizationOptions),
                }}
              />
              <div className="flex items-center mt-12 md:mt-20 space-x-6">
                {article.author?.avatar && (
                  <Image
                    src={article.author.avatar.url}
                    alt={article.author.avatar.alternativeText}
                    style={{
                      position: "static",
                      borderRadius: "50%",
                      height: 60,
                    }}
                    width="57"
                    height="57"
                  />
                )}
                <Typography.Body3 className='text-[18px]'>
                  {article.author?.name && (
                    <p>
                      {article.author.name}
                    </p>
                  )}
                </Typography.Body3>
              </div>
            </div>
          </div>
          <Footer />
        </>
      )}
    </>
  );
};

export default Article;