console.log("Fetching happening");

const responsesDiv = document.getElementById("responses");
const promptForm = document.querySelector("form");

promptForm.addEventListener("submit", sendChatRequest);

async function sendChatRequest(event) {
  event.preventDefault();
  const prompt = event.target.clientPrompt.value.trim();
  console.log("Prompt:", prompt);

  if (!prompt) {
    responsesDiv.innerHTML = "<p>Please enter a topic.</p>";
    return;
  }

  responsesDiv.innerHTML = "<p>Thinking of a book for you...</p>";
  responsesDiv.classList.remove("fade-in");

  try {
    const response = await fetch("http://localhost:8080/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();
    console.log("Server response is:", data);

    if (!data.summary || !Array.isArray(data.summary)) {
      responsesDiv.innerHTML = `<p style="color:red;">Invalid response format.</p>`;
      return;
    }

    const summaryHTML = data.summary
      .map((point) => `<li>${point}</li>`)
      .join("");

    responsesDiv.innerHTML = `
      <div class="response-box fade-in">
        <h2>📘 Summary of Key Lessons</h2>
        <ol>${summaryHTML}</ol>
        <h3>🔍 Book Details</h3>
        <p>
          <strong>Title:</strong> <em>${data.title}</em><br>
          <strong>Author:</strong> ${data.author}<br>
          <strong>Rating:</strong> ${data.rating}<br>
          <strong>Buy Link:</strong> 
          <a href="${data.buyLink}" target="_blank">${data.buyLink}</a>
        </p>
      </div>
    `;
  } catch (err) {
    console.error("Fetch error:", err);
    responsesDiv.innerHTML = `<p style="color:red;">Something went wrong. Please try again.</p>`;
  }
}
