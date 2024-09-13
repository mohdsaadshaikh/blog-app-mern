const emailVerification = (data) => `
  <mjml>
    <mj-body background-color="#f4f4f4">
      <mj-section background-color="#ffffff" padding="20px" border-radius="10px">
        <mj-column>
          <mj-image width="100px" src="https://yourlogo.com/logo.png" alt="Your Logo"></mj-image>
          <mj-divider border-color="#cccccc"></mj-divider>
          <mj-text font-size="20px" color="#333333" font-family="Arial, sans-serif" align="center">
            Email Verification
          </mj-text>
          <mj-text font-size="16px" color="#555555" font-family="Arial, sans-serif" align="center">
            Hello ${data.firstName},
          </mj-text>
          <mj-text font-size="16px" color="#555555" font-family="Arial, sans-serif" align="center">
            Thank you for registering! Please verify your email address by clicking the button below. 
            (This is only valid for 1 hour)
          </mj-text>
          <mj-button background-color="#1a73e8" color="#ffffff" font-family="Arial, sans-serif" href="${data.url}">
            Verify Email
          </mj-button>
          <mj-text font-size="14px" color="#555555" font-family="Arial, sans-serif" align="center">
            If you didn't create an account, you can safely ignore this email.
          </mj-text>
          <mj-divider border-color="#cccccc"></mj-divider>
          <mj-text font-size="14px" color="#aaaaaa" font-family="Arial, sans-serif" align="center">
            &copy; 2024 Your Company. All rights reserved.
          </mj-text>
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>
`;

export default emailVerification;
