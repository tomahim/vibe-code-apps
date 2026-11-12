import DOMPurify from "dompurify";
import { marked } from "marked";

function Markdown({ source }) {
  const html = DOMPurify.sanitize(marked.parse(source || ""));
  return <div className="grain-markdown" dangerouslySetInnerHTML={{ __html: html }} />;
}

export { Markdown };
