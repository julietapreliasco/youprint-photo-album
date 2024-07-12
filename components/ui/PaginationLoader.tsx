import { BarLoader } from 'react-spinners';

export const PaginationLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-10">
      <BarLoader color="#10abbb" />
      <span className="text-yp-blue">Cargando fotos...</span>
    </div>
  );
};
