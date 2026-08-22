import { Request, Response } from 'express';
import { ContactInquiry } from '../models/ContactInquiry';

export const submitInquiry = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'Name, email, and inquiry message are required.' });
    }

    const inquiry = await ContactInquiry.create({
      name,
      email: email.toLowerCase().trim(),
      phone: phone || '',
      subject: subject || 'General Concierge Inquiry',
      message,
      status: 'unread',
    });

    return res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully. A Premier Tours advisor will respond within 24 hours.',
      data: inquiry,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const getInquiries = async (req: Request, res: Response) => {
  try {
    const inquiries = await ContactInquiry.find().sort({ createdAt: -1 });
    return res.json({ success: true, count: inquiries.length, data: inquiries });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
