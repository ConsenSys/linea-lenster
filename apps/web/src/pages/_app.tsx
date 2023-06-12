import '../styles.css';

import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';

import atypFont from '../font/atyp';
import atypTextFont from '../font/atypText';

const Providers = dynamic(() => import('@components/Common/Providers'), {
  ssr: false
});

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Providers>
      <style jsx global>{`
        body {
          font-family: ${atypTextFont.style.fontFamily};
        }
      `}</style>
      <Component
        {...pageProps}
        className={`${atypFont.variable} ${atypTextFont.variable} ${atypFont.className}`}
      />
    </Providers>
  );
};

export default App;
