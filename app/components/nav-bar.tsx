'use client';

import { HamburgerIcon } from '@chakra-ui/icons';
import {
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import BookUsButton from './book-us-btn';

const links = [
  {
    id: 1,
    title: 'About',
    url: '/about',
  },
  {
    id: 2,
    title: 'Services',
    url: '/services',
  },
  {
    id: 3,
    title: 'FAQs',
    url: '/faq',
  },
  {
    id: 4,
    title: 'Contact',
    url: '/contact',
  },
];

const NavBar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef<HTMLButtonElement>(null);

  const pathname = usePathname();

  const isActive = (path: string) => {
    return path === pathname;
  };

  return (
  <nav className='bg-white h-20 flex items-center'>
    <div className='container flex justify-between items-center'>
      <Link href='/' className='block'>
        <div className='relative h-10 w-[160px] md:h-14 md:w-[220px]'>
          <Image
            src='/logo/ecoexpert-black-mixed.png'
            alt='ecoexpert cleaning solutions services limited'
            fill
            className='object-contain'
            priority
          />
        </div>
      </Link>

      <div className='hidden md:flex items-center justify-between w-2/3'>
        <ul className='flex gap-10'>
          {links.map((link) => (
            <li
              key={link.id}
              className={`hover:text-lemon ${
                isActive(link.url) ? 'underline text-semibold' : ''
              }`}
            >
              <Link href={link.url}>{link.title}</Link>
            </li>
          ))}
        </ul>
        <BookUsButton variant='outline' />
      </div>

      <button ref={btnRef} onClick={onOpen} className='md:hidden'>
        <HamburgerIcon fontSize={20} />
      </button>

      <Drawer isOpen={isOpen} onClose={onClose} placement='right'>
        <DrawerOverlay />
        <DrawerContent className='px-8 pt-4'>
          <div className='flex items-center mb-10'>
            <div className='relative h-10 w-[160px]'>
              <Image
                src='/logo/ecoexpert-black-mixed.png'
                alt='ecoexpert cleaning solutions services limited'
                fill
                className='object-contain'
                priority
              />
            </div>
            <DrawerCloseButton />
          </div>

          <ul className='flex flex-col gap-10 mb-16 text-lg'>
            {links.map((link) => (
              <li
                key={link.id}
                className={
                  isActive(link.url)
                    ? 'text-lemon underline text-semibold'
                    : ''
                }
              >
                <Link href={link.url} onClick={onClose}>
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>

          <BookUsButton variant='outline' />
        </DrawerContent>
      </Drawer>
    </div>
  </nav>
  );
};

export default NavBar;
