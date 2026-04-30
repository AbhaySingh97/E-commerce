import { NewsletterSubscriber } from '../models/NewsletterSubscriber.js';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const subscribe = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();

    if (!email || !emailPattern.test(email)) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    const subscriber = await NewsletterSubscriber.findOneAndUpdate(
      { email },
      { email, source: req.body.source || 'homepage', isActive: true },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(201).json({
      message: 'Subscribed successfully',
      subscriber: { id: subscriber._id, email: subscriber.email }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to subscribe' });
  }
};
