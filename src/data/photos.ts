const breakpoints = [1080, 640, 384, 256, 128, 96, 64, 48];

const photosUrl = (id: string, width: number, height: number) =>
  `https://source.unsplash.com/${id}/${width}x${height}`;

const photosData = [
  { id: "46TvM-BVrRI", width: 1080, height: 800 },
  { id: "FbhNdD1ow2g", width: 1080, height: 800 },
  { id: "qQgOMo4vpnU", width: 1080, height: 720 },
  { id: "Qpjl_dXQrD8", width: 1080, height: 721 },
  { id: "Qtg_270Aa_I", width: 1080, height: 1620 },
  { id: "BHJs5TZ-Nt0", width: 1080, height: 1050 },
  { id: "rplhB9mYF48", width: 1080, height: 1000 },
  { id: "1l2waV8glIQ", width: 1080, height: 720 },
  { id: "Dl39g6QhOIM", width: 1080, height: 1549 },
  { id: "NodtnCsLdTE", width: 1080, height: 720 },
  { id: "IuJc2qh2TcA", width: 1080, height: 1000 },
  { id: "zBvVuRJ71vU", width: 1080, height: 1620 },
  { id: "Hd7vwFzZpH0", width: 1080, height: 720 },
  { id: "bFnUkllg5Ts", width: 1080, height: 1440 },
  { id: "J2btjPX9JH4", width: 1080, height: 1620 },
  { id: "Sa1z1pEzjPI", width: 1080, height: 810 },
  { id: "smgqIwTvf0M", width: 1080, height: 610 },
  { id: "sMt4EfGJR4E", width: 1080, height: 810 },
  { id: "WhHc2Z9XV9k", width: 1080, height: 900 },
  { id: "UPyadPLbCr8", width: 1080, height: 1440 },
];

const photos = photosData.map((photo) => ({
  src: photosUrl(photo.id, photo.width, photo.height),
  width: photo.width,
  height: photo.height,
  srcSet: breakpoints.map((breakpoint) => {
    const height = Math.round((photo.height / photo.width) * breakpoint);
    return {
      src: photosUrl(photo.id, breakpoint, height),
      width: breakpoint,
      height,
    };
  }),
}));

export default photos;