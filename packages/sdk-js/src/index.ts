import { z } from 'zod';

const licenseSchema = z.object({
  sub: z.string(),
  appId: z.string(),
  exp: z.string(),
  features: z.array(z.string()).optional(),
  kid: z.string()
});

export type LicensePayload = z.infer<typeof licenseSchema>;

export function verifyLicense(token: string): LicensePayload | null {
  try {
    const decoded = JSON.parse(Buffer.from(token.split('.')[1] ?? '', 'base64url').toString('utf8'));
    return licenseSchema.parse(decoded);
  } catch (err) {
    return null;
  }
}
