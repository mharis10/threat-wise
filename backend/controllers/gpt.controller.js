const httpStatus = require('http-status-codes').StatusCodes;
const axios = require('axios');

const gptController = {
  emailTemplateHelp: async (req, res) => {
    const {
      impersonate,
      callToAction,
      consequences,
      urgency,
      additionalContent,
    } = req.body;

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    };

    const prompt = `
      I am creating an email template and need assistance with the subject and body content. The valid tags that can be used are:
      ${process.env.VALID_TAGS}. Please only use tags from this list. Also tags should not be used in the subject.

      Here are the details for the email:
      - **Sender Role**: ${impersonate}
      - **Call to Action**: ${callToAction}
      - **Consequences**: ${consequences}
      - **Urgency Level**: ${urgency}
      - **Additional Content**: ${additionalContent}

      Please create a personalized email template based on the provided details. Provide the response in the following JSON format:
      {
          "emailSubject": "<Email Subject>",
          "emailBody": "<Email Body>"
      }

      Example response:
      {
          "emailSubject": "Important Update from {{Company Name}}",
          "emailBody": "Dear {{First Name}},\\n\\nThank you for being a valued member of our team. We appreciate your hard work and dedication.\\n\\nBest regards,\\n{{Company Name}}"
      }
    `;

    const payload = {
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 1000,
    };

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      payload,
      { headers }
    );

    const responseText = response.data.choices[0].message.content.trim();

    if (responseText.includes('I can only help regarding email templates')) {
      return res.status(httpStatus.BAD_REQUEST).json({
        error: 'I can only help regarding email templates.',
      });
    }

    res.status(httpStatus.OK).json({ response: responseText });
  },

  getStatsInsights: async (stats) => {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    };

    const prompt = `
      Here are the statistics for our company employees:
      - Total Employees: ${stats.totalEmployees}
      - Active Employees: ${stats.activeEmployees}
      - Non-Active Employees: ${stats.nonActiveEmployees}

      Employee details:
      ${stats.employeeStats
        .map(
          (employee) => `
      - ID: ${employee.id}
        - Name: ${employee.firstName} ${employee.lastName}
        - Email: ${employee.email}
        - Active: ${employee.isActive}
        - Email Open Count: ${employee.stats.emailOpenCount}
        - Report Phishing Count: ${employee.stats.reportPhishingCount}
      `
        )
        .join('\n')}

      Please provide insights or suggestions based on these statistics. Organize your response into the following sections and ensure the format is strictly followed:
      
      ### Key Observations
      <Your observations here>

      ### Recommendations
      <Your recommendations here>

      ### Areas of Improvement
      <Your areas of improvement here>

      ### Additional Notes
      <Any additional notes here>
    `;

    const payload = {
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 1000,
    };

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      payload,
      { headers }
    );

    return response.data.choices[0].message.content.trim();
  },
};

module.exports = gptController;
