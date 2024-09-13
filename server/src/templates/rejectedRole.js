const rejectedRole = (data) => `
  <mjml>
    <mj-body>
      <mj-section background-color="#ffebee">
        <mj-column>
          <mj-text font-size="20px" font-weight="bold" color="#d32f2f">
            Role Request Rejected
          </mj-text>
          <mj-text>Hello ${data.name},</mj-text>
          <mj-text>
            We regret to inform you that your request to become a Creator has been rejected.
            Please accept our apologies. If you have any questions, feel free to reach out.
          </mj-text>
          <mj-text>Best regards,<br>The Team</mj-text>
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>
`;

export default rejectedRole;
