/* eslint-disable jsx-a11y/alt-text */
import { FC, useRef, useState } from 'react';
import { useIntersection } from '@/hooks/useIntersection';

const ImageRenderer: FC<{ className: string; src: string; alt: string }> = ({
  className,
  src,
  ...rest
}) => {
  // const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);

  const imgRef = useRef(null);

  useIntersection(imgRef, () => {
    setIsInView(true);
  });

  // useEffect(() => {
  //   return () => {
  //     console.log('here');
  //     setIsInView(false);
  //   };
  // }, [isInView]);

  // const handleOnLoad = () => {
  //   setIsLoaded(true);
  // };

  return (
    <div ref={imgRef}>
      {isInView && (
        <img
          className={`${className}`}
          src={src}
          key={src}
          data-src={src}
          loading="lazy"
          // onLoad={handleOnLoad}
          {...rest}
        />
      )}
    </div>
  );
};

export default ImageRenderer;
