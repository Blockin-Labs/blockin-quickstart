/* eslint-disable react-hooks/exhaustive-deps */
import Image from 'next/image'
import { useState } from 'react';
import Link from 'next/link';
import { BlockinIcon } from './icons';
import { BlockinDisplay } from './blockin_display';

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