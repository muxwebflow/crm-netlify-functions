exports.handler = async (event, context) => {
  try {
    // 1) Parsiramo podatke iz event.body (očekuje se JSON)
    const data = JSON.parse(event.body);

    // 2) Uzimamo kredencijale iz environment varijabli
    const username = process.env.CRM_USERNAME; 
    const password = process.env.CRM_PASSWORD; 
    const ai = process.env.CRM_AI;            
    const ci = process.env.CRM_CI;             
    const gi = process.env.CRM_GI;             

    // 3) Ako je moguće, uzimamo IP korisnika iz header-a
    const userip = (event.headers && event.headers['x-forwarded-for']) || "";

    // 4) Sastavljamo payload prema dokumentaciji
    const payload = {
      ai: ai,
      ci: ci,
      gi: gi,
      userip: userip,
      firstname: data.firstName,
      lastname: data.lastName,
      email: data.email,
      password: data.password, // Preuzima se vrednost iz forme
      phone: data.phone,
      lg: "EN"
    };

    console.log("Payload:", payload);

    // 5) Definišemo CRM endpoint – koristimo system_url iz podataka klijenta
    const crmUrl = "https://affiliates.vipaccess24.com;

    // 6) Šaljemo POST zahtev ka CRM endpoint-u
    const response = await fetch(crmUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-trackbox-username": username,
        "x-trackbox-password": password
      },
      body: JSON.stringify(payload)
    });

    // 7) Dobijamo sirovi odgovor kao tekst za debuggovanje
    const rawText = await response.text();
    console.log("Raw response:", rawText);

    // Pokušavamo da parsiramo odgovor kao JSON
    let result;
    try {
      result = JSON.parse(rawText);
    } catch (parseError) {
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
