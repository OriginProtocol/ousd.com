import React from 'react'
import { Typography, Header } from '@originprotocol/origin-storybook'
import News from '../src/components/News'
import { useRouter } from 'next/router'
import Footer from '../src/components/Footer'
import { fetchAPI } from '../lib/api'
import Seo from '../src/components/strapi/seo'
import formatSeo from '../src/utils/seo'
import transformLinks from '../src/utils/transformLinks'
import { capitalize } from 'lodash'

const Blog = ({
  locale,
  onLocale,
  articles,
  meta,
  categories,
  seo,
  navLinks,
}) => {
  const { pathname } = useRouter()
  const active = capitalize(pathname.slice(1))

  return (
    <>
      <Seo seo={seo} />
        <section className='bg-[#141519]'>
          <Header mappedLinks={navLinks} webProperty="ousd" active={active} />
          <div className="max-w-screen-2xl mt-20 px-8 md:px-[134px] pb-[120px]">
            <Typography.H2 as="h1" className="font-normal">
              Latest news
            </Typography.H2>
          </div>
        </section>
        <section className='bg-[#1e1f25]'>
        <div className="max-w-screen-2xl pt-20 pb-[120px] px-8 md:px-[134px]">
            {!articles?.length ? null : (
              <News articles={articles} meta={meta} categories={categories} />
            )}
          </div>
        </section>
        <Footer locale={locale} />
    </>
  )
}

export async function getStaticProps() {
  // Run API calls in parallel
  const articlesRes = await fetchAPI('/ousd/blog/en')

  const categories = {}
  articlesRes?.data?.forEach((article) => {
    if (article && article.category) {
      categories[article.category.slug] = article.category
    }
  })

  const seoRes = await fetchAPI('/ousd/page/en/%2Fblog')
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
      articles: articlesRes?.data || null,
      meta: articlesRes?.meta || null,
      categories: Object.values(categories),
      seo: formatSeo(seoRes?.data),
      navLinks,
    },
    revalidate: 5 * 60, // Cache response for 5m
  }
}

export default Blog
