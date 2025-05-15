import { Request, Response } from "express";
import formidable from "formidable";
import User from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";
import { generateJWT } from "../utils/jwt";
import { AuthRequest, ProfileRequest } from "../interfaces/auth/IGetUser";
import cloudinary from "../config/cloudinary";
import { v4 as uuid } from "uuid";

export const createAccount = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password, handle: handleclient } = req.body;
    const slug = (await import("slug")).default;
    const handle = slug(handleclient, "");
    const userExists = await User.findByHandleEmail(handle, email);

    if (userExists) {
      const error = new Error("El email ó el handle, ya no están disponible.");
      res.status(409).json({ message: error.message, status: 409 });
      return;
    }

    // Opción 1
    const user = req.body;
    user.password = await hashPassword(password);
    user.handle = slug(handle);

    await User.create(user);

    // res.render -> envia datos a una vista (anteriormente)
    res.status(201).json({ message: "Creado exitosamente el usuario" });
    // Opción2
    // await User.create(req.body);
  } catch (err) {
    res.status(500).json({ message: err.message });
    return;
  }
};

export const loginAccount = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmail(email);

    if (!user) {
      const error = new Error("El email no concide con ningún usuario.");
      res.status(404).json({ message: error.message });
      return;
    }
    const resultCheckPassword = await checkPassword(password, user.password);

    if (!resultCheckPassword) {
      const error = new Error("Revisar el correo o la contraseña, no validas");
      res.status(401).json({ message: error.message });
      return;
    }
    const token = generateJWT({ id: user.id, email: user.email });

    res.status(200).json({ message: "Autenticado..", token });
  } catch (err) {
    res.status(500).json({ message: err.message });
    return;
  }
};

export const getUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  var user = await User.findById(Number(req.user_id));
  if (!user) {
    const error = new Error("El usuario no exito");
    res.status(409).json({ message: error.message, status: 404 });
    return;
  }
  res.status(200).json({ message: "Usuario autentica", user });
};

export const updateUser = async (
  req: ProfileRequest,
  res: Response
): Promise<void> => {
  try {
    const { description, handle: handleclient, email } = req.body;
    const slug = (await import("slug")).default;
    const handle = slug(handleclient, "");
    const handleExists = await User.findByHandle(handle);

    if (handleExists && handleExists.email !== email) {
      const error = new Error("Handle, ya no están disponible.");
      res.status(409).json({ message: error.message, status: 409 });
      return;
    }

    // Opción 1
    const user = await User.update(
      email, // Filtro
      { handle, description } // Datos a actualizar // Retorna el usuario actualizado
    );

    res.status(201).json({ message: "Perfil actualizado", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
    return;
  }
};

export const uploadImage = async (req: AuthRequest, res: Response) => {
  console.log("files api", req.body);
  const form = formidable({});
  try {
    form.parse(req, (err, fields, files) => {
      console.log("files", files);

      if (err) {
        res.status(500).json({ message: err });
      }
      cloudinary.uploader.upload(
        files.file[0].filepath,
        { public_id: uuid() },
        async function (error, result) {
          if (error) {
            const error = new Error("Hubo un error al subir la imagen");
            res.status(500).json({ message: error.message });
          }
          if (result) {
            const user = await User.findById(Number(req.user_id));
            if (!user) {
              res.status(404).json({ message: "Usuario no encontrado" });
            }
            user.image = result.secure_url;
            await User.update(user.email, user);
            res.status(200).json({
              message: "Imagen subida con exito",
              data: result.secure_url,
            });
          }
        }
      );
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
    return;
  }
};
