import type { NextPage } from 'next'
import { useAuth } from '../components/AuthProvider'
import Layout from '../components/Layout'
import styles from '../styles/Home.module.scss'

const Home: NextPage = () => {
    const { auth } = useAuth()

    return (
        <Layout>
            <span>{auth.user?.id}</span>
        </Layout>
    )
}

export default Home
