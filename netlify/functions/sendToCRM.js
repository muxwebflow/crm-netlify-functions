exports.handler = async (event, context) => {
  try {
    const data = JSON.parse(event.body);
    
    // Preuzimanje vrednosti iz environment varijabli
    const username = process.env.CRM_USERNAME;
    const password = process.env.CRM_PASSWORD;
    const apiKey = process.env.CRM_API_KEY;
    const ai = process.env.CRM_AI; 
    const ci = process.env.CRM_CI;
    const gi = process.env.CRM_GI; 
    // Ako želite, možete postaviti i fiksni "password" koji se šalje u payload
    const defaultPassword = process.env.CRM_DEFAULT_PASSWORD || "Aa12345!";

    // Uzimanje IP adrese – eventualno dopunite kako odgovara vašim potrebama
    const userip = (event.headers && event.headers['x-forwarded-for']) || "";

    // Formiranje kompletnog payload-a
    const payload = {
      ai: ai,
      ci: ci,
      gi: gi,
      userip: userip,
      firstname: data.firstName,
      lastname: data.lastName,
      email: data.email,
      password: defaultPassword, // obavezno polje, postavljeno server-side
      phone: data.phone,
      lg: "EN"
    };
    
    const response = await fetch("https://affiliates.sniperaccess.com/api/signup/procform", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-trackbox-username": username,
        "x-trackbox-password": password,
        "x-api-key": apiKey
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, crmResponse: result })
    };
  } catch (error) {
    console.error("Error in CRM signup:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};
