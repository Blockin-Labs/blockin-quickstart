import { NextPage } from 'next/types';
import Header from '../components/header';


const Home: NextPage = () => {

  return (
    <>
      <Header />
      {<>
        <section style={{ textAlign: 'center', marginRight: '10vw', marginLeft: '10vw' }} className='home'>
          <p>
            This quickstart repo starts you off with Sign In with BitBadges.
            See documentation <a href="https://blockin.gitbook.io/blockin/developer-docs/in-person-authentication" target="_blank" rel="noreferrer" style={{}}>here</a>.
          </p>
        </section>
        <br />
        <ul style={{ marginRight: '10vw', marginLeft: '10vw' }}>
          <li><p>CTRL + F to find all TODO comments in this repository. They will guide you through the steps to customize this site for your needs.</p></li>
          <li><p>If you need users to sign anything (transactions, messages, etc) or more advanced logic, it is recommended you use the complete quickstart repo instead.</p></li>
        </ul >
      </>}
      <div style={{ minHeight: '10vh' }} />
    </>
  )
}


export default Home
