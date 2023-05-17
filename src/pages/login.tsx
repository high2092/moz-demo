import { HOST } from '../../constants';

const LoginPage = () => {
  return (
    <div>
      <a href={`${HOST}/auth/login/kakao`}>
        <img src="image/kakao_login_large.png" />
      </a>
    </div>
  );
};

export default LoginPage;
