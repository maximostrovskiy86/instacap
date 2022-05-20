import { useMixpanel } from '@/hooks/useMixpanel';
import { useEffect } from 'react';

const Goodbye = () => {
  const mixpanel = useMixpanel();

  useEffect(() => {
    mixpanel.send('goodbye');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <iframe
      className="w-screen h-screen"
      title="goodbye"
      src="https://instacap.co/goodbye"
    />
  );
};

export default Goodbye;
