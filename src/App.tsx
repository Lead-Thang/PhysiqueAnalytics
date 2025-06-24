interface DocumentPictureInPicture {
  window: Window | null;
  requestWindow(options: { width: number; height: number; disallowReturnToOpener: boolean }): Promise<Window>;
}
import Image from 'next/image'; // Import Image component from next/image

import { useEffect } from 'react';
import LogoImage from 'asset/Conceivin.logo.png'; // Renamed to avoid conflict with potential component or HTML tag

function App() {
  useEffect(() => {
    const cacheName = 'dynamic-agent-v1';
    // 为 event 添加类型声明
    const handlePictureInPictureRequest = async (event: MessageEvent) => {
      if (event.data.type !== 'jf-request-pip-window') return;
      const { url, width, height } = event.data;
      
      // 检查 documentPictureInPicture 是否存在
      const docWindow = window as Window & { documentPictureInPicture?: DocumentPictureInPicture };
      const pipInterface = docWindow.documentPictureInPicture;
      
      // 如果已经存在 pip 窗口则返回
      if (pipInterface?.window) return;
      
      // 请求新的 pip 窗口
      const pipWindowInstance = await docWindow.documentPictureInPicture?.requestWindow({
        width,
        height,
        disallowReturnToOpener: true
      });
      
      if (pipWindowInstance) {
        // 复制样式表到 pip 窗口
        Array.from(document.styleSheets).forEach(styleSheet => {
          try {
            const cssRules = Array.from((styleSheet as CSSStyleSheet).cssRules).map(rule => rule.cssText).join('');
            const style = document.createElement('style');
            style.textContent = cssRules;
            pipWindowInstance.document.head.appendChild(style);
          } catch (e) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            // 将 media 转换为字符串
            link.media = Array.from(styleSheet.media).join(', ');
            // 检查 href 是否为 null 并提供默认值
            link.href = styleSheet.href ?? '';
            pipWindowInstance.document.head.appendChild(link);
          }
        });
        
        // 添加 iframe 到 pip 窗口
        pipWindowInstance.document.body.innerHTML = `<iframe src="${url}" style="width: ${width}px; height: ${height}px;" allow="microphone *; display-capture *;"></iframe>`;
      }
      
      return { success: true, isActive: false };
    };

    window.addEventListener('message', handlePictureInPictureRequest);

    const src = "https://www.jotform.com/s/umd/96b59f19f71/for-embedded-agent.js";
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = function () {
      // 为 AgentInitializer 定义类型
      interface AgentConfig {
        agentRenderURL: string;
        rootId: string;
        formID: string;
        contextID: string;
        initialContext: string;
        queryParams: string[];
        domain: string;
        isDraggable: boolean;
        background: string;
        buttonBackgroundColor: string;
        buttonIconColor: string;
        inputTextColor: string;
        variant: boolean;
        customizations: Record<string, string | boolean>;
        isVoice: boolean;
        isVoiceWebCallEnabled: boolean;
      }
          
      // 使用类型断言处理 AgentInitializer 类型问题
      (window as any).AgentInitializer.init({
        agentRenderURL: "https://www.jotform.com/agent/01979b22ef227374a482077555c49f8a1e44",
        rootId: "JotformAgent-01979b22ef227374a482077555c49f8a1e44",
        formID: "01979b22ef227374a482077555c49f8a1e44",
        contextID: "01979b884ee77ae99d961e742f312ea57d64",
        initialContext: "",
        queryParams: ["skipWelcome=1", "maximizable=1"],
        domain: "https://www.jotform.com",
        isDraggable: false,
        background: "linear-gradient(180deg, #100d22 0%, #06021d 100%)",
        buttonBackgroundColor: "#8797FF",
        buttonIconColor: "#01091B",
        inputTextColor: "#EAE9FF",
        variant: false,
        customizations: { "greeting": "Yes", "greetingMessage": "Hi! How can I assist you?", "openByDefault": "No", "pulse": "Yes", "position": "right", "autoOpenChatIn": "0" },
        isVoice: false,
        isVoiceWebCallEnabled: true
      });
    };
    
    document.head.appendChild(script);

    // Cleanup script and event listener on unmount
    return () => {
      window.removeEventListener('message', handlePictureInPictureRequest);
      const existingScript = document.querySelector(`script[src="${src}"]`);
      existingScript?.remove();
    };
  }, []);

  return (
    <div className="App"> {/* This div is likely the one causing "Cannot find name 'div'" if parsing fails earlier */}
      <Image src={LogoImage} alt="Conceivin3D Logo" width={50} height={50} /> {/* Use Image component for the logo */}
      {/* Other components */}
    </div>
  );
}

export default App;