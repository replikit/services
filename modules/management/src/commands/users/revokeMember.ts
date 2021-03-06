import { authorizeMember } from "@replikit/authorization";
import { Command, required } from "@replikit/commands";
import { CommandResult } from "@replikit/commands/typings";
import { fromCode } from "@replikit/messages";
import { MemberPermission } from "@replikit/permissions";
import { member } from "@replikit/storage";
import { ManagementLocale, ManagementMemberPermission } from "@services/management";

export class RevokeMemberCommand extends Command {
    name = "revoke";

    middleware = [authorizeMember(ManagementMemberPermission.ManagePermissions)];

    member = member({ channelRequired: true, userRequired: true });
    permission = required(MemberPermission);

    async execute(): Promise<CommandResult> {
        const { member } = this.member;

        member.revoke(this.permission);
        await member.save();

        const locale = this.getLocale(ManagementLocale);
        return fromCode(locale.userPermissionsUpdated);
    }
}
