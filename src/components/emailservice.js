// emailService.js
import emailjs from 'emailjs-com';

const SERVICE_ID = 'service_rwhaacm';
const TEMPLATE_ID = 'template_u6tdph4';
const USER_ID = 'BXeKx0n1u-bGurfb1';

export const sendEmail = (userEmail, userName, message) => {
  const templateParams = {
    to_email: userEmail,
    to_name: userName,
    message: message,
  };

  emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, USER_ID)
    .then((response) => {
      console.log('SUCCESS!', response.status, response.text);
    }, (error) => {
      console.error('FAILED...', error);
    });
};
