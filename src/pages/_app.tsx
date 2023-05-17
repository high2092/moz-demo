import '../../public/css/reset.css';
import { Provider } from 'react-redux';
import { store } from '../store';
import { ModalContainer } from '../components/ModalContainer';

const App = ({ Component, pageProps }) => {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
      <ModalContainer />
    </Provider>
  );
};

export default App;
