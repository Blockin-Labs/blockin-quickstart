import { NextPage } from 'next/types'
import Header from '../components/header'
const Home: NextPage = () => {
    return (
        <>
            <Header />
            <section style={{ textAlign: 'center' }} className='home'>
                <h2 >Welcome to the Blockin Quickstart Site using Next.js!</h2>
                <p>The pages/api folder is for your backend. Everything else is for your frontend. The backend and frontend should be decoupled.</p>
                <p>You must create a .env file with valid environment variables. See .env.example for an example env file.</p>
            </section>
        </>
    )
}

export default Home
