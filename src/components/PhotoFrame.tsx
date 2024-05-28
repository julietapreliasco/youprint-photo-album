import clsx from 'clsx';
import React, { useState } from 'react';
import { PhotoFrameProps } from '../types';
import { FaTrashAlt } from 'react-icons/fa';
import { useModal } from '../context/useModalHook';


const PhotoFrame = React.memo(
  React.forwardRef<HTMLDivElement, PhotoFrameProps>(function PhotoFrame(
    props,
    ref,
  ) {
    const {
      layoutOptions,
      imageProps,
      overlay,
      active,
      insertPosition,
      attributes,
      listeners,
      isCover,
      number,
    } = props;
    const { alt, style, ...restImageProps } = imageProps;
    const [loaded, setLoaded] = useState(false);

    const { openModal } = useModal();

    const handleDelete = () => {
      openModal('¿Desea eliminar la foto?', () => {
        console.log('Photo deleted');
      });
    };

    return (
      <div
        ref={ref}
        style={{
          width: overlay
            ? `calc(100% - ${2 * layoutOptions.padding}px)`
            : style.width,
        }}
        className={clsx('photo-frame', {
          overlay: overlay,
          active: active,
          insertBefore: insertPosition === 'before',
          insertAfter: insertPosition === 'after',
        })}
        {...attributes}
        {...listeners}
      >
        {
          <div>
            <img
              alt={alt}
              {...restImageProps}
              className={
                isCover && loaded
                  ? 'react-photo-album--photo-cover'
                  : 'react-photo-album--photo'
              }
              onLoad={() => setLoaded(true)}
              loading='lazy'
            />
            {isCover && loaded && (
              <p className='absolute top-3 left-2 sm:left-3 lg:top-4 lg:left-4 m-0 px-1 py-0.5 sm:px-2 sm:py-1 bg-black bg-opacity-70 text-white rounded text-[10px] sm:text-sm lg:text-base xl:text-lg max-w-full truncate'>
                Portada
              </p>
            )}
            {loaded && !(active === undefined) && (
              <>
                <p className='absolute bottom-3 right-2 sm:right-3 lg:bottom-4 lg:right-4 m-0 px-1 py-0.5 sm:px-2 sm:py-1 bg-black bg-opacity-70 text-white rounded text-xs sm:text-sm lg:text-base xl:text-lg max-w-full truncate'>
                  {number ? number + 1 : 1}
                </p>
                <button onClick={handleDelete} className='absolute top-3 right-2 sm:right-3 lg:top-4 lg:right-4 m-0 px-1 py-1  bg-black bg-opacity-70 text-white rounded text-xs sm:text-sm lg:text-base xl:text-lg max-w-full truncate flex items-center'>
                  <FaTrashAlt />
                </button>
              </>
            )}
          </div>
        }
      </div>
    );
  }),
);
export default PhotoFrame;
