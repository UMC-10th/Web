// TMDB - API - MOVIES - Credits 참고 바람

export type Person = {
      adult: boolean;
      gender: number;
      id: 819;
      known_for_department: string;
      name: string;
      original_name: string;
      popularity: number;
      profile_path: string;
      cast_id: number;
      character: string;
      credit_id: string;
      order: string;
      job?: string;
}

export type CreditsResponse = {
  id: number;
  cast: Person[]; // 배우나 작가 등...
  crew: Person[]; // 제작진 ~ 감독도 여기에 위치
}