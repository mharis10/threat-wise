const transporter = require('../helpers/emailConfig');
const fs = require('fs');
const logger = require('../startup/logging');

const sendCompanyAdminSignUpEmail = async (user, jwt) => {
  const emailSubect =
    'Welcome to PhishDefender - Your Admin Account has been Created';
  const emailRecipient = user.email;

  let emailTemplate;

  const template = fs.readFileSync(
    './emailTemplates/companyAdminSignUp.html',
    'utf-8'
  );

  emailTemplate = template.replace(
    '{{Setup Password Url}}',
    `${process.env.CLIENT_URL}/settings?token=${jwt}`
  );

  const mailOptions = {
    to: emailRecipient,
    subject: emailSubect,
    html: emailTemplate,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(`Error occurred while sending the email: ${error}`);
      logger.error(`Error occurred while sending the email: ${error}`);
    } else {
      console.log('Email sent successfully!');
      logger.info('Email sent successfully!');
    }
  });
};

const sendCompanyEmployeeSignUpEmail = async (user, jwt) => {
  const emailSubect =
    'Welcome to PhishDefender - Your Employee Account has been Created';
  const emailRecipient = user.email;

  let emailTemplate;

  const template = fs.readFileSync(
    './emailTemplates/companyEmployeeSignUp.html',
    'utf-8'
  );

  emailTemplate = template.replace(
    '{{Setup Password Url}}',
    `${process.env.CLIENT_URL}/settings?token=${jwt}`
  );

  const mailOptions = {
    to: emailRecipient,
    subject: emailSubect,
    html: emailTemplate,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(`Error occurred while sending the email: ${error}`);
      logger.error(`Error occurred while sending the email: ${error}`);
    } else {
      console.log('Email sent successfully!');
      logger.info('Email sent successfully!');
    }
  });
};

const sendDemoRequestEmail = async (name, email, company, message) => {
  const emailSubect =
    'Demo Request Notification - A potential client is interested!';
  const emailRecipient = process.env.SUPER_ADMIN_EMAIL;

  let emailTemplate;

  const template = fs.readFileSync(
    './emailTemplates/demoRequest.html',
    'utf-8'
  );

  emailTemplate = template
    .replace('{{Client Name}}', name)
    .replace('{{Client Email}}', email)
    .replace('{{Client Company}}', company)
    .replace('{{Client Message}}', message);

  const mailOptions = {
    to: emailRecipient,
    subject: emailSubect,
    html: emailTemplate,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(`Error occurred while sending the email: ${error}`);
      logger.error(`Error occurred while sending the email: ${error}`);
    } else {
      console.log('Email sent successfully!');
      logger.info('Email sent successfully!');
    }
  });
};

const sendContactUsEmail = async (firstName, lastName, email, message) => {
  const emailSubect =
    'Contact Inquiry Alert - A Message from a Prospective Client';
  const emailRecipient = process.env.SUPER_ADMIN_EMAIL;

  let emailTemplate;

  const template = fs.readFileSync('./emailTemplates/contactUs.html', 'utf-8');

  emailTemplate = template
    .replace('{{Client First Name}}', firstName)
    .replace('{{Client Last Name}}', lastName)
    .replace('{{Client Email}}', email)
    .replace('{{Client Message}}', message);

  const mailOptions = {
    to: emailRecipient,
    subject: emailSubect,
    html: emailTemplate,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(`Error occurred while sending the email: ${error}`);
      logger.error(`Error occurred while sending the email: ${error}`);
    } else {
      console.log('Email sent successfully!');
      logger.info('Email sent successfully!');
    }
  });
};

const validTags = process.env.VALID_TAGS.split(',');
validTags.push('{{Report Phishing Url}}');
validTags.push('{{Tracking Pixel Url}}');

const replaceTags = (template, user, reportPhishingUrl, trackingPixelUrl) => {
  let emailTemplate = template;

  const tagToData = {
    '{{First Name}}': user.firstName,
    '{{Last Name}}': user.lastName,
    '{{Email}}': user.email,
    '{{Phone Number}}': user.phoneNumber,
    '{{Mobile Number}}': user.mobileNumber,
    '{{Company Name}}': user.Company ? user.Company.name : '',
    '{{Company Email}}': user.Company ? user.Company.email : '',
    '{{Job Title}}': user.jobTitle,
    '{{LinkedIn}}': user.linkedin,
    '{{Location}}': user.location,
    '{{Department}}': user.department,
    '{{Language}}': user.language,
    '{{Line Manager First Name}}': user.LineManager
      ? user.LineManager.firstName
      : '',
    '{{Line Manager Last Name}}': user.LineManager
      ? user.LineManager.lastName
      : '',
    '{{Line Manager Email}}': user.LineManager ? user.LineManager.email : '',
    '{{Report Phishing Url}}': reportPhishingUrl,
    '{{Tracking Pixel Url}}': trackingPixelUrl,
  };

  validTags.forEach((tag) => {
    const userValue = tagToData[tag] || '';
    emailTemplate = emailTemplate.replace(new RegExp(tag, 'g'), userValue);
  });

  return emailTemplate;
};

const sendPhishingEmail = async (user, campaignId, template) => {
  const emailSubect = template.subject;
  const emailRecipient = user.email;

  const reportPhishingUrl = `${
    process.env.BACKEND_URL
  }/stats/reportPhishing?userId=${encodeURIComponent(
    user.id
  )}&campaignId=${encodeURIComponent(campaignId)}`;
  const trackingPixelUrl = `${
    process.env.BACKEND_URL
  }/stats/reportEmailOpen?userId=${encodeURIComponent(
    user.id
  )}&campaignId=${encodeURIComponent(campaignId)}`;

  const emailTemplate = replaceTags(
    template.body,
    user,
    reportPhishingUrl,
    trackingPixelUrl
  );

  const mailOptions = {
    to: emailRecipient,
    subject: emailSubect,
    html: emailTemplate,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(`Error occurred while sending the email: ${error}`);
      logger.error(`Error occurred while sending the email: ${error}`);
    } else {
      console.log('Email sent successfully!');
      logger.info('Email sent successfully!');
    }
  });
};

const sendResetPasswordEmail = async (user, jwt) => {
  const emailSubect = 'PhishDefender - Reset Your Password';
  const emailRecipient = user.email;

  let emailTemplate;

  const template = fs.readFileSync(
    './emailTemplates/resetPassword.html',
    'utf-8'
  );

  emailTemplate = template.replace(
    '{{Reset Password Url}}',
    `${process.env.CLIENT_URL}/settings?type=reset&token=${jwt}`
  );

  const mailOptions = {
    to: emailRecipient,
    subject: emailSubect,
    html: emailTemplate,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(`Error occurred while sending the email: ${error}`);
      logger.error(`Error occurred while sending the email: ${error}`);
    } else {
      console.log('Email sent successfully!');
      logger.info('Email sent successfully!');
    }
  });
};

module.exports = {
  sendCompanyAdminSignUpEmail,
  sendCompanyEmployeeSignUpEmail,
  sendDemoRequestEmail,
  sendContactUsEmail,
  sendPhishingEmail,
  sendResetPasswordEmail,
};