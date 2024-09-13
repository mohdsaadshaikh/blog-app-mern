const approvedRole = (data) => `
  <mjml>
    <mj-body>
      <mj-section background-color="#e1f5fe">
        <mj-column>
          <mj-text font-size="20px" font-weight="bold" color="#004d40">
            Role Request Approved!
          </mj-text>
          <mj-text>Hello ${data.name},</mj-text>
          <mj-text>
            Congratulations! Your request to become a Creator has been approved. 
            We are excited to have you on board.
          </mj-text>
          <mj-text>Best regards,<br>The Team</mj-text>
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>
`;

export default approvedRole;
