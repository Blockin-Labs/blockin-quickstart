/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import { BlockinDisplay } from './blockin_display';

const Header = () => {
  return (
    <>
      <header>
        <h1 className='banner'>
          <div style={{ backgroundColor: 'white', alignItems: 'center', display: 'flex' }}>
            <img src="./blockin-zoomed.png" alt="blockin" height={43} width={43} className='blockin-new-logo' />
          </div>
          LOCKIN</h1>


      </header >
      <br />
      <BlockinDisplay />
      <br />
      <br />
      <br />
    </>
  )
}

export default Header;