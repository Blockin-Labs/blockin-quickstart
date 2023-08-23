/* eslint-disable react-hooks/exhaustive-deps */
import Link from 'next/link';
import { BlockinDisplay } from './blockin_display';
import { BlockinIcon } from './icons';

const Header = () => {
  return (
    <>
      <header>
        <Link href={'/'}>
          <a>
            <h1 className='banner'>BL<BlockinIcon dimensions='40pt' />CKIN</h1>
          </a>
        </Link>

        <BlockinDisplay />
      </header >
    </>
  )
}

export default Header;