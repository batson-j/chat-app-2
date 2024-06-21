import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Markdown from 'react-markdown';

export enum MessageType {
  Reply,
  UserMessage
}

export interface MessageProps {
  text: string;
  messageType: MessageType;
  provider?: string;
  model?: string;
}

const Message: React.FC<MessageProps> = ({ text, messageType }) => {
  const [copied, setCopied] = useState(false);
  const [hover, setHover] = useState(false);

  const getMessageClassName = () => {
    return messageType === MessageType.Reply
      ? 'py-1 px-4 bg-blue-900 rounded text-left'
      : 'py-1 px-4 bg-gray-900 rounded text-left';
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={getMessageClassName()}>
      <Markdown
        components={{
          code(props) {
            const { children, className, node, ...rest } = props;
            const match = /language-(\w+)/.exec(className || '');
            return match ? (
              <div
                className="relative"
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
              >
                <SyntaxHighlighter
                  {...{ ...rest, ref: undefined }} // Remove ref prop
                  PreTag="div"
                  language={match[1]}
                  style={dark}
                >
                  {String(children).trim()}
                </SyntaxHighlighter>
                {hover && (
                  <button
                    className="absolute top-4 right-4 p-2 text-xs text-gray-500 hover:text-gray-100"
                    onClick={() => handleCopy(String(children))}
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                )}
              </div>
            ) : (
              <code {...rest} className={className}>
                {children}
              </code>
            );
          }
        }}
      >
        {text}
      </Markdown>
    </div>
  );
};

export default Message;
