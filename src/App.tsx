import { RecoilRoot } from 'recoil';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { MixpanelProvider } from 'react-mixpanel-browser';

import {
  Auth,
  Capture,
  Welcome,
  Goodbye,
  Layout,
  Limit,
  NotMatch,
  PublicGroup,
} from '@/components';

const App = () => {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <MixpanelProvider>
          <Routes>
            <Route path="/welcome" element={<Welcome />} />
            <Route element={<Auth />}>
              <Route path="/goodbye" element={<Goodbye />} />
              <Route element={<Layout />}>
                <Route path="/:uid/limit" element={<Limit />} />
                <Route path="/:uid/:cid" element={<Capture />} />
                <Route path="/:uid/group/:gid/:cid" element={<PublicGroup />} />
                <Route path="*" element={<NotMatch />} />
              </Route>
            </Route>
          </Routes>
        </MixpanelProvider>
      </BrowserRouter>
    </RecoilRoot>
  );
};

export default App;
