const resetPassword = (data) => `
  <mjml>
    <mj-body>
      <mj-section background-color="#f4f4f9">
        <mj-column>
          <mj-text font-size="20px">Password Reset</mj-text>
          <mj-text>Hello ${data.firstName},</mj-text>
          <mj-text>You requested a password reset. Please use the following link to reset your password. This link is valid for only 10 minutes:</mj-text>
          <mj-button href="${data.url}" background-color="#4CAF50">Reset My Password</mj-button>
          <mj-text>Best regards,<br>The Natours Team</mj-text>
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>
`;

export default resetPassword;
