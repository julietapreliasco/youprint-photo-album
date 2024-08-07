import { FaRegSave } from 'react-icons/fa';
import { TbHandFinger } from 'react-icons/tb';

const OnBoarding = () => {
  return (
    <div className="rounded-md text-center">
      <div className="flex flex-col gap-2 pb-2">
        <div className="text-left text-sm md:text-base">
          <TbHandFinger className="mr-2 inline text-yp-blue md:text-xl" />
          <span>Ordena tus fotos arrastrandolas</span>
        </div>
        <div className="text-left text-sm md:text-base">
          <FaRegSave className="mr-2 inline text-yp-blue md:text-xl" />
          <span>
            "Guardar" al terminar de ordenar tus fotos y continuarás en WhatsApp
          </span>
        </div>
      </div>
    </div>
  );
};

export default OnBoarding;
