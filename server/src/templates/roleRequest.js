const roleRequest = (data) => `
  <mjml>
    <mj-body>
      <mj-section background-color="#f4f4f9">
        <mj-column>
          <mj-text font-size="20px" font-weight="bold">New Role Request</mj-text>
          <mj-text>Hello Admin,</mj-text>
          <mj-text>A user has requested a role change. Here are the details:</mj-text>

          <mj-divider border-color="#cccccc" />

          <mj-text><strong>User Name:</strong> ${data.name} </mj-text>
          <mj-text><strong>Age:</strong> ${data.age}</mj-text>
          <mj-text><strong>Phone Number:</strong> ${data.phone}</mj-text>
          <mj-text><strong>Address:</strong> ${data.address}</mj-text>
          <mj-text><strong>Reason for Role Request:</strong></mj-text>
          <mj-text>${data.reason}</mj-text>

          <mj-divider border-color="#cccccc" />

          <mj-text><strong>Social Links:</strong></mj-text>
          <mj-text>Twitter: ${data.twitter || "N/A"}</mj-text>
          <mj-text>GitHub: ${data.github || "N/A"}</mj-text>
          <mj-text>LinkedIn: ${data.linkedin || "N/A"}</mj-text>
          <mj-text>Instagram: ${data.instagram || "N/A"}</mj-text>

          <mj-divider border-color="#cccccc" />

          <mj-text>Please review and handle this request using the following link:</mj-text>
          <mj-button href="${
            data.url
          }" background-color="#4CAF50">Review Request</mj-button>

          <mj-text>Best regards,<br>The Blog Team</mj-text>
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>
`;

export default roleRequest;
