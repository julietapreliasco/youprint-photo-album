import { useState } from 'react';
import {
  FaRegHandPaper,
  FaChevronDown,
  FaChevronUp,
  FaRegSave,
} from 'react-icons/fa';

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
      <div className="flex items-center justify-start gap-3 self-center pb-3 text-lg font-semibold">
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
              "Guardar" al terminar de ordenar tus fotos y continuarás en
              WhatsApp
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnBoarding;
