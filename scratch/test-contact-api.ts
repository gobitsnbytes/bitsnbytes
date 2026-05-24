async function testContactApi() {
  console.log("Sending POST request to http://localhost:3000/api/contact...");
  
  try {
    const res = await fetch("http://localhost:3000/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Akshat (API Verification)",
        email: "cto-test@gobitsnbytes.org",
        subject: "Backend Route Verification Test",
        message: "This test verifies that the /api/contact API endpoint correctly processes contact requests and routes them to the Discord webhook.",
        source: "api-test"
      }),
    });

    const data = await res.json();
    console.log(`Status code: ${res.status}`);
    console.log("Response body:", data);

    if (res.ok && data.success) {
      console.log("✅ API route works perfectly!");
    } else {
      console.error("❌ API route verification failed.");
    }
  } catch (error) {
    console.error("❌ Error connecting to API:", error);
  }
}

testContactApi();
