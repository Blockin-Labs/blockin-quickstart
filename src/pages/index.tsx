import getConfig from 'next/config';
import { NextPage } from 'next/types';
import { getPrivateInfo } from '../chain_handlers_frontend/backend_connectors';
import Header from '../components/header';

const { publicRuntimeConfig } = getConfig();

const IS_DEMO = publicRuntimeConfig.IS_DEMO

const Home: NextPage = () => {
  const SecretInfoButton = <>
    <button className='blockin-button' style={{ width: 200 }} onClick={async () => {
      try {
        const res = await getPrivateInfo();
        console.log(res.message);
        alert(res.message);
      } catch (e) {
        alert('Error');
        console.log(e);
      }
    }}>
      Get Secret Password
    </button>
  </>

  return (
    <>
      <Header />

      {IS_DEMO && <>
        <main>
          <section className='home'>
            <h2>Welcome to the Blockin Demo!</h2>
            <p>You may select the Simulated option to interact with this demo without connecting a wallet.</p>
            <hr />
            <p>Learn more about Blockin by checking out the <a href="https://blockin.gitbook.io/blockin/" target="_blank" rel="noreferrer" style={{}}>documentation</a> or the <a href="https://github.com/Blockin-Labs" target="_blank" rel="noreferrer" style={{}}>source code</a>!</p>
          </section>
        </main>
      </>}
      {!IS_DEMO && <>

        <div className='flex-center'>
          {SecretInfoButton}
        </div>
        <br />
        <br />
        <section style={{ textAlign: 'center', marginRight: '10vw', marginLeft: '10vw' }} className='home'>
          <h2 >Welcome to the Blockin Quickstart Site using Next.js!</h2>
          <p>This quickstart repo starts you with a template for Blockin. This is a complete version that implements all authentication logic directly in the site, rather than outsourcing it.
            See the outsourced quickstart repo if you want to outsource.

          </p>
        </section>

        <ul style={{ marginRight: '10vw', marginLeft: '10vw' }}>
          <li>CTRL + F TODO to find all the places you need to handle and implement your own logic.</li>
          <li>Create a valid .env file. See .env.example for an example env file. You may not need / want all variables.</li>
          <li>Edit the ChainDrivers as needed for your requirements.</li>
          <li>To verify assets from a snapshot rather than from an API, you can use the options to the verifyChallenge call for each ChainDriver. See the Blockin docs for more details.</li>
          <li>You will have to implement custom logic, like generating and verify nonces yourself or ensuring sign ins are one-time use only; see the Blockin docs.</li>
        </ul>
      </>}
      <br />

      <div style={{ minHeight: '10vh' }} />

    </>
  )
}


export default Home
