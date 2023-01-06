import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
//import { getDocsLink } from '../utils/getDocsLink'
import { assetRootPath } from '../utils/image'
import { useRouter } from 'next/router'
import { Typography } from '@originprotocol/origin-storybook'

const termsURL = `${process.env.NEXT_PUBLIC_WEBSITE_URL}/tos`
const privacyURL = `${process.env.NEXT_PUBLIC_WEBSITE_URL}/privacy`

export default function Footer({ locale }) {
  const { pathname } = useRouter()

  return (
    <>
      <footer>
        <div className="max-w-screen-[1432px] mx-auto relative overflow-hidden px-8 md:px-[64px] lg:px-[134px] py-10 lg:pt-32 lg:pb-10 divide-[#ffffff33] divide-y-2 text-white">
          <div className="flex flex-col lg:flex-row justify-between pb-10 lg:pb-[88px] text-left">
            <div className="relative w-28 h-8 lg:w-32 mb-10 lg:mb-0">
              <Image
                src={assetRootPath(`/images/origin-white.svg`)}
                fill
                sizes='(max-width: 768px) 112px, 56px'
                alt='origin'
              />
            </div>
            <div className="flex flex-col lg:flex-row justify-between">
              <Link
                href={'https://governance.ousd.com/'}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 lg:mr-10"
              >
                <Typography.Body3 className="text-[#fafbfb]">
                  Governance
                </Typography.Body3>
              </Link>
              <Link
                href={process.env.NEXT_PUBLIC_DOCS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="lg:mr-10 mt-[20px] lg:mt-2"
              >
                <Typography.Body3 className="text-[#fafbfb]">
                  Docs
                </Typography.Body3>
              </Link>
              <Link
                href={'/blog'}
                target="_blank"
                rel="noopener noreferrer"
                prefetch={false}
                className="lg:mr-10 mt-[20px] lg:mt-2"
              >
                <Typography.Body3 className="text-[#fafbfb]">
                  Blog
                </Typography.Body3>
              </Link>
              {/*<Link
                href={'/faq'}
                target="_blank"
                rel="noopener noreferrer"
                prefetch={false}
                className="lg:mr-10 mt-[20px] lg:mt-2"
              >
                <Typography.Body3 className="text-[#fafbfb]">
                  FAQ
                </Typography.Body3>
              </Link>*/}
              <Link
                href={
                  'https://www.coingecko.com/en/coins/origin-dollar-governance'
                }
                target="_blank"
                rel="noopener noreferrer"
                className="mr-10 mt-[20px] lg:mt-2"
              >
                <Typography.Body3 className="text-[#fafbfb]">
                  OGV
                </Typography.Body3>
              </Link>
              <br className="block lg:hidden" />
              <Link
                href={`${process.env.NEXT_PUBLIC_DAPP_URL}`}
                target="_blank"
                rel="noopener noreferrer"
                className="gradient2 w-full lg:w-[126px] px-6 py-[6px] mt-[20px] lg:mt-0 rounded-full text-center"
              >
                <Typography.Body3 className="font-medium text-white">
                  Get OUSD
                </Typography.Body3>
              </Link>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row justify-between pt-8 lg:pt-10 text-[#b5beca]">
            <Link
              href={process.env.NEXT_PUBLIC_WEBSITE_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Typography.Caption2>
                Originally released by Origin Protocol
              </Typography.Caption2>
            </Link>
            <div className="flex flex-row lg:justify-between mt-2 lg:mt-0">
              <Link
                href={termsURL}
                target="_blank"
                rel="noopener noreferrer"
                className="mr-4"
              >
                <Typography.Caption2>
                  Terms of Service
                </Typography.Caption2>
              </Link>
              <Link href={privacyURL} target="_blank" rel="noopener noreferrer">
                <Typography.Caption2>
                  Privacy Policy
                </Typography.Caption2>
              </Link>
            </div>
          </div>
        </div>
      </footer>
      <style jsx>{`
        footer {
          background-color: #141519;
          color: #fafbfb;
        }
      `}</style>
    </>
  )
}
