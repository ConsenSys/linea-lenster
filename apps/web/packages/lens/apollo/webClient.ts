import { ApolloClient, from } from '@apollo/client';
import cache from '@workers/snapshot-relay/src/apollo/cache';

import authLink from './authLink';
import httpLink from './httpLink';
import retryLink from './retryLink';

const webClient = new ApolloClient({
  link: from([authLink, retryLink, httpLink]),
  cache: cache
});

export default webClient;
