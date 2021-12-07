import { GetServerSideProps, NextPage } from 'next'
import { useState } from 'react'
import { useAuth } from '../../components/AuthProvider'
import Layout from '../../components/Layout'

const Login: NextPage = () => {
    const [id, setId] = useState<string>('')
    const [pw, setPw] = useState<string>('')
    const { login } = useAuth()

    const handleClickLogin = () => {
        login(id, pw)
    }

    return (
        <Layout>
            <input type="text" placeholder="id" value={id} onChange={e => setId(e.currentTarget.value)} />
            <input type="text" placeholder="pw" value={pw} onChange={e => setPw(e.currentTarget.value)} />
            <button onClick={handleClickLogin}>login</button>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async ctx => {
    console.log(ctx.req.cookies)
    
    return {
        props: {

        }
    }
}

export default Login
