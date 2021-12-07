import '../styles/globals.css';
import type { AppContext, AppProps } from 'next/app';
import { AuthProvider, getUser } from '../components/AuthProvider';
import App from 'next/app'

const MyApp = function ({ Component, pageProps, auth }: any) {
    return (
        <AuthProvider auth={auth}>
            <Component {...pageProps} />
        </AuthProvider>
    )
};

MyApp.getInitialProps = async (appContext: AppContext) => {
    const appProps = await App.getInitialProps(appContext)
    const auth = await getUser(appContext.ctx)
    return { ...appProps, auth }
}

export default MyApp;
