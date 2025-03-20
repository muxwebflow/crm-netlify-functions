exports.handler = async (event, context) => {
  try {
    const data = JSON.parse(event.body);

    // Uzmi kredencijale iz environment varijabli
    const username = process.env.CRM_USERNAME;
    const password = process.env.CRM_PASSWORD;
    const ai = process.env.CRM_AI || 2958032;
    const ci = process.env.CRM_CI || 1;
    const gi = process.env.CRM_GI || 17;

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

    const response = await fetch("https://affiliates.vipaccess24.com/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await response.json();

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
