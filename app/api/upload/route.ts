import { NextResponse } from 'next/server';
import multiparty from 'multiparty';
import cloudinary from '../../../cloudinaryConfig';

export const config = {
  api: {
    bodyParser: false, // Necesario para manejar archivos
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function POST(req: any) {
  const form = new multiparty.Form();

  return new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return reject(
          NextResponse.json(
            { error: 'Error al procesar el formulario.' },
            { status: 500 }
          )
        );
      }

      try {
        const file = files.file[0]; // Asegúrate de que el archivo se encuentra en el campo correcto
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'nextjs-uppy',
        });

        resolve(NextResponse.json({ url: result.secure_url }, { status: 200 }));
      } catch (uploadError) {
        console.error(uploadError);
        resolve(
          NextResponse.json(
            { error: 'Error al subir a Cloudinary.' },
            { status: 500 }
          )
        );
      }
    });
  });
}
