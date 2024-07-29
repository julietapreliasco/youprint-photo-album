import { BarLoader } from 'react-spinners';

export const ProgressLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-10">
      <BarLoader color="#10abbb" />
      <span className="text-center text-yp-blue">
        Tus fotos se están cargando, este proceso puede demorar unos segundos
      </span>
    </div>
  );
};
