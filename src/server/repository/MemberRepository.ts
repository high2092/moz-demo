import { User } from '../../type/user';

class MemberRepository {
  sequence: number;
  members: Record<number, User>;

  constructor() {
    this.sequence = 1;
    this.members = {};
  }

  save(member: User) {
    const id = this.sequence++;
    member.id = id;
    this.members[id] = member;
  }

  findById(id: number) {
    return this.members[id];
  }
}

export const memberRepository = new MemberRepository();
