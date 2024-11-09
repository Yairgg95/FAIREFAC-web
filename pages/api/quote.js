import { toast } from "sonner";

const API_URL = "https://fairefac-api.onrender.com";

export async function createQuote(carId, mechanicId, quoteData) {
  try {
    const response = await fetch(
      `${API_URL}/quote/create/car/${carId}/mechanic/${mechanicId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(quoteData),
      }
    );

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(
        errorResponse.error || "Error desconocido al crear el cotización"
      );
    }

    const json = await response.json();
    return json;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function createQuoteLinkToken(clientId, carId) {
  try {
    const response = await fetch(
      `${API_URL}/quote/quote-link-token/${clientId}/${carId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ clientId, carId }),
      }
    );

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(
        errorResponse.error || "Error desconocido al crear el cotización"
      );
    }

    const json = await response.json();
    return json.data.token;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function validateToken(token, router) {
  try {
    const response = await fetch(`${API_URL}/quote/validate-token/${token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    const json = await response.json();

    if (response.status === 401) {
      router.push("/timeOutPage");
      toast.error("Session Expirada, Solicite Nuevo Enlace");
    } else if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(
        errorResponse.error || "Error desconocido al crear el cotización"
      );
    }

    return json.data;
  } catch (error) {}
}

export async function getPaymentIfonBySessionId(sessionId, token) {
  try {
    const response = await fetch(`${API_URL}/quote/payment-info/${sessionId}`, {
      method: "GET",
      headers: {
        Authorization: token,
      },
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(
        errorResponse.error || "Error desconocido al obtener información de pago."
      );
    }
    const json =  await response.json(); 
    return json.data;
  } catch (error) {
    throw new Error(error.message);
  }
}
