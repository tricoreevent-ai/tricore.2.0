import { z } from 'zod';

import { objectIdSchema } from './common.js';
import { registrationPayloadSchema } from './registrationValidation.js';

export const createOrderSchema = z.object({
  body: z.object({
    eventId: objectIdSchema
  })
});

export const verifyPaymentSchema = z.object({
  body: z.object({
    eventId: objectIdSchema,
    registration: registrationPayloadSchema.superRefine((value, context) => {
      if (!value.termsAccepted) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'You must accept the Terms & Conditions and fair-play rules before registering.',
          path: ['termsAccepted']
        });
      }
    }),
    razorpayOrderId: z.string().min(5, 'Order id is required.'),
    razorpayPaymentId: z.string().min(5, 'Payment id is required.'),
    razorpaySignature: z.string().min(5, 'Payment signature is required.')
  })
});
