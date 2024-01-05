import { Injectable } from "@nestjs/common";

@Injectable()
export class BlacklistService {
  private revokedTokens: Set<string> = new Set();

  addToBlacklist(token: string): void{
    this.revokedTokens.add(token);
  }

  isTokenRevoked(token: string): boolean{
    return this.revokedTokens.has(token);
  }
}