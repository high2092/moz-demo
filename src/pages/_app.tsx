import '../../public/css/reset.css';
import '../../public/css/index.css';
import { Provider } from 'react-redux';
import { store } from '../store';
import { ModalContainer } from '../components/ModalContainer';
import { useEffect, useState } from 'react';

const App = ({ Component, pageProps }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const promise =
      typeof window === 'undefined'
        ? new Promise<void>((resolve) => {
            import('../server/node').then((s) => {
              s.server.listen();
              resolve();
            });
          })
        : new Promise<void>((resolve) => {
            import('../server/browser').then((w) => {
              w.worker.start();
              resolve();
            });
          });

    promise.then(() => setLoaded(true));
  }, [loaded]);

  if (!loaded) return <></>;

  return (
    <Provider store={store}>
      <Component {...pageProps} />
      <ModalContainer />
    </Provider>
  );
};

export default App;
