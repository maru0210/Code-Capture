import hljs from "highlight.js";
import "highlight.js/styles/atom-one-light.min.css";
import * as htmlToImage from "html-to-image";
import { useRef, useState } from "react";

function App() {
  const [text, setText] = useState("");

  const divRef = useRef<HTMLDivElement>(null);

  function highlight(text: string) {
    return hljs.highlight(text, { language: "javascript" }).value;
  }

  async function clip() {
    const div = divRef.current;
    if (!div) return;

    const width = div.offsetWidth;
    const height = div.offsetHeight;

    const canvas = await htmlToImage.toCanvas(div, {
      canvasWidth: width * 2,
      canvasHeight: height * 2,
    });

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
    }, "image/png");

    alert("クリップボードに保存しました");

    // const anchor = document.createElement("a");
    // anchor.href = canvas.toDataURL("image/png");
    // anchor.download = "code.png";
    // anchor.click();
  }

  return (
    <div className="h-screen w-screen text-[#333]">
      <div className="flex size-full gap-8 p-8">
        <div className="flex flex-1 flex-col gap-2">
          <div className="text-lg font-bold">Source Code</div>
          <textarea
            className="font-code size-full resize-none rounded-lg p-3 outline-2 -outline-offset-2 outline-zinc-300"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <div className="flex flex-1 flex-col items-start gap-2">
          <div className="text-lg font-bold">Preview</div>
          <div
            className="rounded-lg bg-zinc-50 p-3 outline-1 -outline-offset-1 outline-zinc-300"
            ref={divRef}
          >
            <pre
              className="font-code"
              style={{ width: "30ch" }}
              dangerouslySetInnerHTML={{ __html: highlight(text) }}
            />
          </div>
          <button
            className="cursor-pointer rounded-lg bg-zinc-100 px-3 py-1 font-bold transition hover:brightness-90"
            onClick={clip}
          >
            CLIP
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
