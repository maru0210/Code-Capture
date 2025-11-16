import hljs from "highlight.js";
import "highlight.js/styles/atom-one-light.min.css";
import * as htmlToImage from "html-to-image";
import { useRef, useState } from "react";
import Icon from "./components/Icon";
import useNotice, { type NoticeType } from "./hooks/useNotice";
import { prettier } from "./libs/utils";

function App() {
  const [source, setSource] = useState("");
  const [width, setWidth] = useState(60);
  const [notices, notify] = useNotice();

  const divRef = useRef<HTMLDivElement>(null);

  async function handlePrettier() {
    try {
      setSource(await prettier(source, width));
    } catch (error) {
      if (error instanceof SyntaxError) {
        notify(`[SyntaxError] ${error.message}`, "error");
      } else {
        notify(`[Error] ${String(error)}`, "error");
      }
    }
  }

  function highlight(text: string) {
    return hljs.highlight(text, { language: "TypeScript" }).value;
  }

  async function save(options: { clipbourd?: boolean } = { clipbourd: false }) {
    const div = divRef.current;
    if (!div) return;

    const canvas = await notify("画像変換中", "process", () =>
      htmlToImage.toCanvas(div, {
        canvasWidth: div.offsetWidth * 2,
        canvasHeight: div.offsetHeight * 2,
      }),
    );

    if (options.clipbourd) {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
      }, "image/png");
      notify("クリップボードにコピーしました");
    } else {
      const anchor = document.createElement("a");
      anchor.href = canvas.toDataURL("image/png");
      anchor.download = "capture.png";
      anchor.click();
      notify("画像を保存しました");
    }
  }

  return (
    <div className="h-screen w-screen text-[#333]">
      <div className="mx-auto flex size-full p-16">
        <div className="flex flex-1 flex-col space-y-2">
          <div className="flex items-center justify-between">
            <div className="px-1 text-xl font-semibold">Source Code</div>

            <div className="flex gap-2">
              <select
                className="select select-sm w-32"
                name="language"
                disabled
              >
                <option>TypeScript</option>
              </select>
              <button className="btn btn-sm btn-square" onClick={handlePrettier}>
                <Icon name="code" />
              </button>
            </div>
          </div>

          <div className="flex-1">
            <textarea
              className="textarea font-code size-full resize-none"
              name="source"
              value={source}
              onChange={(e) => setSource(e.target.value)}
            />
          </div>
        </div>

        <div className="divider divider-horizontal" />

        <div className="flex flex-1 flex-col space-y-2">
          <div className="flex items-center justify-between">
            <div className="px-1 text-xl font-semibold">Preview</div>
            <div className="h-8" />
            <div className="flex items-center gap-2">
              <div className="pb-0.5 text-sm font-bold">{width}ch</div>
              <input
                type="range"
                className="range range-xs w-32"
                min={40}
                max={100}
                step={10}
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="card card-border border-base-300 flex max-h-full items-center overflow-auto p-4">
            <div
              className="rounded-lg bg-zinc-50 px-4 py-3 outline-1 -outline-offset-1 outline-zinc-300"
              ref={divRef}
            >
              <pre
                className="font-code text-sm select-none"
                style={{ width: `${width}ch` }}
                dangerouslySetInnerHTML={{ __html: highlight(source) }}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              className="btn btn-sm btn-square"
              onClick={() => save({ clipbourd: true })}
            >
              <Icon name="clipboard" />
            </button>
            <button className="btn btn-sm btn-square" onClick={() => save()}>
              <Icon name="download" />
            </button>
          </div>
        </div>
      </div>

      <div className="toast toast-center *:mx-auto">
        {notices.map(({ id, type, msg }) => (
          <Alert type={type} msg={msg} key={id} />
        ))}
      </div>
    </div>
  );
}

export default App;

function Alert({ type, msg }: { type: NoticeType; msg: string }) {
  switch (type) {
    case "info":
      return (
        <div>
          <div className="join join-vertical animate-notice-fadeout card overflow-hidden">
            <div className="alert join-item">
              <Icon name="info" />
              <span>{msg}</span>
            </div>
            <div className="join-item h-1">
              <div className="animate-notice-progress h-full bg-blue-300" />
            </div>
          </div>
        </div>
      );
    case "error":
      return (
        <div className="join join-vertical animate-notice-fadeout card overflow-hidden">
          <div className="alert alert-error alert-soft join-item">
            <Icon name="error" />
            <pre>{msg}</pre>
          </div>
          <div className="join-item h-1">
            <div className="animate-notice-progress h-full bg-red-300" />
          </div>
        </div>
      );
    case "process":
      return (
        <div className="alert">
          <span className="animate-spin">
            <Icon name="loading" />
          </span>
          {msg}
        </div>
      );
  }
}
