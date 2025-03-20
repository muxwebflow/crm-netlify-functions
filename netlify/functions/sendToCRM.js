exports.handler = async (event, context) => {
  try {
    // 1) Uzmemo podatke iz event.body
    const data = JSON.parse(event.body);

    // 2) Kredencijale iz environment varijabli (postavljene u Netlify-u)
    const username = process.env.CRM_USERNAME;
    const password = process.env.CRM_PASSWORD;
    const ai = process.env.CRM_AI;
    const ci = process.env.CRM_CI;
    const gi = process.env.CRM_GI;

    // 3) Sastavi payload koji će se poslati CRM-u
    const payload = {
      username,
      password,
      ai,
      ci,
      gi,
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone: data.phone
    };

    // 4) Šaljemo POST zahtev ka CRM endpoint-u
    const response = await fetch("https://affiliates.vipaccess24.com/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    // Uzimamo "raw" odgovor kao tekst radi debuggovanja
    const rawText = await response.text();
    console.log("Raw response:", rawText);

    // Pokušavamo da parsiramo JSON iz rawText
    let result;
    try {
      result = JSON.parse(rawText);
    } catch (err) {
      // Ako parsiranje ne uspe, bacamo grešku s kompletnim odgovorom
      throw new Error("Response is not valid JSON: " + rawText);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, crmResponse: result })
    };
  } catch (error) {
    console.error("Error in sendToCRM function:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};
