import { memberRepository } from '../repository/MemberRepository';

class MemberService {
  toggleReady(id: number) {
    const member = memberRepository.findById(id);
    member.isReady = !member.isReady;
  }
}

export const memberService = new MemberService();
