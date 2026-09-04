import { Request, Response } from "express"
import { AdminInvitesService } from "../services/admin.js";
import { UserRepository } from "../db/queries/users.js";
import { adminInvitesRepository } from "../db/queries/adminInvites.js";
import { CryptoService } from "../utils/crypto.js";
import { createAdminInvitationSchema } from "../schemas.js";

export const adminService = new AdminInvitesService(
    new UserRepository(),
    new adminInvitesRepository(),
    new CryptoService()
);

export async function createAdminInvitationController(req: Request, res: Response) {
    const result = createAdminInvitationSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({
            errors: result.error.issues
        });
        return;
    }

    const { email: invitedEmail } = result.data;
    const invitedBy = req.user.id;

    const inviteLink = await adminService.createInvite(
        invitedEmail, invitedBy
    );
    res.status(201).json({ link: inviteLink });
}

export async function acceptAdminInvitationController(req: Request, res: Response) {
    const email = req.user.email;
    const token = req.body.token;
    await adminService.acceptInvite(email, token);
    res.status(201).json({ message: "officially, you are an admin now..." });
}