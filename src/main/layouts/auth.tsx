import { RefObject, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AuthFooter from '../components/organisms/footer/auth-footer';
import AuthNavbar from '../components/organisms/navbar/auth-navbar';

export const scrollTop = function (mainContentRef: RefObject<HTMLDivElement>) {
  document.documentElement.scrollTop = 0;
  if (document.scrollingElement) {
    document.scrollingElement.scrollTop = 0;
  }
  if (mainContentRef.current) {
    mainContentRef.current.scrollTop = 0;
  }
};

function AuthLayout() {
  const location = useLocation();
  const mainContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollTop(mainContentRef);
    document.body.classList.add('bg-default');

    return function cleanup() {
      document.body.classList.remove('bg-default');
    };
  });

  useEffect(() => {
    scrollTop(mainContentRef);
  }, [location]);

  return (
    <>
      <div className="main-content" ref={mainContentRef}>
        <AuthNavbar />

        <Outlet />
      </div>
      <AuthFooter />
    </>
  );
}

export default AuthLayout;
