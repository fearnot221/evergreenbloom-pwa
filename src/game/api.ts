import { useEffect, useState } from 'react';

export type Receipt = { id: string; redeemed_at: string; reviewer: string };
export type GameState = {
  user: { id: string; username: string; role: 'player' | 'staff' };
  stamps: Record<string, string>;
  photos: Record<string, 'pending' | 'approved' | 'rejected'>;
  redeemCode: string | null;
  redemption: Receipt | null;
};
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export async function api<T>(path: string, value?: unknown, init: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`/api${path}`, {
      credentials: 'same-origin',
      cache: 'no-store',
      ...init,
      ...(value === undefined
        ? {}
        : {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(value),
          }),
    });
  } catch {
    throw new Error('目前無法連線，請恢復連線後重試。集章與兌獎需要伺服器確認。');
  }
  const data = await response.json().catch(() => null);
  if (!response.ok)
    throw new ApiError(response.status, data?.error ?? '服務暫時無法使用，請稍後再試。');
  if (data === null) throw new Error('伺服器回應格式錯誤，請稍後重試。');
  return data;
}

export function useAccount() {
  const [data, setData] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const refresh = async () => {
    setLoading(true);
    setError('');
    try {
      setData(await api<GameState>('/me'));
    } catch (error) {
      setData(null);
      if (!(error instanceof ApiError && error.status === 401)) setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    let alive = true;
    api<GameState>('/me')
      .then((state) => {
        if (alive) setData(state);
      })
      .catch((error) => {
        if (alive && !(error instanceof ApiError && error.status === 401)) setError(error.message);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);
  const logout = async () => {
    setLoading(true);
    setError('');
    try {
      await api('/logout', {});
      setData(null);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };
  return {
    data,
    setData: (state: GameState | null) => {
      setError('');
      setData(state);
    },
    loading,
    error,
    refresh,
    logout,
  };
}

export const savedTime = (value: string) =>
  new Date(value).toLocaleString('zh-TW', { timeZone: 'Asia/Taipei', hour12: false });
