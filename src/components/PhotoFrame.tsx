import clsx from 'clsx';
import React from 'react';
import { PhotoFrameProps } from '../types';

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
    } = props;
    const { alt, style, ...restImageProps } = imageProps;

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
        <div>
          <img
            alt={alt}
            className={`w-full object-cover rounded-xl $`}
            {...restImageProps}
            style={{ border: isCover ? '3px solid #86d6df' : 'none' }}
          />
          {isCover && (
            <p className='absolute top-3 left-2 sm:left-3 lg:top-4 lg:left-4 m-0 px-1 py-0.5 sm:px-2 sm:py-1 bg-black bg-opacity-70 text-white rounded text-xs sm:text-sm lg:text-base xl:text-lg max-w-full truncate'>
              Portada
            </p>
          )}
        </div>
      </div>
    );
  }),
);
export default PhotoFrame;