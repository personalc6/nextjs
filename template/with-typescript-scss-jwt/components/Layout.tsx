import className from 'classnames/bind'
import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import style from '../styles/Home.module.scss'
import { useAuth } from './AuthProvider'
import Link from 'next/link'

const cx = className.bind(style)

const Layout: NextPage = ({
    title = 'Test Wecentive',
    children
}: any) => {
    const { auth, logout } = useAuth()

    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <header>
                <pre>
                    <code>{JSON.stringify(useAuth())}</code>
                </pre>
                {!auth.isLogin ? (
                    <Link href="/login"><button>로그인</button></Link>
                ) : (
                    <button onClick={logout}>로그아웃</button>
                )}
            </header>
            <div>
                {children}
            </div>
            <footer>
                footer
            </footer>
        </>
    )
}

export default Layout
