// src/types/express-session.d.ts
declare global {
  namespace Express {
    // Définition du type de l'objet utilisateur dans la session
    interface User {
      id: string;
      email: string;
    }

    // Étend l'interface Request pour inclure la session
    interface Request {
      session: {
        user?: User; // Utilisateur stocké dans la session
      };
    }
  }
}

export {};
