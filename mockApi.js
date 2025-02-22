const mockServer = require('mockserver-client');
const mockServerClient = mockServer.mockServerClient;

mockServerClient("localhost", 1080)
    .mockAnyResponse([
        {
            httpRequest: {
                method: "GET",
                path: "/api/test/123/questions"
            },
            httpResponse: {
                statusCode: 200,
                headers: [{ name: "Content-Type", value: "application/json" }],
                body: JSON.stringify([
                    { id: 1, text: "What is React?" },
                    { id: 2, text: "Explain useState hook." }
                ])
            }
        },
        {
            httpRequest: {
                method: "POST",
                path: "/api/test/123/save-progress"
            },
            httpResponse: {
                statusCode: 200,
                headers: [{ name: "Content-Type", value: "application/json" }],
                body: JSON.stringify({ message: "Progress saved successfully" })
            }
        },
        {
            httpRequest: {
                method: "POST",
                path: "/api/test/123/submit"
            },
            httpResponse: {
                statusCode: 200,
                headers: [{ name: "Content-Type", value: "application/json" }],
                body: JSON.stringify({ message: "Test submitted successfully" })
            }
        }
    ])
    .then(() => console.log("MockServer is running and APIs are mocked"))
    .catch((error) => console.error("Error setting up MockServer:", error));
