exports.handler = async (event, context) => {
  try {
    const data = JSON.parse(event.body);
    const username = process.env.CRM_USERNAME;
    const password = process.env.CRM_PASSWORD;
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
    const response = await fetch("https://affiliates.sniperaccess.com/api/signup/procform", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-trackbox-username": username,
        "x-trackbox-password": password,
        "x-api-key": process.env.CRM_API_KEY
      },
      body: JSON.stringify(payload)
    });
    const rawText = await response.text();
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
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};
