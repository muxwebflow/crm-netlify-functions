exports.handler = async (event, context) => {
  try {
    // 1) Parsiramo podatke iz event.body (očekuje se JSON)
    const data = JSON.parse(event.body);

    // 2) Uzimamo kredencijale i ostale parametre iz environment varijabli
    const username = process.env.CRM_USERNAME; // npr. "MediaB"
    const password = process.env.CRM_PASSWORD; // npr. "86FdgwtY_[C[Y<[$b"
    const apiKey   = process.env.CRM_API_KEY;   // npr. "2643889w34df345676ssdas323tgc738"
    const ai       = process.env.CRM_AI;
    const ci       = process.env.CRM_CI;
    const gi       = process.env.CRM_GI;
    
    // Ostale opcione vrednosti – ako nisu definisane, koristiš default vrednosti:
    const so       = process.env.CRM_SO || "funnelname";
    const sub      = process.env.CRM_SUB || "FreeParam";
    const MPC_1    = process.env.CRM_MPC_1 || "FreeParam";
    const MPC_2    = process.env.CRM_MPC_2 || "FreeParam";
    const MPC_3    = process.env.CRM_MPC_3 || "FreeParam";
    const MPC_4    = process.env.CRM_MPC_4 || "FreeParam";
    const MPC_5    = process.env.CRM_MPC_5 || "FreeParam";
    const MPC_6    = process.env.CRM_MPC_6 || "FreeParam";
    const MPC_7    = process.env.CRM_MPC_7 || "FreeParam";
    const MPC_8    = process.env.CRM_MPC_8 || "FreeParam";
    const MPC_9    = process.env.CRM_MPC_9 || "FreeParam";
    const MPC_10   = process.env.CRM_MPC_10 || "FreeParam";
    const MPC_11   = process.env.CRM_MPC_11 || "FreeParam";
    const MPC_12   = process.env.CRM_MPC_12 || "FreeParam";
    const ad       = process.env.CRM_AD || "FreeParam";
    const term     = process.env.CRM_TERM || "FreeParam";
    const campaign = process.env.CRM_CAMPAIGN || "FreeParam";
    const medium   = process.env.CRM_MEDIUM || "FreeParam";
    const lg       = process.env.CRM_LG || "EN";

    // 3) Dobijamo IP korisnika (ako postoji u x-forwarded-for header-u)
    const userip = event.headers && event.headers['x-forwarded-for'] ? event.headers['x-forwarded-for'] : "0.0.0.0";

    // 4) Sastavljamo payload prema Trackbox API dokumentaciji
    const payload = {
      ai: ai,
      ci: ci,
      gi: gi,
      userip: userip,
      firstname: data.firstName || "",
      lastname: data.lastName || "",
      email: data.email || "",
      password: data.password || "Aa12345!",  // Ako korisnik ne unese, koristiš default
      phone: data.phone || "",
      so: so,
      sub: sub,
      MPC_1: MPC_1,
      MPC_2: MPC_2,
      MPC_3: MPC_3,
      MPC_4: MPC_4,
      MPC_5: MPC_5,
      MPC_6: MPC_6,
      MPC_7: MPC_7,
      MPC_8: MPC_8,
      MPC_9: MPC_9,
      MPC_10: MPC_10,
      MPC_11: MPC_11,
      MPC_12: MPC_12,
      ad: ad,
      term: term,
      campaign: campaign,
      medium: medium,
      lg: lg
    };

    console.log("Payload:", payload);

    // 5) Šaljemo POST zahtev ka CRM endpoint-u
    // Prema dokumentaciji, CURL primer pokazuje URL:
    // https://platform.yourdomain.com/api/signup/procform
    // Ako se podaci šalju direktno na CRM, proveri sa klijentom tačan URL.
    // Ovde pretpostavljamo da je ispravan URL:
    const crmUrl = "https://affiliates.vipaccess24.com/api/signup/procform";

    const response = await fetch(crmUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-trackbox-username": username,
        "x-trackbox-password": password,
        "x-api-key": apiKey
      },
      body: JSON.stringify(payload)
    });

    // 6) Uzimamo sirovi odgovor kao tekst radi debuggovanja
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
