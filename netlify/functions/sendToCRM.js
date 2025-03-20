exports.handler = async (event, context) => {
  try {
    const data = JSON.parse(event.body);
    const username = process.env.CRM_USERNAME;
    const password = process.env.CRM_PASSWORD;
    const apiKey = process.env.CRM_API_KEY;
    const ai = process.env.CRM_AI;
    const ci = process.env.CRM_CI;
    const gi = process.env.CRM_GI;
    const userip = (event.headers && event.headers['x-forwarded-for']) || "";
    
    const payload = {
      ai: ai,
      ci: ci,
      gi: gi,
      userip: userip,
      firstname: data.firstName,
      lastname: data.lastName,
      email: data.email,
      password: data.password,
      phone: data.phone,
      lg: "EN"
    };
    
    // Opcionalno: Logovanje vrednosti za proveru (pazite da ovo ne ostane u produkciji)
    console.log("Using credentials:", { username, password, apiKey });
    
    const response = await fetch("https://affiliates.sniperaccess.com/api/signup/procform", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "username": username,
        "password": password,
        "api-key": apiKey
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
