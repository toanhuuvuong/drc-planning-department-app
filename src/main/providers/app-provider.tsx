import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from 'main/configs/react-query';
import store from 'main/redux/store';
import { PropsWithChildren } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';

const composeComponents = function (...components: any[]) {
  if (components.length === 0) {
    return null;
  }
  if (components.length === 1) {
    return components[0];
  }
  return components.reduce((A, B) => (props: any) => (
    <A>
      <B {...props} />
    </A>
  ));
};

const ComposedProvider = composeComponents(
  (props: any) => <Provider {...props} store={store} />,
  (props: any) => <QueryClientProvider {...props} client={queryClient} />,
  HelmetProvider,
);

function AppProvider({ children }: PropsWithChildren) {
  return <ComposedProvider>{children}</ComposedProvider>;
}

export default AppProvider;
