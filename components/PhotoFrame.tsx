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
        photoAlbumStatus,
      } = props;
      const { alt, style, ...restImageProps } = imageProps;

      const [loaded, setLoaded] = useState(false);
      const { deletePhoto } = usePhotoContext();
      const { openModal } = useModal();

      const handleDelete = (
        event:
          | React.MouseEvent<HTMLButtonElement>
          | React.TouchEvent<HTMLButtonElement>
      ) => {
        event.stopPropagation();
        openModal('¿Desea eliminar esta foto?', () =>
          deletePhoto(imageProps.src)
        );
      };

      const handleLoad = () => {
        onLoad && onLoad();
        setLoaded(true);
      };

      return (
        <div
          ref={ref}
          style={{
            width: overlay
              ? `calc(100% - ${2 * layoutOptions.padding}px)`
              : style.width,
            zIndex: active ? 9999 : 'auto',
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
              loading={isCover ? 'eager' : 'lazy'}
            />
            {isCover && loaded && (
              <p className="absolute bottom-3 left-2 max-w-full truncate rounded bg-black bg-opacity-70 px-1 py-0.5 text-[20px] text-white sm:left-3 sm:px-2 sm:py-1 lg:bottom-4 lg:left-4">
                Portada
              </p>
            )}
            {loaded && !(active === undefined) && (
              <>
                <p className="absolute bottom-3 left-2 rounded text-xs font-bold text-white drop-shadow-2xl sm:left-3 sm:text-sm lg:bottom-4 lg:left-4 lg:text-base xl:text-lg">
                  {number && !isCover ? number : null}
                </p>
                {photoAlbumStatus && (
                  <>
                    <button
                      onClick={handleDelete}
                      onTouchStart={(e) => e.stopPropagation()}
                      className="absolute right-2 top-3 m-0 flex max-w-full items-center truncate rounded bg-black bg-opacity-30 px-2 py-2 text-base text-white sm:right-3 lg:right-4 lg:top-4"
                    >
                      <FaTrashAlt />
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      );
    }
  )
);

export default PhotoFrame;
