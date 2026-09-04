import { config } from "../config.js";
import { db } from "../db/index.js";
import { adminInvitesRepository } from "../db/queries/adminInvites.js";
import { UserRepository } from "../db/queries/users.js";
import { BadRequestError, NotFoundError } from "../errors/http.js";
import { CryptoService } from "../utils/crypto.js";

export class AdminInvitesService {
    constructor(
        private userRepo: UserRepository,
        private adminInvitesRepo: adminInvitesRepository,
        private cryptoService: CryptoService,
    ) { }

    /**@returns invitation link string */
    async createInvite(
        email: string,
        invitedBy: string
    ): Promise<string> {
        const invited = await this.userRepo.findUserByEmail(email);
        if (!invited) throw new NotFoundError("there is no user with  provided email");
        if (invited.role === "admin") throw new BadRequestError("user is already an admin");

        const token = this.cryptoService.generateRandomToken();
        const tokenHash = this.cryptoService.hashToken(token);

        await this.adminInvitesRepo.storeInvite(
            email,
            invitedBy,
            tokenHash,
            new Date(Date.now() + config.adminInvites.expiresAtMs)
        );
        return `${config.baseUrl}/admin/accept?token=${token}`;
    }
    async acceptInvite(
        email: string,
        token: string
    ): Promise<any> {
        const tokenHash = this.cryptoService.hashToken(token);
        const invite = await this.adminInvitesRepo.findInviteByTokenHash(tokenHash);
        if (!invite) throw new NotFoundError("Invalid invitation token");

        if (invite.expiresAt < new Date()) throw new BadRequestError("token has expired");

        if (invite.acceptedAt) throw new BadRequestError("Invitation has already been used");

        await db.transaction(async (tx) => {
            await this.userRepo.updateRoleToAdmin(email, tx);
            await this.adminInvitesRepo.acceptInvite(tokenHash, tx);
        });
    }
}