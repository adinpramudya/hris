import { Injectable } from '@nestjs/common';
import { readFile } from 'fs/promises';
import * as nodemailer from 'nodemailer';
@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly templatePath = 'src/templates/email/index.html';
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail', // atau gunakan layanan email lain
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
  }

  async sendMail(
    to: string,
    subject: string,
    variables: Record<string, any>,
  ): Promise<void> {
    try {
      let html = await readFile(this.templatePath, 'utf8');

      Object.keys(variables).forEach((key) => {
        const placeholder = `{{${key}}}`;
        html = html.replace(new RegExp(placeholder, 'g'), variables[key]);
      });

      const mailOptions = {
        from: process.env.EMAIL,
        to,
        subject,
        html,
      };

      // Kirim email
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}
