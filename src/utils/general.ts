/**
    * Parsea de manera segura una cadena JSON
    */
  export const safeParse = <T>(data: string | null): T | null => {
     if (!data) return null;
     try {
        return typeof data === "string" ? JSON.parse(data) as T : data as T;
     } catch (error) {
        console.error("Error parsing JSON:", error);
        return null;
     }
  };