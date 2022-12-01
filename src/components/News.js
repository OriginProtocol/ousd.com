import { Card, Select } from '@originprotocol/origin-storybook'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { assetRootPath } from '../utils/image'
import { capitalize } from 'lodash'
import withIsMobile from 'hoc/withIsMobile'

const Category = ({ categories, category, setCategory }) => {
  const [open, setOpen] = useState()
  const categoriesFormatted = [
    {
      id: null,
      name: 'All news',
      unavailable: false,
    },
  ].concat(
    categories.map((category) => {
      return {
        id: category.slug,
        name: capitalize(category.name),
        unavailable: false,
      }
    })
  )

  return (
    <div
      className='relative w-[200px]'
      tabIndex='1'
      onBlur={() => setOpen(false)}
    >
      <div
        className='relative z-20 w-[200px] px-6 py-3.5 gradient2 rounded-full cursor-pointer'
        onClick={() => {
          setOpen(!open)
        }}
      >
        <div className='flex flex-row justify-between'>
          {category || 'All news'}
          <Image
            src={assetRootPath(`/images/caret-white.svg`)}
            width='20'
            height='12'
            alt='arrow'
          />
        </div>
      </div>
      <div
        className={`absolute z-10 top-16 w-[200px] bg-[#1e1f25] drop-shadow-ousd rounded-lg cursor-pointer ${open ? '' : 'hidden'}`}
      >
        {categoriesFormatted.map((c, i) => {
          return (
            <div
              className={`w-full text-left px-6 py-3.5 hover:text-[#fafbfb] hover:bg-gradient-to-r hover:from-[#8c66fc] hover:to-[#0274f1] ${i === 0 ? 'rounded-t-lg' : ''} ${i === categoriesFormatted.length - 1 ? 'rounded-b-lg' : ''}`}
              onClick={() => {
                setCategory(c.name === 'All news' ? '' : c.name)
                setOpen(false)
              }}
              key={i}
            >
              {c.name}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const News = ({ articles, meta, categories, isMobile }) => {
  const [loaded, setLoaded] = useState(false)
  const perPage = isMobile ? 3 : 9

  useEffect(() => {
    setLoaded(true)
  }, [])

  const [category, setCategory] = useState('')
  const [page, setPage] = useState(1)
  const [pageNumbers, setPageNumbers] = useState([])

  const categoryArticles = category ? articles.filter((article) => article.category.slug === category) : articles

  const articlePages = Math.ceil(
    (category
      ? categoryArticles.length
      : meta.pagination.total) / perPage
  )
  const currentPageArticles = articles
    ? categoryArticles.slice(perPage * (page - 1), perPage * page)
    : []

  useEffect(() => {
    const pages = articlePages

    let pageNumbers = [1, 2, pages, pages - 1, page, page - 1, page + 1]
    pageNumbers = pageNumbers.filter((number) => number > 0 && number <= pages)
    pageNumbers = [...new Set(pageNumbers)]
    pageNumbers = pageNumbers.sort((a, b) => a - b)
    setPageNumbers(pageNumbers)
  }, [page, articlePages])

  return (
    <>
      {loaded && currentPageArticles && (
        <div>
          <Category
            categories={categories}
            category={category}
            setCategory={setCategory}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 md:mt-20">
            {currentPageArticles.map((a, i) => {
              if (!category || category === a.category.slug) {
                return (
                  <Card
                    webProperty={'ousd'}
                    title={a.title}
                    img={
                      <Image
                        src={
                          a.cardCover?.url ||
                          a.cover?.url ||
                          assetRootPath('/images/logos/origin-press.svg')
                        }
                        alt={a.cover?.alternativeText}
                        width='0'
                        height='0'
                        sizes='100vw'
                        className='w-full h-auto'
                      />
                    }
                    body={a.description}
                    linkText={'Read more'}
                    linkHref={`/${a.slug}`}
                    key={a.title}
                  />
                )
              }
            })}
          </div>
          <div className="flex justify-center mt-12 md:mt-20 space-x-2">
            <div
              className='flex items-center justify-center w-[33px] h-[33px] cursor-pointer'
              onClick={() => {
                setPage(page - 1)
              }}
              >
              <Image
                src={assetRootPath(`/images/arrow-left.svg`)}
                width='10'
                height='5'
                className={`${page === 1 ? 'hidden' : ''}`}
                alt='arrow'
              />
            </div>
            {pageNumbers.map((pageNumber, index) => {
              const isCurrent = pageNumber === page
              const skippedAPage =
                index > 0 && pageNumber - pageNumbers[index - 1] !== 1

              return (
                <div className="flex" key={pageNumber}>
                  {skippedAPage && (
                    <div className="flex items-center justify-center text-[#fafbfb]">
                      ...
                    </div>
                  )}
                  <div
                    className={`w-[33px] h-[33px] text-[#fafbfb] cursor-pointer ${
                      isCurrent ? 'rounded-[6px] gradient2' : ''
                    } flex items-center justify-center`}
                    onClick={() => {
                      if (isCurrent) {
                        return
                      }
                      setPage(pageNumber)
                    }}
                  >
                    {pageNumber}
                  </div>
                </div>
              )
            })}
            <div
              className='flex items-center justify-center w-[33px] h-[33px] cursor-pointer'
              onClick={() => {
                setPage(page + 1)
              }}
              >
              <Image
                src={assetRootPath(`/images/arrow-right.svg`)}
                width='10'
                height='5'
                className={`${page === pageNumbers.length ? 'hidden' : ''}`}
                alt='arrow'
              />
            </div>
          </div>
        </div>
      )}
      <style jsx>{`
        @media (max-width: 799px) {
          .container {
            display: grid;
            grid-template-columns: repeat(1, 1fr);
            grid-gap: 5vw;
          }
        }
      `}</style>
    </>
  )
}

export default withIsMobile(News)
