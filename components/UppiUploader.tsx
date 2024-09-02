import React, { useEffect, useMemo } from 'react';
import Uppy from '@uppy/core';
import { Dashboard } from '@uppy/react';
import XHRUpload from '@uppy/xhr-upload';
import GoogleDrive from '@uppy/google-drive';
import Instagram from '@uppy/instagram';
import Facebook from '@uppy/facebook';
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';

const UppyUploader: React.FC = () => {
  // Memoizar la instancia de Uppy
  const uppy = useMemo(() => {
    return new Uppy({
      meta: { type: 'avatar' },
      restrictions: { maxNumberOfFiles: 5 }, // Ajusta las restricciones según tus necesidades
      autoProceed: false, // Permite al usuario revisar antes de subir
    });
  }, []); // Solo se crea una vez, al montar el componente

  useEffect(() => {
    // Verificar si el plugin XHRUpload ya fue añadido
    if (!uppy.getPlugin('XHRUpload')) {
      uppy.use(XHRUpload, {
        endpoint: '/api/upload', // Cambia al endpoint que manejaremos en Next.js
        fieldName: 'file', // Nombre del campo en el payload
        formData: true, // Usa multipart/form-data
      });
    }

    // Configurar plugins para Google Drive, Instagram y Facebook
    if (!uppy.getPlugin('GoogleDrive')) {
      uppy.use(GoogleDrive, {
        companionUrl: 'https://companion.uppy.io/', // URL del servidor Companion para manejar autenticaciones
      });
    }

    if (!uppy.getPlugin('Instagram')) {
      uppy.use(Instagram, {
        companionUrl: 'https://companion.uppy.io/',
      });
    }

    if (!uppy.getPlugin('Facebook')) {
      uppy.use(Facebook, {
        companionUrl: 'https://companion.uppy.io/',
      });
    }

    return () => {
      uppy.cancelAll(); // Limpiar la instancia de Uppy al desmontar el componente
    };
  }, [uppy]); // Escuchar cambios en la instancia de Uppy (que está memoizada)

  return (
    <Dashboard
      uppy={uppy}
      proudlyDisplayPoweredByUppy={false}
      width={800}
      height={400}
    />
  );
};

export default UppyUploader;
