const extensionId = process.env.REACT_APP_EXTENSION_ID || '';
export let withExtension = false;
export let isExtensionAnonymous = false;

const sendMessage = (data: any, cb: Function, errorCB: Function) => {
  try {
    if (!chrome || !chrome.runtime) {
      throw new Error('NOT_CHROME');
    } else {
      // console.log(extensionId);
      chrome.runtime.sendMessage(extensionId, data, (response) => {
        if (chrome.runtime.lastError) {
          console.log(chrome.runtime.lastError);
          errorCB();
        }
        if (response) {
          cb(response);
        }
      });
    }
  } catch (error) {
    // console.log(error);
    errorCB();
  }
};

const setLocalStorage = (data: { key: string; value: string }) => {
  localStorage.setItem(`${data.key}`, `${JSON.stringify(data.value)}`);
};

export const extensionSignOut = async () => {
  return new Promise((r) => {
    sendMessage(
      {
        type: 'signOut',
      },
      async (response: any) => {
        console.log(response);
        if (!response || !response.key || !response.value) return false;
        setLocalStorage(response);
        r(response);
      },
      () => {}
    );
  });
};

export const extensionSignIn = (data: any) => {
  sendMessage(
    {
      type: 'signIn',
      data,
    },
    () => {},
    () => {}
  );
};

export const init = (cb: Function) => {
  sendMessage(
    {
      type: 'instacap-web',
    },
    async (response: any) => {
      withExtension = true;
      console.log('with Extension ', withExtension);
      // console.log(response);
      if (response && response.key && response.value) {
        isExtensionAnonymous = response.value.isAnonymous;
        const savedValue = localStorage.getItem(`${response.key}`);
        if (savedValue) {
          const savedOauth = JSON.parse(savedValue);
          if (savedOauth.isAnonymous) {
            setLocalStorage(response);
          } else {
            // console.log(savedOauth);
          }
        } else {
          setLocalStorage(response);
        }
      }
      cb();
    },
    cb
  );
};
