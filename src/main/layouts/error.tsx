import ErrorFooter from 'main/components/organisms/footer/error-footer';
import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { scrollTop } from './auth';

function ErrorLayout() {
  const location = useLocation();
  const mainContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollTop(mainContentRef);
  }, [location]);

  return (
    <>
      <div className="main-content" ref={mainContentRef}>
        <Outlet />
      </div>
      <ErrorFooter />
    </>
  );
}

export default ErrorLayout;
