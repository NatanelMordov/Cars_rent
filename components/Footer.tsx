import Image from "next/image";
import Link from "next/link";
import { footerLinks } from "@/constants";
import { title } from "process";

const Footer = () => {
  return (
    <footer className="flex flex-col text-black-100 mt-5 border-t border-gray-100">
        <div className='flex max-md:flex-col flex-wrap justify-between gap-5 sm:px-16 px-6 py-10'>
          <div className='flex flex-col justify-start items-start gap-6'>
            <Image src="/logo (1).svg" alt="logo" width={130} height={20} className="object-contain" />
              <p className='text-base text-gray-700'>
                   M&N Cars <br />
              </p>
          </div>
          <div className="footer__links">
        {footerLinks.map((item) => (
          <div key={item.title} className="footer__link">
            <h3 className="font-bold">{item.title}</h3>
            <div className="flex flex-col gap-5">
              {item.links.map((link) => (
                <Link
                  key={link.title}
                  href={link.url}
                  className="text-gray-500"
                >
                  {link.title}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
    </footer>
  )
}

export default Footer