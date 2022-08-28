import { NextPage } from 'next/types'
import Header from '../components/header'
const Home: NextPage = () => {
    return (
        <>
            <Header />
            <section style={{ textAlign: 'center', marginRight: '20vw', marginLeft: '20vw' }} className='home'>
                <h2 >Welcome to the Blockin Quickstart Site using Next.js!</h2>
                <p>This quickstart repo starts you with a template for Web 3.0 sign-in with Blockin. Note that you can also add Web 2.0 sign-in options and let your users choose between the two.</p>
                <p>The pages/api folder is for your backend. Everything else is for your frontend. The backend and frontend should be decoupled.</p>
                <p>You must create a .env file with valid environment variables if you use functions that call an API from the ChainDriver. See .env.example for an example env file.</p>
                <p>By default, this repo uses some functions that call an API through ChainDriver, so it is assumed that you have a valid .env set. You may use Blockin without API calls if you only need it for challenge signature / verification (no block info / asset lookups). </p>
                <p>If you would like to use this repo without the API calls, you will need to change the following to the pages/api folder files: 1) remove details from ChainDriver constructors relating to APIs (leave undefined), 2) remove anything to do with nonce generation / verification using block indexes from verfiyChallenge.ts, getChallenge.ts, and getChallengeParams.ts (you will have to implement generating and verify nonces yourself; see the Blockin docs). </p>
                <p>The ENS resolution may be a bit slow because it currently uses the default shared API keys for all users of <a href="https://docs.ethers.io/v5/api/providers/#providers-getDefaultProvider" target="_blank" rel="noreferrer">getDefaultProvider from ethers.js.</a> (click the link to add your own API keys). This is defined in the selectedChainInfo prop of blockin_button.tsx. You may also choose to implement a new ENS resolution function if you wish.</p>


            </section>
        </>
    )
}

export default Home
