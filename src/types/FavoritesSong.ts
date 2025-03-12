import { UUID } from "crypto";

export type FavoritesSong = {
  id: UUID;
  user_id: UUID;
  song_id: UUID;
  created_at: Date;
};
