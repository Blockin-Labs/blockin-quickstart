import { NextPage } from 'next/types';
import Header from '../components/header';


const Home: NextPage = () => {

  return (
    <>
      <Header />
      {<>
        <section style={{ textAlign: 'center', marginRight: '10vw', marginLeft: '10vw' }} className='home'>
          <p>
            This is a quickstart example of a website that uses Sign In with BitBadges.
            See documentation <a href="https://blockin.gitbook.io/blockin/developer-docs/in-person-authentication" target="_blank" rel="noreferrer" style={{}}>here</a>.
          </p>
        </section>
      </>}
      <div style={{ minHeight: '10vh' }} />
    </>
  )
}


export default Home
