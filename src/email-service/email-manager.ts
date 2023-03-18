import { EmailAdapter } from './email-adapter';
import { UserDocument } from '../features/users/schema/user.schema';

export const EmailManager = {
  async sendRegistrationEmail(user: UserDocument) {
    await EmailAdapter.sendEmail(
      user.accountData.email,
      'Registration Confirmation',
      `<h1>Thank for your registration</h1>
       <p>To finish registration please follow the link below:
          <a href='https://somesite.com/confirm-email?code=${user.emailConfirmation.confirmationCode}'>complete registration</a>
      </p>`,
    );
  },

  async sendPasswordRecoveryEmail(email: string, recoveryCode: string) {
    await EmailAdapter.sendEmail(
      email,
      'PasswordRecovery',
      `<h1>Password recovery</h1>
       <p>To finish password recovery please follow the link below:
          <a href='https://somesite.com/password-recovery?recoveryCode=${recoveryCode}'>recovery password</a>
      </p>`,
    );
  },
};
