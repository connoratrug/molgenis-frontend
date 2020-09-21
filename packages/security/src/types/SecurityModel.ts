import { LoginUser } from './LoginUser'
import { Group } from './Group'
import { GroupMember } from './GroupMember'
import { GroupRole } from './GroupRole'
import { User } from './User'
import { GroupRollSubSelection } from './GroupRollSubSelection'
import { Toast } from './Toast'

export type SecurityModel = {
  loginUser: LoginUser | {};
  groups: Array<Group>;
  groupMembers: { string: Array<GroupMember> } | {};
  groupRoles: { string: Array<GroupRole> } | {};
  groupPermissions: { string: Array<string> } | {};
  users: Array<User>;
  toast: Toast | null;
  groupRights: { user: null | GroupRollSubSelection; anonymous: null | GroupRollSubSelection; roles: [] };
}
