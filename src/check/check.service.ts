import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Check, CheckDocument } from './check.schema';
import { CheckDTO } from './checkDTO';
import { MailerService } from '@nestjs-modules/mailer';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CheckService {
  constructor(
    @InjectModel(Check.name) private checkModel: Model<CheckDocument>,
    private readonly mailerService: MailerService,
  ) {}

  // Scheduled job to check for upcoming deposit dates daily
  @Cron(CronExpression.EVERY_DAY_AT_10AM)
  async handleCheckNotifications() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const endOfTomorrow = new Date(tomorrow);
    endOfTomorrow.setHours(23, 59, 59, 999);

    const checksDueTomorrow = await this.checkModel
      .find({
        dateDepotCheck: {
          $gte: tomorrow,
          $lte: endOfTomorrow,
        },
        notificationSent: { $ne: true },
        status: { $in: ['init', 'en attente'] },
      })
      .exec();

    for (const check of checksDueTomorrow) {
      await this.sendCheckNotification(check);
      await this.checkModel.findByIdAndUpdate(check._id, {
        notificationSent: true,
      });
    }
  }

  private async scheduleCheckNotification(check: any) {
    await this.checkModel.findByIdAndUpdate(check._id, {
      notificationSent: false,
    });
  }

  private async sendCheckNotification(check: Check) {
    try {
      await this.mailerService.sendMail({
        to: 'finance@yourcompany.com', // Replace with actual recipient
        subject: `[Check Reminder] ${check.numCheck} - ${check.nomPersonne} - ${check.montant_in} DH`,
        // template: './check-reminder',
        html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #2c3e50;">Rappel de Dépôt de Chèque</h2>

    <p>Bonjour,</p>

    <p>Vous avez un chèque à déposer demain :</p>

    <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #3498db; margin: 20px 0;">
        <p><strong>Numéro de chèque:</strong> {{numCheck}}</p>
        <p><strong>Nom:</strong> {{nom}}</p>
        <p><strong>Personne:</strong> {{nomPersonne}}</p>
        <p><strong>Montant entrant:</strong> {{montant_in}} DH</p>
        <p><strong>Montant sortant:</strong> {{montant_ou}} DH</p>
        <p><strong>Date d'émission:</strong> {{dateCheck}}</p>
        <p><strong>Date de dépôt prévue:</strong> {{dateDepotCheck}}</p>
        <p><strong>Statut:</strong> {{status}}</p>
    </div>

    <p>Merci de prendre les dispositions nécessaires pour le dépôt de ce chèque.</p>

    <p>Cordialement,</p>
    <p>L'équipe de gestion des chèques</p>

    <div style="margin-top: 30px; font-size: 12px; color: #7f8c8d;">
        <p>Ceci est un message automatique, merci de ne pas y répondre.</p>
    </div>
    </div>`,
        context: {
          numCheck: check.numCheck,
          nom: check.nom,
          nomPersonne: check.nomPersonne,
          dateCheck: check.dateCheck.toLocaleDateString(),
          dateDepotCheck: check.dateDepotCheck.toLocaleDateString(),
          montant_in: check.montant_in,
          montant_ou: check.montant_ou,
          status: check.status,
        },
      });
    } catch (error) {
      console.error(
        `Failed to send notification for check ${check.numCheck}:`,
        error,
      );
    }
  }

  async create(createCheckDto: CheckDTO): Promise<Check> {
    const createdCheck = new this.checkModel({
      ...createCheckDto,
      dateCheck: new Date(createCheckDto.dateCheck),
      dateDepotCheck: new Date(createCheckDto.dateDepotCheck),
    });
    const savedCheck = await createdCheck.save();
    await this.scheduleCheckNotification(savedCheck);
    return savedCheck;
  }

  async findAll(): Promise<Check[]> {
    return this.checkModel.find().exec();
  }

  async findOne(id: string): Promise<Check> {
    return this.checkModel.findById(id).exec();
  }

  async findByNumCheck(numCheck: string): Promise<Check> {
    return this.checkModel.findOne({ numCheck }).exec();
  }

  async update(id: string, updateCheckDto: CheckDTO): Promise<Check> {
    const updateData: any = { ...updateCheckDto };

    if (updateCheckDto.dateCheck) {
      updateData.dateCheck = new Date(updateCheckDto.dateCheck);
    }
    if (updateCheckDto.dateDepotCheck) {
      updateData.dateDepotCheck = new Date(updateCheckDto.dateDepotCheck);
    }

    const updatedCheck = await this.checkModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (updateCheckDto.dateDepotCheck) {
      await this.scheduleCheckNotification(updatedCheck);
    }

    return updatedCheck;
  }

  async remove(id: string): Promise<Check> {
    return this.checkModel.findByIdAndDelete(id).exec();
  }

  async findByStatus(status: string): Promise<Check[]> {
    return this.checkModel.find({ status }).exec();
  }
}
