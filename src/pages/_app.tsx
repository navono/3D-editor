import { useRouter } from 'next/router';
import { setState } from '@/helpers/store';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';

import '@/styles/index.css';
import Header from '@/config';
import Dom from '@/components/layout/dom';
import { addTweakpane } from '@/components/layout/panel';

const LCanvas = dynamic(() => import('@/components/layout/canvas'), {
  ssr: true,
});

function App({ Component, pageProps = { title: 'index' } }) {
  // addTweakpane();

  const router = useRouter();
  useEffect(() => {
    setState({ router });
  }, [router]);

  return (
    <>
      {/* <Header title={pageProps.title} /> */}
      <Dom>
        <Component {...pageProps} />
      </Dom>
      {Component?.r3f && <LCanvas>{Component.r3f(pageProps)}</LCanvas>}
    </>
  );
}

export default App;
