import { useState } from 'react';
import {
  FaRegHandPaper,
  FaChevronDown,
  FaChevronUp,
  FaTrashAlt,
  FaRegSave,
} from 'react-icons/fa';
import { MdOutlineRefresh } from 'react-icons/md';
import { IoIosAddCircleOutline } from 'react-icons/io';

const OnBoarding = () => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div
      className="cursor-pointer rounded-md text-center"
      onClick={toggleExpanded}
    >
      <div className="flex items-center justify-start gap-3 self-center pb-3 text-lg">
        <span>¿Cómo usar?</span>
        {expanded ? (
          <FaChevronUp className="mr-2 text-yp-blue md:text-xl" />
        ) : (
          <FaChevronDown className="mr-2 text-yp-blue md:text-xl" />
        )}
      </div>
      {expanded && (
        <div className="flex flex-col gap-2 pb-2">
          <div className="text-left text-sm md:text-base">
            <FaRegHandPaper className="mr-2 inline text-yp-blue md:text-xl" />
            <span>Arrastrar y soltar las fotos para ordenarlas</span>
          </div>
          <div className="text-left text-sm md:text-base">
            <FaRegSave className="mr-2 inline text-yp-blue md:text-xl" />
            <span>
              Hacer click en "Guardar" al terminar de ordenar las fotos
            </span>
          </div>
          <div className="text-left text-sm md:text-base">
            <FaTrashAlt className="mr-2 inline text-yp-blue md:text-xl" />
            <span>
              Una vez guardados los cambios, no se podrán recuperar las fotos
              borradas y se volverá a whatsapp
            </span>
          </div>
          <div className="text-left text-sm md:text-base">
            <MdOutlineRefresh className="mr-2 inline text-yp-blue md:text-xl" />
            <span>
              Para volver a empezar, recargar la página antes de guardar
            </span>
          </div>
          <div className="text-left text-sm md:text-base">
            <IoIosAddCircleOutline className="mr-2 inline text-yp-blue md:text-xl" />
            <span>
              Al hacer click en "Agregar fotos" se volverá a la conversación de
              Whatsapp
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnBoarding;
