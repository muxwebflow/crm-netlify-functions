exports.handler = async (event, context) => {
  // 1) Rukovanje OPTIONS (preflight) zahtevom za CORS
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS"
      },
      body: "OK"
    };
  }

  try {
    // 2) Parsiranje input podataka
    const data = JSON.parse(event.body);

    // 3) Kreiranje payload-a (prilagodite prema potrebama)
    const payload = {
      ai: process.env.CRM_AI,      
      ci: process.env.CRM_CI,      
      gi: process.env.CRM_GI,      
      userip: event.headers["x-forwarded-for"] || "",
      firstname: data.firstName,
      lastname: data.lastName,
      email: data.email,
      password: process.env.CRM_DEFAULT_PASSWORD || "Aa12345!",
      phone: data.phone,
      lg: "EN"
      so: process.env.CRM_SO || "funnelname",     
      campaign: process.env.CRM_CAMPAIGN || "Campaign 1"
    };

    // 4) Slanje POST zahteva ka CRM API-ju
    const response = await fetch("https://affiliates.sniperaccess.com/api/signup/procform", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-trackbox-username": process.env.CRM_USERNAME,  // "MediaB"
        "x-trackbox-password": process.env.CRM_PASSWORD,  // "86FdgwtY_[C[Y<[$b"
        "x-api-key": process.env.CRM_API_KEY              // npr. "2643889w34df345676ssdas323tgc738"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    // 5) Uspešan odgovor sa CORS zaglavljima
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS"
      },
      body: JSON.stringify({ success: true, crmResponse: result })
    };
  } catch (error) {
    // 6) Greška pri obradi
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS"
      },
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};
