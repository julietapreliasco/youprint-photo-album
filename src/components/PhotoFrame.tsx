import clsx from "clsx";
import React from "react";
import { PhotoFrameProps } from "../types";


const PhotoFrame = React.memo(
  React.forwardRef<HTMLDivElement, PhotoFrameProps>(function PhotoFrame(props, ref) {
    const { layoutOptions, imageProps, overlay, active, insertPosition, attributes, listeners } = props;
    const { alt, style, ...restImageProps } = imageProps;

    return (
      <div
        ref={ref}
        style={{
        width: overlay ? `calc(100% - ${2 * layoutOptions.padding}px)` : style.width,
        }}
        className={clsx("photo-frame", {
          "overlay": overlay,
          "active": active,
          "insertBefore": insertPosition === "before",
          "insertAfter": insertPosition === "after",
        })}
        {...attributes}
        {...listeners}
      >
        <img
          alt={alt}
          className="w-full object-cover rounded-xl"
          {...restImageProps}
        />
      </div>
    );
  }),
);


export default PhotoFrame;