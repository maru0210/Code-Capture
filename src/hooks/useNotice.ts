import { useCallback, useState } from "react";

export type NoticeType = "info" | "error" | "process";

type Notice = {
  id: number;
  type: NoticeType;
  msg: string;
};

type Notify = {
  (msg: string): void;
  (msg: string, type: "error"): void;
  <T>(msg: string, type: "process", process: () => Promise<T>): Promise<T>;
};

export default function useNotice(): [notices: Notice[], notify: Notify] {
  const [notices, setNotices] = useState<Notice[]>([]);

  const notify: Notify = useCallback(
    async <S>(msg: string, type: NoticeType = "info", process?: () => S) => {
      const id = Date.now();
      const notice: Notice = { id, type, msg };

      switch (type) {
        case "info":
        case "error":
          setNotices((prev) => [...prev, notice]);
          setTimeout(
            () => setNotices((prev) => prev.filter((v) => v.id != id)),
            3000,
          );
          return;
        case "process":
          setNotices((prev) => [...prev, notice]);
          const value = await process?.();
          setNotices((prev) => prev.filter((v) => v.id != id));
          return value;
      }
    },
    [],
  );

  return [notices, notify];
}
