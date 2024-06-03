import clsx from 'clsx';
import React, { useState } from 'react';
import { PhotoFrameProps } from '../types';
import { FaTrashAlt } from 'react-icons/fa';
import { useModal } from '../context/useModalHook';
import { usePhotoContext } from '../context/usePhotosHook';

const PhotoFrame = React.memo(
  React.forwardRef<HTMLDivElement, PhotoFrameProps>(
    function PhotoFrame(props, ref) {
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
        onLoad,
      } = props;
      const { alt, style, ...restImageProps } = imageProps;
      const [loaded, setLoaded] = useState(false);
      const { deletePhoto } = usePhotoContext();

      const { openModal } = useModal();

      const handleDelete = () => {
        openModal('¿Desea eliminar esta foto?', () =>
          deletePhoto(imageProps.src)
        );
      };

      const handleLoad = () => {
        onLoad && onLoad;
        setLoaded(true);
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
                onLoad={handleLoad}
                loading="lazy"
              />
              {isCover && loaded && (
                <p className="absolute left-2 top-3 m-0 max-w-full truncate rounded bg-black bg-opacity-70 px-1 py-0.5 text-[10px] text-white sm:left-3 sm:px-2 sm:py-1 sm:text-sm lg:left-4 lg:top-4 lg:text-base xl:text-lg">
                  Portada
                </p>
              )}
              {loaded && !(active === undefined) && (
                <>
                  <p className="absolute bottom-3 right-2 m-0 max-w-full truncate rounded bg-black bg-opacity-70 px-1 py-0.5 text-xs text-white sm:right-3 sm:px-2 sm:py-1 sm:text-sm lg:bottom-4 lg:right-4 lg:text-base xl:text-lg">
                    {number ? number + 1 : 1}
                  </p>
                  <button
                    onClick={handleDelete}
                    className="absolute right-2 top-3 m-0 flex max-w-full items-center truncate rounded  bg-black bg-opacity-70 px-1 py-1 text-xs text-white sm:right-3 sm:text-sm lg:right-4 lg:top-4 lg:text-base xl:text-lg"
                  >
                    <FaTrashAlt />
                  </button>
                </>
              )}
            </div>
          }
        </div>
      );
    }
  )
);
export default PhotoFrame;
